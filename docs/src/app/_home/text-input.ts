import {
  Border, BorderRadius, BoxDecoration, Center, EdgeInsets,
  Padding, TextEditingController, TextField, TextStyle,
} from "flitterjs";

export default function TextInput(controller?: TextEditingController) {
  return Padding({
    padding: EdgeInsets.all(24),
    child: Center({
      child: TextField("Make it yours.", {
        controller,
        ariaLabel: "Try typing here",
        width: 480,
        height: 32,
        padding: EdgeInsets.all(18),
        style: new TextStyle({
          fontFamily: "sans-serif", fontSize: 24, color: "#3b82f6",
        }),
        decoration: new BoxDecoration({
          border: Border.all({ color: "#3b82f6", width: 1 }),
          borderRadius: BorderRadius.circular(12),
        }),
        focusedBorder: Border.all({ color: "#3b82f6", width: 2 }),
      }),
    }),
  });
}
