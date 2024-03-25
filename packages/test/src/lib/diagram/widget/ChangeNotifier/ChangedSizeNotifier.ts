import {
	SingleChildRenderObject,
	SingleChildRenderObjectWidget,
	Size,
	Widget
} from '@meursyphus/flitter';
import { classToFunction } from '../utils';

class ChangedSizeNotifier extends SingleChildRenderObjectWidget {
	onChange: (size: Size) => void;
	constructor({
		key,
		child,
		onChange
	}: {
		key?: unknown;
		child: Widget;
		onChange: (size: Size) => void;
	}) {
		super({ key, child });
		this.onChange = onChange;
	}

	createRenderObject() {
		return new ChangedSizeNotifierRenderObject({
			onChange: this.onChange
		});
	}

	updateRenderObject(renderObject: ChangedSizeNotifierRenderObject) {
		renderObject.onChange = this.onChange;
	}
}

class ChangedSizeNotifierRenderObject extends SingleChildRenderObject {
	onChange: (size: Size) => void;
	oldSize?: Size;
	constructor({ onChange }: { onChange: (size: Size) => void }) {
		super({ isPainter: false });
		this.onChange = onChange;
	}

	protected preformLayout(): void {
		super.preformLayout();
		if (this.oldSize == null) return;
		if (this.size.width === this.oldSize.width && this.size.height === this.oldSize.height) return;
		this.onChange(this.size);
		this.oldSize = this.size;
	}
}

export default classToFunction(ChangedSizeNotifier);
