/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
class ChromeTraceAnalyzer {
	nodes;
	constructor(trace) {
		this.setConfig(trace);
	}

	getDurationMs(name) {
		if (this.nodes == null) throw new Error('nodes is not initialized');
		const result = this.nodes.find((node) => node.callFrame.functionName === name);
		return result.duration / 1000;
	}

	setConfig(trace) {
		const { traceEvents } = trace;

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
}

export default ChromeTraceAnalyzer;
