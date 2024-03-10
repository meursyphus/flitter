import type { GlobalKey } from '@moonmoonbrothers/flutterjs';
import type { DiagramEvent } from '../Event';

class FieldLayoutChangeEvent<FIELD_ID = number> implements DiagramEvent {
	static get type() {
		return 'FieldLayoutChangeEvent';
	}
	type = FieldLayoutChangeEvent.type;

	id: FIELD_ID;
	key: GlobalKey;
	constructor({ id, key }: { id: FIELD_ID; key: GlobalKey }) {
		this.id = id;
		this.key = key;
	}
}

export default FieldLayoutChangeEvent;
