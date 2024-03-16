import { jsx as r } from "react/jsx-runtime";
import { useRef as i, useEffect as u } from "react";
import { AppRunner as c, Container as s, Alignment as d, Text as m } from "@meursyphus/flitter";
function a({
  width: o = "100%",
  height: f = "300px",
  widget: l = s({
    width: 1 / 0,
    height: 1 / 0,
    alignment: d.center,
    child: m("Hello World")
  })
}) {
  const e = i(null), n = i(null);
  return u(() => {
    const t = new c({
      view: n.current,
      window,
      document
    });
    t.runApp(l), t.onMount({
      resizeTarget: e.current
    });
  }, []), /* @__PURE__ */ r("div", { style: { width: o, height: f }, ref: e, children: /* @__PURE__ */ r("svg", { style: { width: "100%", height: "100%" }, ref: n }) });
}
export {
  a as default
};
