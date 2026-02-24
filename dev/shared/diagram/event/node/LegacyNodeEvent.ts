import type { GlobalKey } from 'flitter-core';
import type { DiagramEvent } from '../Event';

class LegacyNodeEvent implements DiagramEvent {
	static get type() {
		return 'MovedNodeChangeEvent';
	}
	type = LegacyNodeEvent.type;

	tableName: string;
	key: GlobalKey;

	constructor({ tableName, key }: { tableName: string; key: GlobalKey }) {
		this.tableName = tableName;
		this.key = key;
	}
}

export default LegacyNodeEvent;
