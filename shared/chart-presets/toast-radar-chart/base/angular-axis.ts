import {
	Stack,
	StackFit,
	type Widget,
} from "flitter-ui";

export function AngularAxis(
	{ line, labels }: { line: Widget; labels: Widget[] }
): Widget {
	return Stack({
		fit: StackFit.expand,
		children: [line, ...labels],
	});
}
