import { jsx as i } from "react/jsx-runtime";
import { useRef as o, useEffect as l } from "react";
import { AppRunner as s, Container as c, Alignment as p, Text as d } from "@meursyphus/flitter";
function a({
  width: u = "100%",
  height: f = "300px",
  widget: n = c({
    width: 1 / 0,
    height: 1 / 0,
    alignment: p.center,
    child: d("Hello World")
  })
}) {
  const t = o(null), r = o(null);
  return l(() => {
    const e = new s({
      view: r.current,
      window,
      document
    });
    return e.runApp(n), e.onMount({
      resizeTarget: t.current
    }), () => {
      e.dispose();
    };
  }, [n]), /* @__PURE__ */ i("div", { style: { width: u, height: f }, ref: t, children: /* @__PURE__ */ i("svg", { style: { width: "100%", height: "100%" }, ref: r }) });
}
export {
  a as default
};
