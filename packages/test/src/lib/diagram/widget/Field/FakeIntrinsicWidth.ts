import {
	RenderObject,
	SingleChildRenderObject,
	SingleChildRenderObjectWidget,
	Widget
} from '@meursyphus/flitter';
import { classToFunction } from '../utils';

/*
현재 Field의 너비가 Note에 있는 Field의 가장 큰 너비에 맞추기 위해 노드 부모에 IntrinsicWidth를 두고 있다.
이때 Tooltip의 IntrinsicWidth로 인해 Filed의 너비가 원치 않게 늘어나는 현상이 발생한다.
이를 방지하기 위해 Tooltip의 IntrinsicWidth를 무시하는 FakeIntrinsicWidth를 만들었다.
*/

class FakeIntrinsicWidth extends SingleChildRenderObjectWidget {
	constructor({ child }: { child: Widget }) {
		super(child);
	}

	createRenderObject() {
		return new RenderFakeIntrinsicWidth();
	}
	updateRenderObject(_: RenderObject): void {}
}

class RenderFakeIntrinsicWidth extends SingleChildRenderObject {
	constructor() {
		super({ isPainter: false });
	}

	getIntrinsicWidth(height: number): number {
		return 0;
	}
}

export default classToFunction(FakeIntrinsicWidth);
