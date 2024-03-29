import {
	SingleChildRenderObject,
	SingleChildRenderObjectWidget,
	Size,
	Widget,
	type PaintContext,
	Matrix4
} from '@meursyphus/flitter';
import { classToFunction } from '../utils';

class ChangedLayoutNotifier extends SingleChildRenderObjectWidget {
	onChange: () => void;
	constructor({ key, child, onChange }: { key?: unknown; child: Widget; onChange: () => void }) {
		super({ key, child });
		this.onChange = onChange;
	}

	createRenderObject() {
		return new _SizeChangedLayoutNotifierRenderObject({
			onChange: this.onChange
		});
	}

	updateRenderObject(renderObject: _SizeChangedLayoutNotifierRenderObject) {
		renderObject.onChange = this.onChange;
	}
}

class _SizeChangedLayoutNotifierRenderObject extends SingleChildRenderObject {
	onChange: () => void;
	oldSize?: Size;
	oldMatrix?: Matrix4;
	constructor({ onChange }: { onChange: () => void }) {
		super({ isPainter: false });
		this.onChange = onChange;
	}

	override paint(context: PaintContext, clipId?: string, matrix4?: Matrix4, opacity?: number) {
		super.paint(context, clipId, matrix4, opacity);
		const oldSize = this.oldSize;
		const oldMatrix = this.oldMatrix;
		const currentSize = this.size;
		const currentMatrix = matrix4!;
		this.oldMatrix = currentMatrix;
		this.oldSize = currentSize;
		if (oldSize == null) return;
		if (oldMatrix == null) return;
		if (currentSize.equal(oldSize) && currentMatrix.equals(oldMatrix)) return;

		this.onChange();
	}
}

export default classToFunction(ChangedLayoutNotifier);
