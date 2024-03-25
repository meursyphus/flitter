import type { Offset } from '@meursyphus/flitter';
import type { DiagramEvent } from '../Event';

class NodeAlignTranslationEvent implements DiagramEvent {
	static get type() {
		return 'NodeAlignTranslationEvent';
	}
	type = NodeAlignTranslationEvent.type;

	tableName: string;
	translation: Offset;
	constructor({ tableName, translation }: { tableName: string; translation: Offset }) {
		this.tableName = tableName;
		this.translation = translation;
	}
}

export default NodeAlignTranslationEvent;
