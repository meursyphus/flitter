/**
 * Generates the diagram API tables from the engine source, so names, types
 * and interaction defaults are never retyped by hand.
 *
 *   node scripts/gen-diagram-api.mjs          # write the data file
 *   node scripts/gen-diagram-api.mjs --check  # exit 1 when it is stale
 *
 * Reads packages/diagram/src/headless/flow-diagram/{types,controller,interaction}.ts
 * and writes docs/src/app/diagram/_data/api/flow.generated.ts.
 */
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const flowDir = path.resolve(docs, "../packages/diagram/src/headless/flow-diagram");
const outFile = path.join(docs, "src/app/diagram/_data/api/flow.generated.ts");

const flat = (text) => text.replace(/\s+/g, " ").replace(/;\s*}/g, " }").replace(/{\s+/g, "{ ").trim();

async function parse(file) {
  const text = await readFile(path.join(flowDir, file), "utf8");
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function docOf(node) {
  const parts = ts.getJSDocCommentsAndTags(node)
    .filter(ts.isJSDoc)
    .map((d) => ts.getTextOfJSDocComment(d.comment) ?? "");
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

const types = await parse("types.ts");
const aliases = new Map();
ts.forEachChild(types, (node) => {
  if (ts.isTypeAliasDeclaration(node)) aliases.set(node.name.text, node);
});

function alias(name) {
  const node = aliases.get(name);
  if (!node) throw new Error(`types.ts has no type ${name}`);
  return node;
}

function fieldsOf(typeNode) {
  if (!typeNode) return [];
  if (ts.isIntersectionTypeNode(typeNode)) return typeNode.types.flatMap(fieldsOf);
  if (ts.isTypeReferenceNode(typeNode) && aliases.has(typeNode.typeName.getText(types))) return fieldsOfAlias(typeNode.typeName.getText(types));
  if (!ts.isTypeLiteralNode(typeNode)) return [];
  return typeNode.members.filter(ts.isPropertySignature).map((m) => ({
    name: m.name.getText(types),
    type: m.type ? flat(m.type.getText(types)) : "unknown",
    optional: !!m.questionToken,
    doc: docOf(m),
  }));
}

const fieldsOfAlias = (name) => fieldsOf(alias(name).type);

/* ── Interaction defaults: run the real resolver for each preset ── */

/** Transpiles interaction.ts and its one runtime import (shared/utils) to a temp dir. */
async function loadResolver() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "diagram-api-"));
  const emit = async (source, target, rewrite = (code) => code) => {
    const text = await readFile(source, "utf8");
    const { outputText } = ts.transpileModule(text, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    await writeFile(path.join(dir, target), rewrite(outputText));
  };
  await emit(path.resolve(flowDir, "../../shared/utils.ts"), "utils.mjs");
  await emit(path.join(flowDir, "interaction.ts"), "interaction.mjs", (code) => {
    const imports = [...code.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
    for (const spec of imports) {
      if (spec !== "../../shared/utils") throw new Error(`interaction.ts gained a runtime import: ${spec}`);
    }
    return code.replace('"../../shared/utils"', '"./utils.mjs"');
  });
  try {
    return await import(pathToFileURL(path.join(dir, "interaction.mjs")).href);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const { resolveInteraction } = await loadResolver();
const presets = {
  editor: resolveInteraction("editor"),
  viewer: resolveInteraction("viewer"),
  whiteboard: resolveInteraction("whiteboard"),
};

function show(value) {
  if (value === undefined) return "—";
  if (typeof value === "function") return "fn";
  // The resolver picks Meta on macOS and Control elsewhere; the table says Mod.
  return JSON.stringify(value)
    .replace(/\b(Meta|Control)\+/g, "Mod+")
    .replace(/"(Meta|Control)"/g, '"Mod"')
    .replace(/"(\w+)":/g, "$1:")
    .replace(/,/g, ", ")
    .replace(/:/g, ": ")
    .replace(/{/g, "{ ")
    .replace(/}/g, " }");
}

const at = (obj, keys) => keys.reduce((o, k) => (o == null ? undefined : o[k]), obj);

function interactionRows(typeNode, prefix) {
  const rows = [];
  for (const m of typeNode.members.filter(ts.isPropertySignature)) {
    const keys = [...prefix, m.name.getText(types)];
    if (m.type && ts.isTypeLiteralNode(m.type)) {
      rows.push(...interactionRows(m.type, keys));
      continue;
    }
    rows.push({
      property: keys.slice(1).join(".") || keys[0],
      type: flat(m.type.getText(types)),
      editor: show(at(presets.editor, keys)),
      viewer: show(at(presets.viewer, keys)),
      whiteboard: show(at(presets.whiteboard, keys)),
    });
  }
  return rows;
}

const interaction = [];
for (const group of alias("FlowInteraction").type.members.filter(ts.isPropertySignature)) {
  const name = group.name.getText(types);
  if (ts.isTypeLiteralNode(group.type)) interaction.push({ group: name, rows: interactionRows(group.type, [name]) });
  else {
    const general = interaction.find((g) => g.group === "general") ?? interaction[interaction.push({ group: "general", rows: [] }) - 1];
    general.rows.push(...interactionRows({ members: [group] }, []));
  }
}

/* ── Custom slots: slot → args type → fields ── */

const custom = [];
for (const m of alias("FlowDiagramCustom").type.members.filter(ts.isPropertySignature)) {
  const slot = m.name.getText(types);
  let argsType = "";
  let returns = "Widget";
  let args = [];
  let argsNode;
  if (ts.isTypeReferenceNode(m.type) && m.type.typeName.getText(types) === "CustomArgs") {
    argsNode = m.type.typeArguments[0];
    argsType = argsNode.getText(types);
  } else if (ts.isFunctionTypeNode(m.type)) {
    const first = m.type.parameters[0];
    argsType = first.type.getText(types);
    returns = flat(m.type.type.getText(types));
  }
  // Expand `XxxArgs` objects; a plain parameter (defaultHandles gets a FlowNode) stays one row.
  if (argsNode && fieldsOf(argsNode).length && argsType !== "FlowNode") args = fieldsOf(argsNode);
  else if (argsType.endsWith("Args") && aliases.has(argsType)) args = fieldsOfAlias(argsType);
  else {
    const param = ts.isFunctionTypeNode(m.type) ? m.type.parameters[0].name.getText(types) : "args";
    args = [{ name: param, type: argsType, optional: false, doc: "" }];
  }
  custom.push({ slot, argsType, returns, doc: docOf(m), args });
}

/* ── Controller: public members of FlowDiagramController ── */

const controllerFile = await parse("controller.ts");
const controller = [];
ts.forEachChild(controllerFile, (node) => {
  if (!ts.isClassDeclaration(node) || node.name?.text !== "FlowDiagramController") return;
  for (const member of node.members) {
    if (!member.name || ts.isPrivateIdentifier(member.name)) continue;
    const mods = ts.getCombinedModifierFlags(member);
    if (mods & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected | ts.ModifierFlags.Static)) continue;
    const name = member.name.getText(controllerFile);
    const ret = member.type ? flat(member.type.getText(controllerFile)) : "";
    if (ts.isMethodDeclaration(member)) {
      const params = member.parameters.map((p) => {
        const pname = ts.isIdentifier(p.name) ? p.name.text : "options";
        const optional = p.questionToken || p.initializer ? "?" : "";
        return `${pname}${optional}${p.type ? `: ${flat(p.type.getText(controllerFile))}` : ""}`;
      });
      controller.push({ name, kind: "method", signature: `${name}(${params.join(", ")})${ret ? `: ${ret}` : ""}`, doc: docOf(member) });
    } else if (ts.isGetAccessorDeclaration(member)) {
      controller.push({ name, kind: "getter", signature: `${name}${ret ? `: ${ret}` : ""}`, doc: docOf(member) });
    } else if (ts.isPropertyDeclaration(member) && mods & ts.ModifierFlags.Readonly) {
      controller.push({ name, kind: "property", signature: `${name}${ret ? `: ${ret}` : ""}`, doc: docOf(member) });
    }
  }
});

const gestureNode = alias("Gesture").type;
const gestures = ts.isUnionTypeNode(gestureNode) ? gestureNode.types.map((t) => t.getText(types).replace(/"/g, "")) : [];

const data = {
  props: fieldsOfAlias("FlowDiagramProps"),
  events: fieldsOfAlias("FlowEvents"),
  gestures,
  interaction,
  custom,
  controller,
  node: fieldsOfAlias("FlowNode"),
  edge: fieldsOfAlias("FlowEdge"),
};

const output = `// Generated by docs/scripts/gen-diagram-api.mjs from packages/diagram/src/headless/flow-diagram. Do not edit.
import type { FlowApiGenerated } from "./types";

export const flowApi: FlowApiGenerated = ${JSON.stringify(data, null, 2)};
`;

if (process.argv.includes("--check")) {
  const current = await readFile(outFile, "utf8").catch(() => "");
  if (current !== output) {
    console.error("flow.generated.ts is stale. Run: node docs/scripts/gen-diagram-api.mjs");
    process.exit(1);
  }
  console.log("flow.generated.ts is up to date");
} else {
  await writeFile(outFile, output);
  const rows = interaction.reduce((n, g) => n + g.rows.length, 0);
  console.log(`wrote ${path.relative(process.cwd(), outFile)}: ${data.props.length} props, ${data.events.length} events, ${rows} interaction rows, ${custom.length} slots, ${controller.length} controller members`);
}
