import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-core";

export function AngularAxis(
	{ line, labels }: { line: Widget; labels: Widget[] }
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: [line, ...labels],
	});
}
