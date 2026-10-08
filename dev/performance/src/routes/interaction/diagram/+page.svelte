<script lang="ts">
	import { onMount } from 'svelte';
	import { AppRunner } from 'flitter-core';
	import { Container, EdgeInsets, Text, TextStyle, GestureDetector } from 'flitter-core';
	import {
		FlowDiagram,
		xyflowNodeTypes,
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
			Object.entries(xyflowNodeTypes).map(([name, definition]) => [
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
				fitView: true,
				nodeTypes: counted,
				panOnScroll: query.has('panOnScroll'),
				snapToGrid: query.has('snap'),
				translateExtent: extent,
				// the minimap panel would cover node 3 at this pane size
				config: { minimap: { visible: false } },
				nodeToolbar: ({ node }) =>
					GestureDetector({
						onClick: () => {
							toolbarClicks++;
							events.push(`toolbar:${node.id}`);
						},
						child: Container({
							padding: EdgeInsets.symmetric({ horizontal: 8, vertical: 4 }),
							color: '#3367d9',
							child: Text(`tools ${node.id}`, { style: new TextStyle({ color: '#fff', fontSize: 12 }) })
						})
					}),
				onInit: (controller) => {
					(window as any).__diagram = { controller, events, builds, toolbarClicks: () => toolbarClicks };
				},
				onReconnect: (oldEdge, connection) => {
					events.push(`reconnect:${oldEdge.id}->${connection.source}-${connection.target}`);
					(window as any).__diagram.controller.reconnectEdge(oldEdge, connection);
				},
				onNodeResizeEnd: (_e, node, params) => events.push(`resize:${node.id}:${Math.round(params.width)}x${Math.round(params.height)}`),
				onNodesChange: (changes) => events.push(...changes.map((c) => `node:${c.type}`)),
				onEdgesChange: (changes) => events.push(...changes.map((c) => `edge:${c.type}`)),
				onConnect: (connection) => {
					events.push(`connect:${connection.source}->${connection.target}`);
					(window as any).__diagram.controller.addEdges(connection);
				},
				onNodeDragStop: (_e, node) => events.push(`dragstop:${node.id}`),
				onSelectionChange: ({ nodes: selected }) => events.push(`selection:${selected.map((n) => n.id).join(',')}`),
				onDelete: ({ nodes: deletedNodes, edges: deletedEdges }) =>
					events.push(`delete:${deletedNodes.length}/${deletedEdges.length}`)
			})
		);
		runner.onMount({ resizeTarget: host });
		return () => runner.dispose();
	});
</script>

<div bind:this={host} data-testid="diagram" style="width:560px;height:400px;margin:20px;" />
