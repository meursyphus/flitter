import {
	Container,
	EdgeInsets,
	Column,
	Expanded,
	Row,
	CrossAxisAlignment,
	MainAxisAlignment,
	MainAxisSize,
	SizedBox,
	type Widget,
} from "flitter-core";
import type { RadarChartCustom } from "@headless/radar-chart/types";

type LayoutConfig = {
	padding: { top: number; right: number; bottom: number; left: number };
	title: {
		visible: boolean;
		position: "top" | "bottom";
		alignment: "start" | "center" | "end";
	};
	legend: {
		visible: boolean;
		position: "top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom";
		gap: number;
	};
};

function interleave(items: Widget[], separator: () => Widget): Widget[] {
	return items.flatMap((item, i) => (i < items.length - 1 ? [item, separator()] : [item]));
}

const titleAlignmentMap = {
	start: CrossAxisAlignment.start,
	center: CrossAxisAlignment.center,
	end: CrossAxisAlignment.end,
} as const;

function isRightPosition(position: string): boolean {
	return position === "right" || position.startsWith("right-");
}

const rightAlignmentMap: Record<string, MainAxisAlignment> = {
	"right": MainAxisAlignment.center,
	"right-top": MainAxisAlignment.start,
	"right-center": MainAxisAlignment.center,
	"right-bottom": MainAxisAlignment.end,
};

export function Layout(
	...[{ title, legends, plot }, context]: Parameters<RadarChartCustom<{ config: LayoutConfig }>["layout"]>
): Widget {
	const { padding, title: titleConfig, legend: legendConfig } = (context as any).config as LayoutConfig;
	const legendGap = legendConfig.gap;
	const isRight = isRightPosition(legendConfig.position);

	const legendWidget = legendConfig.visible
		? isRight
			? Column({
					mainAxisAlignment: rightAlignmentMap[legendConfig.position] ?? MainAxisAlignment.center,
					crossAxisAlignment: CrossAxisAlignment.start,
					children: interleave(legends, () => SizedBox({ height: legendGap })),
				})
			: Row({
					mainAxisAlignment: MainAxisAlignment.center,
					mainAxisSize: MainAxisSize.max,
					children: legends,
				})
		: null;

	const titleWidget = titleConfig.visible
		? Column({
					mainAxisSize: MainAxisSize.min,
					crossAxisAlignment:
						titleAlignmentMap[titleConfig.alignment as keyof typeof titleAlignmentMap],
					children: [title, SizedBox({ height: 16 })],
				})
			: null;

	const columnChildren: Widget[] = [];

	if (titleWidget && titleConfig.position === "top") {
		columnChildren.push(titleWidget);
	}

	if (legendWidget && legendConfig.position === "top") {
		columnChildren.push(legendWidget);
		columnChildren.push(SizedBox({ height: legendGap }));
	}

	if (legendWidget && isRight) {
		columnChildren.push(
			Expanded({
				child: Row({
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						Expanded({ child: plot }),
						SizedBox({ width: legendGap }),
						legendWidget,
					],
				}),
			}),
		);
	} else {
		columnChildren.push(Expanded({ child: plot }));
	}

	if (legendWidget && legendConfig.position === "bottom") {
		columnChildren.push(SizedBox({ height: legendGap }));
		columnChildren.push(legendWidget);
	}

	if (titleWidget && titleConfig.position === "bottom") {
		columnChildren.push(titleWidget);
	}

	return Container({
		padding: EdgeInsets.only({
			left: padding.left,
			right: padding.right,
			top: padding.top,
			bottom: padding.bottom,
		}),
		child: Column({
			crossAxisAlignment: CrossAxisAlignment.stretch,
			children: columnChildren,
		}),
	});
}
