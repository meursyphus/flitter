import type { DiagramEvent } from '../Event';

class NodeTranslationEvent implements DiagramEvent {
	static get type() {
		return 'NodeTranslationEndEvent';
	}
	type = NodeTranslationEvent.type;

	tableName: string;
	constructor({ tableName }: { tableName: string }) {
		this.tableName = tableName;
	}
}

export default NodeTranslationEvent;
