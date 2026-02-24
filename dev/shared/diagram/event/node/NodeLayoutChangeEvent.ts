import type { GlobalKey } from 'flitter-core';
import type { DiagramEvent } from '../Event';

class NodeLayoutChangeEvent implements DiagramEvent {
	static get type() {
		return 'NodeLayoutChangeEvent';
	}
	type = NodeLayoutChangeEvent.type;
	tableName: string;
	key: GlobalKey;

	constructor({ tableName, key }: { tableName: string; key: GlobalKey }) {
		this.tableName = tableName;
		this.key = key;
	}
}

export default NodeLayoutChangeEvent;
