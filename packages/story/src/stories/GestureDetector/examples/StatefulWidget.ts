import {
	Alignment,
	Container,
	GestureDetector,
	Text,
	TextStyle,
	Column,
	MainAxisSize,
	Widget,
	Stack,
	Positioned,
	State,
	StatefulWidget
} from '@meursyphus/flitter';

class SizeChageWidget extends StatefulWidget {
	count: number;
	constructor({ count }: { count: number }) {
		super();
		this.count = count;
		console.log('created!', count);
	}
	createState(): State<StatefulWidget> {
		return new SizeChangeState();
	}
}

class SizeChangeState extends State<SizeChageWidget> {
	index = 0;
	width = 200;
	height = 200;
	handleClick = () => {
		this.setState(() => {
			this.width = this.width + 10;
			this.height = this.height + 10;
		});
	};
	build() {
		console.log('rebuild!', this.widget.count);
		return GestureDetector({
			onClick: () => {
				this.handleClick();
			},
			child: Container({
				width: this.width,
				height: this.height,
				color: 'black',
				alignment: Alignment.center,
				child: Column({
					mainAxisSize: MainAxisSize.min,
					children: [
						Text(`count: ${this.widget.count}`, {
							style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'yellow' })
						}),
						Text('click to size up!', {
							style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
						})
					]
				})
			})
		});
	}
}

class CounterWidget extends StatefulWidget {
	createState(): State<CounterWidget> {
		return new CounterState();
	}
}

class CounterState extends State<CounterWidget> {
	count = 0;
	handleClick() {
		this.setState(() => {
			this.count += 1;
		});
	}

	build(): Widget {
		return Stack({
			children: [
				Positioned({
					right: 0,
					top: -30,
					child: GestureDetector({
						onClick: () => {
							this.handleClick();
						},
						child: Container({
							color: 'white',
							child: Text('increse', {
								style: new TextStyle({ fontSize: 20 })
							})
						})
					})
				}),
				new SizeChageWidget({ count: this.count })
			]
		});
	}
}

const SizeChangeStory = {
	widget: Container({
		alignment: Alignment.center,
		child: new CounterWidget()
	})
};

export default SizeChangeStory;
