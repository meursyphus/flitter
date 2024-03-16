import type { DiagramEvent } from './Event';

class ActiveRelationEvent<FIELD_ID = number> implements DiagramEvent {
	static get type() {
		return 'ActiveRelationEvent';
	}
	type = ActiveRelationEvent.type;

	field: { from: FIELD_ID; to: FIELD_ID };
	active: boolean;
	constructor({ field, active }: { field: { from: FIELD_ID; to: FIELD_ID }; active: boolean }) {
		this.field = field;
		this.active = active;
	}
}

export default ActiveRelationEvent;
