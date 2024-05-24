import type { DiagramEvent } from '../Event';

class FieldRemoveEvent<FIELD_ID = number> implements DiagramEvent {
	static get type() {
		return 'FieldRemoveEvent';
	}
	type = FieldRemoveEvent.type;

	id: FIELD_ID;
	constructor({ id }: { id: FIELD_ID }) {
		this.id = id;
	}
}

export default FieldRemoveEvent;
