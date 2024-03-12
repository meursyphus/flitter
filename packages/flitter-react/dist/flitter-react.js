import { jsx as r } from "react/jsx-runtime";
import { useRef as i, useEffect as l } from "react";
import { AppRunner as c, Container as s, Alignment as m, Text as p } from "@meursyphus/flitter";
function h({
  width: o = "100%",
  height: f = "300px",
  widget: u = s({
    width: 1 / 0,
    height: 1 / 0,
    alignment: m.center,
    child: p("Hello World")
  })
}) {
  const n = i(null), e = i(null);
  return l(() => {
    const t = new c({
      view: e.current,
      window,
      document
    });
    t.runApp(u), t.onMount({
      resizeTarget: n.current
    });
  }, []), /* @__PURE__ */ r("div", { style: { width: o, height: f }, ref: n, children: /* @__PURE__ */ r("svg", { ref: e }) });
}
export {
  h as default
};
