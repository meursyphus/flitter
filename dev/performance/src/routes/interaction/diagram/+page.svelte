<script lang="ts">
import { type NodeToolbarBuilder, type DefaultFlowConfig } from "flitter-diagram";

	import { onMount } from 'svelte';
	import { AppRunner } from 'flitter-core';
	import { Container, EdgeInsets, Text, TextStyle, GestureDetector } from 'flitter-core';
	import {
		FlowDiagram,
		defaultNodeTypes,
		type FlowEdge,
		type FlowNode,
		type NodeTypeDefinition
	} from 'flitter-diagram';
	let host: HTMLDivElement;
	onMount(() => {
		const query = new URLSearchParams(location.search);
		const renderer = query.get('renderer') ?? 'svg';
		const view =
			renderer === 'canvas'
				? document.createElement('canvas')
				: document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		view.style.cssText = 'width:100%;height:100%';
		host.appendChild(view);
		const runner = new AppRunner({ view, document, window });
		const nodes: FlowNode[] = [
			{ id: '1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Input Node' } },
			{ id: '2', position: { x: 100, y: 180 }, data: { label: 'Default Node' }, resizable: true },
			{ id: '3', type: 'output', position: { x: 320, y: 180 }, data: { label: 'Output Node' } }
		];
		const extent: [[number, number], [number, number]] | undefined = query.has('extent')
			? [
					[0, 0],
					[800, 600]
				]
			: undefined;
		let toolbarClicks = 0;
		const edges: FlowEdge[] = [
			{ id: 'e1-2', source: '1', target: '2', animated: true },
			{ id: 'e1-3', source: '1', target: '3', label: 'edge label' }
		];
		const events: string[] = [];
		// Count builder invocations per node so tests can assert rebuild locality.
		const builds: Record<string, number> = {};
		const counted = Object.fromEntries(
			Object.entries(defaultNodeTypes).map(([name, definition]) => [
				name,
				{
					...definition,
					build: (args, ctx) => {
						builds[args.node.id] = (builds[args.node.id] ?? 0) + 1;
						return definition.build(args, ctx);
					}
				} satisfies NodeTypeDefinition<any>
			])
		);
		runner.runApp(
			FlowDiagram({
				nodes,
				edges,
				config: { minimap: { visible: false } },
				nodeTypes: Object.fromEntries(
					Object.entries(counted).map(([name, definition]) => [
						name,
						{
							...definition,
							toolbar: (({ node }) =>
								GestureDetector({
									onClick: () => {
										toolbarClicks++;
										events.push(`toolbar:${node.id}`);
									},
									child: Container({
										padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
										color: '#3367d9',
										child: Text(`tools ${node.id}`, {
											style: new TextStyle({ color: '#fff', fontSize: 12 }),
										}),
									}),
								})) as NodeToolbarBuilder<DefaultFlowConfig>,
						},
					]),
				),
				viewport: { fitView: true, extent: extent },
				interaction: {
					pane: { scroll: query.has('panOnScroll') ? 'pan' : 'zoom' },
					drag: { snap: { grid: query.has('snap') ? [15, 15] : false } },
				},
				on: {
					init: (controller) => {
						(window as any).__diagram = { controller, events, builds, toolbarClicks: () => toolbarClicks };
					},
					reconnect: (oldEdge, connection) => {
						events.push(`reconnect:${oldEdge.id}->${connection.source}-${connection.target}`);
						(window as any).__diagram.controller.reconnectEdge(oldEdge, connection);
					},
					resizeEnd: (_e, node, params) =>
						events.push(`resize:${node.id}:${Math.round(params.width)}x${Math.round(params.height)}`),
					nodesChange: (changes) => events.push(...changes.map((c) => `node:${c.type}`)),
					edgesChange: (changes) => events.push(...changes.map((c) => `edge:${c.type}`)),
					connect: (connection) => {
						events.push(`connect:${connection.source}->${connection.target}`);
						(window as any).__diagram.controller.addEdges(connection);
					},
					dragEnd: (_e, node) => events.push(`dragstop:${node.id}`),
					selectionChange: ({ nodes: selected }) =>
						events.push(`selection:${selected.map((n) => n.id).join(',')}`),
					delete: ({ nodes: deletedNodes, edges: deletedEdges }) =>
						events.push(`delete:${deletedNodes.length}/${deletedEdges.length}`),
				},
			}),
		);
		runner.onMount({ resizeTarget: host });
		return () => runner.dispose();
	});
</script>

<div bind:this={host} data-testid="diagram" style="width:560px;height:400px;margin:20px;" />
