const state = {
  registry: null,
  cases: [],
  selectedCaseId: null,
};

async function copyText(value, button) {
  await navigator.clipboard.writeText(value);
  const previous = button.textContent;
  button.textContent = "Copied";
  window.setTimeout(() => {
    button.textContent = previous;
  }, 1200);
}

function buildReaderPrompt(testCase) {
  const recommendedCharts = testCase.recommendedCharts.length
    ? `Preferred chart families: ${testCase.recommendedCharts.join(", ")}.`
    : "Preferred chart families: none. Treat this as a likely escape-hatch case.";

  return [
    "You are the first-read implementation agent.",
    "Use only the linked Flitter LLM pack documents below.",
    "",
    "Pack links:",
    ...testCase.pack.map((item) => `- ${item}`),
    "",
    "Task prompt:",
    testCase.prompt,
    "",
    recommendedCharts,
    "",
    "Return exactly these sections:",
    "1. Chart choice",
    "2. Why this family fits",
    "3. Clarifying questions",
    "4. Preset path or escape hatch",
    "5. Source paths to inspect",
    "",
    "Rules:",
    "- Start with chart-presets first.",
    "- Ask only the questions that materially change chart family, scale semantics, or layout semantics.",
    "- If presets do not fit, say so explicitly instead of inventing APIs.",
  ].join("\n");
}

function buildCriticPrompt(testCase) {
  return [
    "You are the context-aware critic for the Flitter chart LLM pack.",
    "Review the reader output against the linked documents and the checklist.",
    "",
    "Pack links:",
    ...testCase.pack.map((item) => `- ${item}`),
    "- /llm/critic-checklist.md",
    "",
    "Original task prompt:",
    testCase.prompt,
    "",
    "Review focus:",
    ...testCase.criticFocus.map((item) => `- ${item}`),
    "",
    "Reader output:",
    "<<PASTE READER OUTPUT HERE>>",
    "",
    "Return exactly these sections:",
    "1. Wrong assumptions",
    "2. Missing or low-value questions",
    "3. Correct chart choice and escape hatch",
    "4. Documentation gap to fix",
  ].join("\n");
}

function selectedCase() {
  return state.cases.find((testCase) => testCase.id === state.selectedCaseId) ?? state.cases[0];
}

function chartCard(chart) {
  return `
    <article class="catalog-card">
      <div class="card-head">
        <div>
          <p class="eyebrow">${chart.category}</p>
          <h3>${chart.title}</h3>
        </div>
        <a class="doc-link" href="/pack/chart/${chart.slug}.md" target="_blank" rel="noreferrer">Open brief</a>
      </div>
      <p class="card-copy">${chart.summary}</p>
      <div class="pill-row">
        <span class="pill">${chart.surface}</span>
        ${chart.supportedStyles.map((style) => `<span class="pill">${style}</span>`).join("")}
      </div>
      <p class="card-foot">Escape hatch: ${chart.escapeHatch}</p>
    </article>
  `;
}

function styleCard(style) {
  return `
    <article class="style-card">
      <p class="eyebrow">${style.slug}</p>
      <h3>${style.title}</h3>
      <p>${style.summary}</p>
      <ul>
        ${style.strengths.map((strength) => `<li>${strength}</li>`).join("")}
      </ul>
    </article>
  `;
}

function patternCard(pattern) {
  return `
    <article class="catalog-card">
      <div class="card-head">
        <div>
          <p class="eyebrow">pattern</p>
          <h3>${pattern.title}</h3>
        </div>
        <a class="doc-link" href="/pack/patterns/${pattern.slug}.md" target="_blank" rel="noreferrer">Open brief</a>
      </div>
      <p class="card-copy">${pattern.summary}</p>
      <div class="pill-row">
        ${(pattern.relatedCharts ?? []).slice(0, 3).map((item) => `<span class="pill">${item}</span>`).join("")}
      </div>
    </article>
  `;
}

function widgetCard(widget) {
  return `
    <article class="catalog-card compact-card">
      <div class="card-head">
        <div>
          <p class="eyebrow">${widget.category}</p>
          <h3>${widget.title}</h3>
        </div>
        <a class="doc-link" href="/pack/core/widgets/${widget.slug}.md" target="_blank" rel="noreferrer">Open doc</a>
      </div>
      <p class="card-copy">${widget.summary}</p>
    </article>
  `;
}

