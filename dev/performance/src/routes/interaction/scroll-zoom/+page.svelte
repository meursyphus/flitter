<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AppRunner,
		Axis,
		Column,
		Container,
		CrossAxisAlignment,
		EdgeInsets,
		GestureDetector,
		InteractiveViewer,
		MainAxisSize,
		Matrix4,
		NeverScrollableScrollPhysics,
		Offset,
		Padding,
		Row,
		ScrollController,
		SingleChildScrollView,
		TransformationController,
		type Widget
	} from 'flitter-core';
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
		const scroll = new ScrollController();
		const transform = new TransformationController();
		let hits = 0,
			starts = 0,
			updates = 0,
			ends = 0;
		let disabled = false;
		let mode = query.get('mode') ?? 'scroll';
		const horizontal = query.has('horizontal');
		const tiles = () =>
			Array.from({ length: 8 }, (_, i) =>
				GestureDetector({
					onClick: () => {
						hits = i + 1;
					},
					child: Container({ width: 100, height: 80, color: i % 2 ? '#2563eb' : '#ef4444' })
				})
			);
		const build = (): Widget =>
			Padding({
				padding: EdgeInsets.all(20),
				child:
					mode === 'zoom'
						? InteractiveViewer({
								transformationController: transform,
								constrained: false,
								minScale: 0.5,
								maxScale: 3,
								boundaryMargin: query.has('free') ? EdgeInsets.all(Infinity) : EdgeInsets.all(0),
								panEnabled: !disabled,
								scaleEnabled: !disabled,
								onInteractionStart: () => {
									starts++;
								},
								onInteractionUpdate: () => {
									updates++;
								},
								onInteractionEnd: () => {
									ends++;
								},
								child: Container({
									width: 600,
									height: 500,
									color: '#ddd',
									child: Column({
										mainAxisSize: MainAxisSize.min,
										crossAxisAlignment: CrossAxisAlignment.start,
										children: tiles()
									})
								})
							})
						: SingleChildScrollView({
								controller: scroll,
								scrollDirection: horizontal ? Axis.horizontal : Axis.vertical,
								reverse: query.has('reverse'),
								physics: disabled ? new NeverScrollableScrollPhysics() : undefined,
								child: horizontal
									? Row({ mainAxisSize: MainAxisSize.min, children: tiles() })
									: Column({
											mainAxisSize: MainAxisSize.min,
											crossAxisAlignment: CrossAxisAlignment.start,
											children: tiles()
										})
							})
			});
		runner.onMount({ resizeTarget: host });
		runner.runApp(build());
		(window as any).__scrollZoom = {
			metrics: () => ({
				offset: scroll.offset,
				max: scroll.maxScrollExtent,
				viewport: scroll.viewportDimension,
				matrix: [...transform.value.storage],
				hits,
				starts,
				updates,
				ends
			}),
			jump: (value: number) => scroll.jumpTo(value),
			animate: (value: number) => scroll.animateTo(value, { duration: 100 }),
			reset: () => {
				transform.value = Matrix4.identity();
			},
			toScene: (x: number, y: number) => transform.toScene(new Offset({ x, y })),
			disable: () => {
				disabled = true;
				runner.runApp(build());
			},
			replace: () => {
				mode = mode === 'zoom' ? 'scroll' : 'zoom';
				runner.runApp(build());
			}
		};
		return () => {
			runner.dispose();
			scroll.dispose();
			transform.dispose();
			view.remove();
		};
	});
</script>

<div
	bind:this={host}
	data-testid="scroll-zoom"
	style="width:360px;height:280px;margin:40px;background:white"
></div>
