import type { GlobalKey } from '@meursyphus/flitter';
import type { DiagramEvent } from '../Event';

class NodeInsertEvent implements DiagramEvent {
	static get type() {
		return 'NodeInsertEvent';
	}
	type = NodeInsertEvent.type;
	tableName: string;
	key: GlobalKey;

	constructor({ tableName, key }: { tableName: string; key: GlobalKey }) {
		this.tableName = tableName;
		this.key = key;
	}
}

export default NodeInsertEvent;
