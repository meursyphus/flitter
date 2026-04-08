import {
	Column,
	Container,
	CrossAxisAlignment,
	EdgeInsets,
	Expanded,
	MainAxisSize,
	SizedBox,
} from "flitter-core";
import type { FunnelChartCustom } from "../types";

type LayoutConfig = {
	padding: { top: number; right: number; bottom: number; left: number };
	title: {
		text: string;
		visible: boolean;
		position: "top" | "bottom";
		alignment: "start" | "center" | "end";
	};
};

const titleAlignmentMap = {
	start: CrossAxisAlignment.start,
	center: CrossAxisAlignment.center,
	end: CrossAxisAlignment.end,
} as const;

export function Layout<TConfig extends LayoutConfig>(
	...[{ title, plot }, ctx]: Parameters<FunnelChartCustom<TConfig>["layout"]>
) {
	const { padding, title: titleConfig } = ctx.config;
	const showTitle =
		titleConfig.visible && typeof titleConfig.text === "string" && titleConfig.text.trim().length > 0;
	const children = [];

	if (showTitle && titleConfig.position === "top") {
		children.push(
			Column({
				crossAxisAlignment:
					titleAlignmentMap[titleConfig.alignment as keyof typeof titleAlignmentMap],
				children: [title, SizedBox({ height: 14 })],
			}),
		);
	}

	children.push(Expanded({ child: plot }));

	if (showTitle && titleConfig.position === "bottom") {
		children.push(SizedBox({ height: 14 }));
		children.push(
			Column({
				crossAxisAlignment:
					titleAlignmentMap[titleConfig.alignment as keyof typeof titleAlignmentMap],
				children: [title],
			}),
		);
	}

	return Container({
		padding: EdgeInsets.only({
			left: padding.left,
			right: padding.right,
			top: padding.top,
			bottom: padding.bottom,
		}),
		child: SizedBox.expand({
			child: Column({
				mainAxisSize: MainAxisSize.max,
				crossAxisAlignment: CrossAxisAlignment.stretch,
				children,
			}),
		}),
	});
}
