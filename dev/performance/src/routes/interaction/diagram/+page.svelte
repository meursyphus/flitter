<script lang="ts">
	import { type NodeToolbarBuilder, type DefaultFlowConfig } from 'flitter-diagram';

	import { getSceneOrder } from '../../../../../../packages/diagram/src/headless/flow/controller';
	import { onMount } from 'svelte';
	import { AppRunner } from 'flitter-core';
	import { Container, EdgeInsets, Text, TextStyle, GestureDetector } from 'flitter-core';
	import {
		FlowDiagram,
		layeredLayout,
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
		let nodes: FlowNode[] = [
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
		let edges: FlowEdge[] = [
			{ id: 'e1-2', source: '1', target: '2', animated: true },
			{ id: 'e1-3', source: '1', target: '3', label: 'edge label' }
		];
		const scenario = query.get('scenario');
		if (scenario) {
			nodes = [
				{
					id: '1',
					position: { x: 30, y: 70 },
					data: { label: 'Start' },
					width: 100,
					height: 50,
					collapsible: true
				},
				{
					id: '2',
					position: { x: 250, y: 100 },
					data: { label: 'Review' },
					width: 100,
					height: 50,
					resizable: true
				},
				{ id: '3', position: { x: 250, y: 260 }, data: { label: 'End' }, width: 100, height: 50 }
			];
			edges = [
				{ id: 'e1-2', source: '1', target: '2', type: 'straight' },
				{ id: 'e2-3', source: '2', target: '3' }
			];
			if (scenario === 'groups') {
				nodes = [
					{
						id: 'group',
						type: 'group',
						position: { x: 250, y: 40 },
						width: 240,
						height: 300,
						data: {}
					},
					nodes[0]
				];
				edges = [];
			}
			if (scenario === 'guides') edges = [];
			if (scenario === 'lod') nodes[2].type = 'input';
			if (scenario === 'waypoints') edges[0] = { ...edges[0], selected: true };
		}
		if (scenario === 'nested-order') {
			nodes = [
				{
					id: 'outer',
					type: 'group',
					position: { x: 70, y: 60 },
					width: 630,
					height: 350,
					data: { label: 'Outer frame' }
				},
				{
					id: 'inner',
					type: 'group',
					parentId: 'outer',
					position: { x: 30, y: 60 },
					width: 560,
					height: 250,
					data: { label: 'Inner frame' }
				},
				{
					id: 'a',
					parentId: 'inner',
					position: { x: 40, y: 80 },
					width: 150,
					height: 60,
					sourcePosition: 'right',
					data: { label: 'Child A' }
				},
				{
					id: 'b',
					parentId: 'inner',
					position: { x: 350, y: 80 },
					width: 150,
					height: 60,
					targetPosition: 'left',
					data: { label: 'Child B' }
				}
			];
			edges = [
				{
					id: 'nested-link',
					source: 'a',
					target: 'b',
					label: 'Nested transition',
					style: { stroke: '#7654ab' }
				}
			];
		}

		const nodeState: Record<string, unknown> = {};
		const events: string[] = [];
		// Count builder invocations per node so tests can assert rebuild locality.
		const builds: Record<string, number> = {};
		const counted = Object.fromEntries(
			Object.entries(defaultNodeTypes).map(([name, definition]) => [
				name,
				{
					...definition,
					lod: scenario === 'lod' && name === 'default' ? [1.2] : undefined,
					build: (args, ctx) => {
						builds[args.node.id] = (builds[args.node.id] ?? 0) + 1;
						nodeState[args.node.id] = {
							editing: args.editing,
							isDropTarget: args.isDropTarget,
							collapsed: args.collapsed,
							hiddenChildCount: args.hiddenChildCount,
							isNeighbour: args.isNeighbour
						};
						if (scenario === 'nested-order' && name === 'group')
							return Container({
								padding: EdgeInsets.all(12),
								color: args.node.id === 'outer' ? '#dce7f4' : '#edf2f8',
								child: Text(String(args.node.data.label), {
									style: new TextStyle({ color: '#24374a', fontSize: 12 })
								})
							});
						return definition.build(args, ctx);
					}
				} satisfies NodeTypeDefinition<any>
			])
		);
		runner.runApp(
			FlowDiagram({
				nodes,
				edges,
				layout: scenario === 'layout' ? layeredLayout : undefined,
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
											style: new TextStyle({ color: '#fff', fontSize: 12 })
										})
									})
								})) as NodeToolbarBuilder<DefaultFlowConfig>
						}
					])
				),
				viewport: {
					fitView: !scenario,
					initial: scenario ? { x: 0, y: 0, zoom: 1 } : undefined,
					extent
				},
				interaction: {
					preset: query.has('viewer') ? 'viewer' : 'editor',
					edit: { text: query.has('text'), waypoints: scenario === 'waypoints' },
					pane: { scroll: query.has('panOnScroll') ? 'pan' : 'zoom' },
					drag: {
						overlap:
							query.get('overlap') === 'push'
								? 'push'
								: query.get('overlap') === 'reject'
									? 'reject'
									: 'allow',
						snap: { grid: query.has('snap') ? [15, 15] : false, guides: scenario === 'guides' }
					}
				},
				on: {
					beforeDelete: query.has('vetoDelete') ? () => false : undefined,
					contextMenu: (args) => events.push(`menu:${args.target}`),
					historyChange: (state) => events.push(`history:${state.canUndo}/${state.canRedo}`),
					editStart: ({ node }) => events.push(`edit:start:${node.id}`),
					editEnd: ({ committed }) => events.push(`edit:end:${committed}`),
					reshapeStart: () => events.push('reshape:start'),
					reshapeEnd: () => events.push('reshape:end'),
					connectEnd: ({ dropPosition }) =>
						events.push(`drop:${Math.round(dropPosition.x)},${Math.round(dropPosition.y)}`),
					init: (controller) => {
						(window as any).__diagram = {
							controller,
							sceneOrder: () =>
								getSceneOrder(controller).map((item) =>
									item.kind === 'node' ? item.node.id : item.edge.id
								),
							events,
							builds,
							nodeState,
							toolbarClicks: () => toolbarClicks
						};
					},
					reconnect: (oldEdge, connection) => {
						events.push(`reconnect:${oldEdge.id}->${connection.source}-${connection.target}`);
						(window as any).__diagram.controller.reconnectEdge(oldEdge, connection);
					},
					resizeEnd: (_e, node, params) =>
						events.push(
							`resize:${node.id}:${Math.round(params.width)}x${Math.round(params.height)}`
						),
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
						events.push(`delete:${deletedNodes.length}/${deletedEdges.length}`)
				}
			})
		);
		runner.onMount({ resizeTarget: host });
		return () => runner.dispose();
	});
</script>

<div bind:this={host} data-testid="diagram" style="width:560px;height:400px;margin:20px;" />
