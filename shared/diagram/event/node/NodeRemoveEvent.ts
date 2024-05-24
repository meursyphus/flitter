import type { DiagramEvent } from '../Event';

class NodeRemoveEvent implements DiagramEvent {
	static get type() {
		return 'NodeRemoveEvent';
	}
	type = NodeRemoveEvent.type;
	tableName: string;

	constructor({ tableName }: { tableName: string }) {
		this.tableName = tableName;
	}
}

export default NodeRemoveEvent;
