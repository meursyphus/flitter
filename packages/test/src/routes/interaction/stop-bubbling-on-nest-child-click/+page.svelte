<script lang="ts">
	import {
		Center,
		Element,
		GestureDetector,
		Positioned,
		Stack,
		State,
		StatefulWidget,
		Text,
		Widget
	} from '@meursyphus/flitter';
	import SvelteWidget from '@meursyphus/flitter-svelte';

	class CustomWidget extends StatefulWidget {
		override createState(): State<StatefulWidget> {
			return new CustomState();
		}
	}

	class CustomState extends State<CustomWidget> {
		number = 0;

		build(_context: Element): Widget {
			return Stack({
				children: [
					Positioned({
						top: 0,
						right: 0,
						child: GestureDetector({
							onClick: () => {
								this.number += 1;
								this.setState();
							},
							child: GestureDetector({
								onClick: (e) => {
									e.stopPropagation();
								},
								child: Text('click')
							})
						})
					}),
					Center({
						child: Text(this.number.toString())
					})
				]
			});
		}
	}
</script>

<SvelteWidget width="200px" height="200px" widget={new CustomWidget()} />
