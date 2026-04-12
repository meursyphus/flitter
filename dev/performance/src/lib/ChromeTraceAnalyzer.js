/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
class ChromeTraceAnalyzer {
	nodes;
	userTimingDurations;
	constructor(trace) {
		this.setConfig(trace);
	}

	getDurationMs(name, { optional = false } = {}) {
		if (this.userTimingDurations == null) throw new Error('userTimingDurations is not initialized');
		if (this.nodes == null) throw new Error('nodes is not initialized');
		const userTimingKeys = [`flitter:${name}`, name];
		for (const key of userTimingKeys) {
			const duration = this.userTimingDurations.get(key);
			if (duration != null) {
				return duration / 1000;
			}
		}

		const result = this.nodes.find((node) => node.callFrame.functionName === name);
		if (result == null) {
			if (optional) {
				return 0;
			}
			throw new Error(`duration "${name}" not found in trace`);
		}
		return result.duration / 1000;
	}

	setConfig(trace) {
		const { traceEvents } = trace;
		const userTimingDurations = new Map();
		const userTimingStarts = new Map();

		traceEvents
			.filter((entry) => entry.cat === 'blink.user_timing')
			.forEach((entry) => {
				const key = `${entry.pid}:${entry.tid}:${entry.name}:${entry.id2?.local ?? ''}`;
				if (entry.ph === 'b') {
					userTimingStarts.set(key, entry.ts);
					return;
				}
				if (entry.ph === 'e') {
					const startedAt = userTimingStarts.get(key);
					if (startedAt == null) return;
					const duration = entry.ts - startedAt;
					userTimingStarts.delete(key);
					userTimingDurations.set(
						entry.name,
						(userTimingDurations.get(entry.name) || 0) + duration
					);
					return;
				}
				if (entry.ph === 'X' && entry.dur != null) {
					userTimingDurations.set(
						entry.name,
						(userTimingDurations.get(entry.name) || 0) + entry.dur
					);
				}
			});

		this.userTimingDurations = userTimingDurations;

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
				const delta = timeDeltas?.[index] ?? 0;
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
}

export default ChromeTraceAnalyzer;
