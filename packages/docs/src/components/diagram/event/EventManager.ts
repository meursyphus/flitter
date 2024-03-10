import type { DiagramEvent } from './Event';

// eslint-disable-next-line @typescript-eslint/ban-types
type Callback = Function;

class EventManager {
	events: { [key: string]: Callback[] };

	constructor() {
		this.events = {};
	}
	addEventListener(eventType: string, callback: Callback) {
		if (!this.events[eventType]) {
			this.events[eventType] = [];
		}
		this.events[eventType].push(callback);
	}
	removeEventListener(eventType: string, callback: Callback) {
		if (!this.events[eventType]) {
			return;
		}
		this.events[eventType] = this.events[eventType].filter((cb) => cb !== callback);
	}

	dispatchEvent(event: DiagramEvent) {
		if (!this.events[event.type]) {
			return;
		}
		this.events[event.type].forEach((cb) => cb(event));
	}
}

export default EventManager;
