import type { Offset } from '@meursyphus/flitter';
import type { DiagramEvent } from '../Event';

class NodeTranslationEvent implements DiagramEvent {
	static get type() {
		return 'NodeTranslationEvent';
	}
	type = NodeTranslationEvent.type;

	tableName: string;
	translation: Offset;
	constructor({ tableName, translation }: { tableName: string; translation: Offset }) {
		this.tableName = tableName;
		this.translation = translation;
	}
}

export default NodeTranslationEvent;
