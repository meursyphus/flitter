import { CustomPaint, SizedBox, type Widget } from "flitter-core";
import type { SunburstChartCustom } from "flitter-ui/chart";
import type { SunburstChartConfig } from "../config";
import { getRingMetrics, getSegmentLabelMetrics } from "../../base/geometry";

export function toastDataLabel(
	...[args, ctx]: Parameters<SunburstChartCustom<SunburstChartConfig>["dataLabel"]>
): Widget {
	const config = ctx.config.dataLabel;
	if (!config.visible) return SizedBox.shrink();

	return CustomPaint({
		painter: {
			svg: {
				createDefaultSvgEl: (context) => ({
					label: context.createSvgEl("text"),
					value: context.createSvgEl("text"),
				}),
				paint: ({ label, value }, size) => {
					const metrics = getRingMetrics(
						size.width,
						size.height,
						ctx.segments,
						ctx.config.sunburst.innerRadiusRatio,
					);
					if (!metrics) {
						label.setAttribute("visibility", "hidden");
						value.setAttribute("visibility", "hidden");
						return;
					}

					const { midAngle, arcLength, ringWidth, x, y } = getSegmentLabelMetrics(metrics, args);
					if (arcLength < config.minArcLength || ringWidth < config.minRingWidth) {
						label.setAttribute("visibility", "hidden");
						value.setAttribute("visibility", "hidden");
						return;
					}

					const fontSize = Math.min(
						config.maxFontSize,
						Math.max(config.minFontSize, ringWidth * 0.3),
					);
					const maxChars = Math.floor(arcLength / (fontSize * 0.62));
					if (maxChars < 2) {
						label.setAttribute("visibility", "hidden");
						value.setAttribute("visibility", "hidden");
						return;
					}

					const formatted = config.formatter({
						label: args.label,
						value: args.value,
						depth: args.depth,
						path: args.pathLabels,
						branchLabel: args.branchLabel,
					});
					let labelText = formatted.label;
					if (!labelText) {
						label.setAttribute("visibility", "hidden");
						value.setAttribute("visibility", "hidden");
						return;
					}
					if (labelText.length > maxChars) {
						labelText = `${labelText.slice(0, maxChars - 1)}…`;
					}

					let rotation = (midAngle * 180) / Math.PI;
					if (rotation > 90 && rotation < 270) {
						rotation += 180;
					}

					label.setAttribute("visibility", "visible");
					label.setAttribute("x", String(x));
					label.setAttribute("y", String(y));
					label.setAttribute("text-anchor", "middle");
					label.setAttribute("dominant-baseline", formatted.value ? "auto" : "central");
					label.setAttribute("fill", config.color);
					label.setAttribute("font-size", String(fontSize));
					label.setAttribute("font-family", config.fontFamily ?? ctx.config.font.family);
					if (config.fontWeight != null) {
						label.setAttribute("font-weight", config.fontWeight);
					}
					label.setAttribute("transform", `rotate(${rotation}, ${x}, ${y})`);
					label.textContent = labelText;

					if (formatted.value && arcLength > config.minArcLength * 1.6) {
						const valueFontSize = Math.max(config.minFontSize, fontSize - 1);
						value.setAttribute("visibility", "visible");
						value.setAttribute("x", String(x));
						value.setAttribute("y", String(y + fontSize * 0.9));
						value.setAttribute("text-anchor", "middle");
						value.setAttribute("dominant-baseline", "auto");
						value.setAttribute("fill", config.secondaryColor);
						value.setAttribute("font-size", String(valueFontSize));
						value.setAttribute("font-family", config.fontFamily ?? ctx.config.font.family);
						value.setAttribute("transform", `rotate(${rotation}, ${x}, ${y + fontSize * 0.9})`);
						value.textContent = formatted.value;
					} else {
						value.setAttribute("visibility", "hidden");
					}
				},
			},
			canvas: {
				paint: (context, size) => {
					const metrics = getRingMetrics(
						size.width,
						size.height,
						ctx.segments,
						ctx.config.sunburst.innerRadiusRatio,
					);
					if (!metrics) return;

					const { midAngle, arcLength, ringWidth, x, y } = getSegmentLabelMetrics(metrics, args);
					if (arcLength < config.minArcLength || ringWidth < config.minRingWidth) return;

					const fontSize = Math.min(
						config.maxFontSize,
						Math.max(config.minFontSize, ringWidth * 0.3),
					);
					const maxChars = Math.floor(arcLength / (fontSize * 0.62));
					if (maxChars < 2) return;

					const formatted = config.formatter({
						label: args.label,
						value: args.value,
						depth: args.depth,
						path: args.pathLabels,
						branchLabel: args.branchLabel,
					});
					let labelText = formatted.label;
					if (!labelText) return;
					if (labelText.length > maxChars) {
						labelText = `${labelText.slice(0, maxChars - 1)}…`;
					}

					let rotation = midAngle;
					if (rotation > Math.PI / 2 && rotation < (3 * Math.PI) / 2) {
						rotation += Math.PI;
					}
					rotation -= Math.PI / 2;

					const canvas = context.canvas;
					canvas.save();
					canvas.translate(x, y);
					canvas.rotate(rotation);
					canvas.font = `${config.fontWeight ?? "700"} ${fontSize}px ${config.fontFamily ?? ctx.config.font.family}`;
					canvas.fillStyle = config.color;
					canvas.textAlign = "center";
					canvas.textBaseline = formatted.value ? "bottom" : "middle";
					canvas.fillText(labelText, 0, 0);

					if (formatted.value && arcLength > config.minArcLength * 1.6) {
						const valueFontSize = Math.max(config.minFontSize, fontSize - 1);
						canvas.font = `${valueFontSize}px ${config.fontFamily ?? ctx.config.font.family}`;
						canvas.fillStyle = config.secondaryColor;
						canvas.textBaseline = "top";
						canvas.fillText(formatted.value, 0, 2);
					}

					canvas.restore();
				},
			},
		},
	});
}