function conceptCard(concept) {
  return `
    <article class="catalog-card compact-card">
      <div class="card-head">
        <div>
          <p class="eyebrow">core concept</p>
          <h3>${concept.title}</h3>
        </div>
        <a class="doc-link" href="/pack/core/concepts/${concept.slug}.md" target="_blank" rel="noreferrer">Open doc</a>
      </div>
      <p class="card-copy">${concept.summary}</p>
    </article>
  `;
}

function render() {
  const app = document.getElementById("app");
  const currentCase = selectedCase();

  if (!state.registry || !currentCase) {
    app.innerHTML = `
      <div class="loading-shell">
        <div class="loading-card">
          <p class="eyebrow">LLM Playground</p>
          <h1>Pack unavailable</h1>
        </div>
      </div>
    `;
    return;
  }

  const readerPrompt = buildReaderPrompt(currentCase);
  const criticPrompt = buildCriticPrompt(currentCase);

  app.innerHTML = `
    <div class="shell">
      <header class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Flitter LLM Playground</p>
          <h1>Reader and critic prompts for first-read chart validation</h1>
          <p class="lede">
            This playground stays separate from chart-storybook. It reads the generated pack, lets
            you select evaluation cases, and gives you copy-ready prompts for a clean reader agent
            and a context-aware critic.
          </p>
        </div>
        <div class="hero-meta">
          <div class="meta-chip">
            <span>Generated</span>
            <strong>${state.registry.generatedAt}</strong>
          </div>
          <div class="meta-chip">
            <span>Charts</span>
            <strong>${state.registry.charts.length}</strong>
          </div>
          <div class="meta-chip">
            <span>Cases</span>
            <strong>${state.cases.length}</strong>
          </div>
          <div class="meta-chip">
            <span>Patterns</span>
            <strong>${(state.registry.patterns ?? []).length}</strong>
          </div>
          <div class="meta-chip">
            <span>Widgets</span>
            <strong>${(state.registry.widgets ?? []).length}</strong>
          </div>
        </div>
      </header>

      <div class="workspace">
        <aside class="sidebar">
          <div class="sidebar-card">
            <p class="eyebrow">Evaluation Cases</p>
            <div class="case-list">
              ${state.cases
                .map((testCase) => {
                  const active = testCase.id === currentCase.id ? " case-button-active" : "";
                  return `
                    <button class="case-button${active}" data-case-id="${testCase.id}">
                      <span>${testCase.title}</span>
                      <small>${testCase.recommendedCharts.length ? testCase.recommendedCharts.join(", ") : "escape hatch"}</small>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>

          <div class="sidebar-card">
            <p class="eyebrow">Pack Links</p>
            <div class="link-stack">
              <a href="/pack/chart.md" target="_blank" rel="noreferrer">/llm/chart.md</a>
              <a href="/pack/patterns.md" target="_blank" rel="noreferrer">/llm/patterns.md</a>
              <a href="/pack/core/concepts.md" target="_blank" rel="noreferrer">/llm/core/concepts.md</a>
              <a href="/pack/core/widget-catalog.md" target="_blank" rel="noreferrer">/llm/core/widget-catalog.md</a>
              <a href="/pack/scaffold-guide.md" target="_blank" rel="noreferrer">/llm/scaffold-guide.md</a>
              <a href="/pack/chart-registry.json" target="_blank" rel="noreferrer">/llm/chart-registry.json</a>
              <a href="/pack/evaluation-loop.md" target="_blank" rel="noreferrer">/llm/evaluation-loop.md</a>
              <a href="/pack/testing-prompts.md" target="_blank" rel="noreferrer">/llm/testing-prompts.md</a>
              <a href="/pack/critic-checklist.md" target="_blank" rel="noreferrer">/llm/critic-checklist.md</a>
              <a href="/pack/llms.txt" target="_blank" rel="noreferrer">/llms.txt</a>
            </div>
          </div>

          <div class="sidebar-card">
            <p class="eyebrow">Scaffold</p>
            <div class="command-card">
              <code>pnpm llm:kit list</code>
              <code>pnpm llm:kit show ${currentCase.recommendedCharts[0] ?? "scorecard-composite"}</code>
              <code>pnpm llm:kit scaffold ${currentCase.recommendedCharts[0] ?? "scorecard-composite"} --output tmp/${currentCase.recommendedCharts[0] ?? "scorecard-composite"}</code>
            </div>
          </div>
        </aside>

        <main class="content">
          <section class="panel prompt-panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Selected Case</p>
                <h2>${currentCase.title}</h2>
              </div>
              <div class="pill-row">
                ${currentCase.recommendedCharts.length
                  ? currentCase.recommendedCharts.map((item) => `<span class="pill">${item}</span>`).join("")
                  : '<span class="pill pill-warning">escape hatch</span>'}
              </div>
            </div>

            <p class="case-prompt">${currentCase.prompt}</p>

            <div class="detail-grid">
              <article class="detail-card">
                <h3>Must Ask</h3>
                <ul>${currentCase.mustAsk.map((item) => `<li>${item}</li>`).join("")}</ul>
              </article>
              <article class="detail-card">
                <h3>Success Criteria</h3>
                <ul>${currentCase.successCriteria.map((item) => `<li>${item}</li>`).join("")}</ul>
              </article>
              <article class="detail-card">
                <h3>Critic Focus</h3>
                <ul>${currentCase.criticFocus.map((item) => `<li>${item}</li>`).join("")}</ul>
              </article>
            </div>
          </section>

          <section class="prompt-grid">
            <article class="panel">
              <div class="panel-head compact">
                <div>
                  <p class="eyebrow">Reader Agent</p>
                  <h2>First-read prompt</h2>
                </div>
                <button class="copy-button" data-copy-kind="reader">Copy</button>
              </div>
              <textarea class="prompt-box" readonly>${readerPrompt}</textarea>
            </article>

            <article class="panel">
              <div class="panel-head compact">
                <div>
                  <p class="eyebrow">Critic Agent</p>
                  <h2>Review prompt</h2>
                </div>
                <button class="copy-button" data-copy-kind="critic">Copy</button>
              </div>
              <textarea class="prompt-box" readonly>${criticPrompt}</textarea>
            </article>
          </section>

          <section class="panel">
            <div class="panel-head compact">
              <div>
                <p class="eyebrow">Preset Registry</p>
                <h2>Styles and chart briefs</h2>
              </div>
            </div>
            <div class="style-grid">
              ${state.registry.styles.map((style) => styleCard(style)).join("")}
            </div>
            <div class="catalog-grid">
              ${state.registry.charts.map((chart) => chartCard(chart)).join("")}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head compact">
              <div>
                <p class="eyebrow">Novel Patterns</p>
                <h2>When no single chart family fits</h2>
              </div>
            </div>
            <div class="catalog-grid">
              ${(state.registry.patterns ?? []).map((pattern) => patternCard(pattern)).join("")}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head compact">
              <div>
                <p class="eyebrow">Flitter Core</p>
                <h2>Concepts and widgets for custom authoring</h2>
              </div>
            </div>
            <div class="catalog-grid">
              ${(state.registry.coreConcepts ?? []).map((concept) => conceptCard(concept)).join("")}
            </div>
            <div class="widget-grid">
              ${(state.registry.widgets ?? []).map((widget) => widgetCard(widget)).join("")}
            </div>
          </section>
        </main>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-case-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCaseId = button.getAttribute("data-case-id");
      render();
    });
  });

  document.querySelectorAll("[data-copy-kind]").forEach((button) => {
    button.addEventListener("click", async () => {
      const kind = button.getAttribute("data-copy-kind");
      await copyText(kind === "reader" ? readerPrompt : criticPrompt, button);
    });
  });
}

async function init() {
  const [registryResponse, casesResponse] = await Promise.all([
    fetch("/data/chart-registry.json"),
    fetch("/data/evaluation-cases.json"),
  ]);

  state.registry = await registryResponse.json();
  state.cases = await casesResponse.json();
  state.selectedCaseId = state.cases[0]?.id ?? null;
  render();
}

init().catch((error) => {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="loading-shell">
      <div class="loading-card">
        <p class="eyebrow">LLM Playground</p>
        <h1>Failed to load</h1>
        <pre>${String(error)}</pre>
      </div>
    </div>
  `;
});
