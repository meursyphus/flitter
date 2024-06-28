<script lang="ts">
	import {
		Alignment,
		Container,
		Text,
		StatelessWidget,
		BuildContext,
		EdgeInsets,
		Provider,
		TextStyle,
		Column,
		GestureDetector
	} from '@meursyphus/flitter';
	import Widget from '../lib/Widget.svelte';

	let input = 'Hello, world!2';

	class CustomWidget extends StatelessWidget {
		constructor(private text?: string) {
			super();
			this.text = text;
		}
		build(context: BuildContext) {
			const text = Provider.of('counter', context) as string;

			return Container({
				color: 'yellow',
				margin: EdgeInsets.all(10),
				padding: EdgeInsets.all(10),
				child: Text(text, {
					style: new TextStyle({
						color: 'black',
						fontSize: 20
					})
				})
			});
		}
	}

	import { StatefulWidget, State } from '@meursyphus/flitter';

	class CounterWidget extends StatefulWidget {
		constructor() {
			super();
		}

		createState() {
			return new CounterState();
		}
	}

	class CounterState extends State<CounterWidget> {
		private count: number = 0;

		increment() {
			this.count += 1;
			this.setState();
		}

		build(context: BuildContext) {
			return Container({
				color: 'lightblue',
				margin: EdgeInsets.all(10),
				padding: EdgeInsets.all(10),
				child: Column({
					children: [
						Provider({
							providerKey: 'counter',
							value: this.count.toString(),
							child: new CustomWidget()
						}),
						GestureDetector({
							onClick: () => this.increment(),
							child: Container({
								color: 'blue',
								padding: EdgeInsets.all(10),
								child: Text('Increment')
							})
						})
					]
				})
			});
		}
	}

	const counterWidget = new CounterWidget();
</script>

<input bind:value={input} />
<Widget height="200px" width="300px" renderer="svg" widget={counterWidget} />
