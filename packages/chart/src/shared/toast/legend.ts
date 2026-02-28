import {
  Row,
  SizedBox,
  Text,
  TextStyle,
  EdgeInsets,
  Padding,
  MainAxisSize,
  Opacity,
  GestureDetector,
  type Widget,
} from "flitter-core";
import { CheckBox } from "./checkbox";

export function toastLegend({
  name,
  visible,
  color,
  fontFamily,
  fontSize,
  onToggle,
}: {
  name: string;
  visible: boolean;
  color: string;
  fontFamily: string;
  fontSize: number;
  onToggle: () => void;
}): Widget {
  const content = Padding({
    padding: EdgeInsets.symmetric({ horizontal: 8 }),
    child: Row({
      mainAxisSize: MainAxisSize.min,
      children: [
        CheckBox({ checked: visible, color, size: 14 }),
        SizedBox({ width: 6 }),
        Text(name, {
          style: new TextStyle({
            fontFamily,
            fontSize,
            color: "#333333",
          }),
        }),
      ],
    }),
  });

  return GestureDetector({
    onClick: onToggle,
    child: visible
      ? content
      : Opacity({
          opacity: 0.4,
          child: content,
        }),
  });
}
