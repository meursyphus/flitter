import { CustomPaint, SizedBox, Path, RRect, Size } from "flitter-core";

export function CheckBox({
  checked,
  color,
  size = 14,
}: {
  checked: boolean;
  color: string;
  size?: number;
}) {
  return SizedBox({
    width: size,
    height: size,
    child: CustomPaint({
      size: new Size({ width: size, height: size }),
      painter: {
        svg: {
          createDefaultSvgEl: (context) => ({
            border: context.createSvgEl("path"),
            checkmark: context.createSvgEl("path"),
          }),
          paint: ({ border, checkmark }, { width, height }) => {
            const borderPath = createBorderPath(width, height);
            border.setAttribute("d", borderPath.getD());
            border.setAttribute("fill", checked ? color : "none");
            border.setAttribute("stroke", checked ? color : "#c0c0c0");
            border.setAttribute("stroke-width", "1.5");

            if (checked) {
              const checkPath = createCheckmarkPath(width, height);
              checkmark.setAttribute("d", checkPath.getD());
              checkmark.setAttribute("fill", "none");
              checkmark.setAttribute("stroke", "white");
              checkmark.setAttribute("stroke-width", "2");
              checkmark.setAttribute("stroke-linecap", "round");
              checkmark.setAttribute("stroke-linejoin", "round");
            } else {
              checkmark.setAttribute("d", "");
            }
          },
        },
        canvas: {
          paint: (context, { width, height }) => {
            const ctx = context.canvas;
            const borderPath = createBorderPath(width, height);

            if (checked) {
              ctx.fillStyle = color;
              ctx.fill(borderPath.toCanvasPath());
            }
            ctx.strokeStyle = checked ? color : "#c0c0c0";
            ctx.lineWidth = 1.5;
            ctx.stroke(borderPath.toCanvasPath());

            if (checked) {
              const checkPath = createCheckmarkPath(width, height);
              ctx.strokeStyle = "white";
              ctx.lineWidth = 2;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.stroke(checkPath.toCanvasPath());
            }
          },
        },
      },
    }),
  });
}

function createBorderPath(width: number, height: number): Path {
  const path = new Path();
  const r = 0;
  const inset = 0.75;
  path.addRRect(
    RRect.fromLTRBXY({
      left: inset,
      top: inset,
      right: width - inset,
      bottom: height - inset,
      radiusX: r,
      radiusY: r,
    })
  );
  return path;
}

function createCheckmarkPath(width: number, height: number): Path {
  const path = new Path();
  path.moveTo({ x: width * 0.22, y: height * 0.5 });
  path.lineTo({ x: width * 0.42, y: height * 0.72 });
  path.lineTo({ x: width * 0.78, y: height * 0.3 });
  return path;
}
