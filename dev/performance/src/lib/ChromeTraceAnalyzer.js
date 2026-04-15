/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
class ChromeTraceAnalyzer {
	nodes;
	measureDurations;
	namespace;
	constructor(trace) {
		this.namespace = 'flitter';
		this.setConfig(trace);
	}

	getDurationMs(name) {
		return this.getDurationMsAny([name]);
	}

	getDurationMsAny(names, defaultValue = 0) {
		if (this.measureDurations != null) {
			for (const name of names) {
				const measureName = name.includes(':') ? name : `${this.namespace}:${name}`;
				const duration = this.measureDurations.get(measureName);
				if (duration != null) return duration;
			}
		}

		if (this.nodes == null) throw new Error('nodes is not initialized');
		for (const name of names) {
			const result = this.nodes.find((node) => node.callFrame.functionName === name);
			if (result != null) return result.duration / 1000;
		}
		return defaultValue;
	}

	setConfig(trace) {
		const { traceEvents } = trace;
		this.measureDurations = this.collectMeasureDurations(traceEvents);

		const profileChunks = traceEvents
			.filter((entry) => entry.name === 'ProfileChunk')
			.filter((entry) => entry.args.data.cpuProfile != null);
		const nodes = profileChunks
			.map((entry) => entry.args.data.cpuProfile.nodes)
			.flat()
			.filter((node) => node != null)
			.filter((node) => node.callFrame != null)
			.sort((a, b) => a.id - b.id);
		const sampleTimes = {};

		profileChunks.forEach((chunk) => {
			const {
				cpuProfile: { samples },
				timeDeltas
			} = chunk.args.data;

			samples.forEach((id, index) => {
				const delta = timeDeltas[index];
				const time = sampleTimes[id] || 0;
				sampleTimes[id] = time + delta;
			});
		});

		this.nodes = nodes.map((node) => ({
			id: node.id,
			parent: node.parent,
			callFrame: node.callFrame,
			children: [],
			duration: sampleTimes[node.id] || 0
		}));

		const nodesMap = new Map();

		this.nodes.forEach((node) => {
			nodesMap.set(node.id, node);
		});

		[...this.nodes]
			.sort((a, b) => b.id - a.id)
			.forEach((node) => {
				if (node.parent == null) return;
				const parentNode = nodesMap.get(node.parent);
				if (parentNode) {
					parentNode.children.push(node);
					parentNode.duration += node.duration;
				}
			});
	}

	collectMeasureDurations(traceEvents) {
		const durations = new Map();
		const startsById = new Map();
		const startsByName = new Map();

		traceEvents
			.filter((entry) => entry.cat != null && entry.cat.includes('blink.user_timing'))
			.forEach((entry) => {
				if (entry.ph === 'X' && entry.dur != null) {
					const duration = durations.get(entry.name) || 0;
					durations.set(entry.name, duration + entry.dur / 1000);
					return;
				}

				if (entry.ph === 'b') {
					const id = entry.id2?.local;
					if (id != null) {
						startsById.set(id, entry.ts);
						return;
					}

					const starts = startsByName.get(entry.name) || [];
					starts.push(entry.ts);
					startsByName.set(entry.name, starts);
					return;
				}

				if (entry.ph !== 'e') return;

				const id = entry.id2?.local;
				let start = null;
				if (id != null) {
					start = startsById.get(id) ?? null;
					startsById.delete(id);
				} else {
					const starts = startsByName.get(entry.name) || [];
					start = starts.pop() ?? null;
					startsByName.set(entry.name, starts);
				}

				if (start == null) return;
				const duration = durations.get(entry.name) || 0;
				durations.set(entry.name, duration + (entry.ts - start) / 1000);
			});

		return durations;
	}
}

export default ChromeTraceAnalyzer;
