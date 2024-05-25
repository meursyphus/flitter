import { jsx as t } from "react/jsx-runtime";
import { useRef as s, useEffect as c } from "react";
import { AppRunner as f, Container as h, Alignment as p, Text as a } from "@meursyphus/flitter";
function v({
  width: l = "100%",
  height: u = "300px",
  renderer: i = "svg",
  widget: r = h({
    width: 1 / 0,
    height: 1 / 0,
    alignment: p.center,
    child: a("Hello World")
  })
}) {
  const o = s(null), n = s(null);
  return c(() => {
    const e = new f({
      view: n.current,
      window,
      document
    });
    return e.runApp(r), e.onMount({
      resizeTarget: o.current
    }), () => {
      e.dispose();
    };
  }, [r, i]), /* @__PURE__ */ t("div", { style: { width: l, height: u }, ref: o, children: i === "canvas" ? /* @__PURE__ */ t(
    "canvas",
    {
      style: { width: "100%", height: "100%" },
      ref: n
    }
  ) : /* @__PURE__ */ t(
    "svg",
    {
      style: { width: "100%", height: "100%" },
      ref: n
    }
  ) });
}
export {
  v as default
};
