import {
	Center,
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";

type PieLikeItem = {
	widget: Widget;
};

export function DataView({
	items,
	overlay,
}: {
	items: PieLikeItem[];
	overlay?: Widget | null;
}): Widget {
	const itemChildren = items.map((item) => item.widget);
	const children: Widget[] = [
		Stack({
			fit: StackFit.expand,
			clipped: false,
			children: itemChildren,
		}),
	];

	if (overlay != null) {
		children.push(Center({ child: overlay }));
	}

	return Stack({
		fit: StackFit.expand,
		clipped: false,
		children,
	});
}
