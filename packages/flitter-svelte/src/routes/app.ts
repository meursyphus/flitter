import {
	Container,
	Animation,
	GestureDetector,
	Text,
	TextStyle,
	StatefulWidget,
	State,
	Widget,
	Alignment,
	SizedBox,
	Column,
	MainAxisSize,
	MainAxisAlignment,
	Row,
	CrossAxisAlignment,
	FractionallySizedBox,
	BoxDecoration,
	BorderRadius,
	Radius,
	AnimationController,
	Tween,
	CurvedAnimation,
	Curves
} from '@meursyphus/flitter';

export default function BarChart() {
	return Container({
		alignment: Alignment.center,
		color: 'lightgrey',
		child: Column({
			mainAxisSize: MainAxisSize.min,
			crossAxisAlignment: CrossAxisAlignment.center,
			children: [
				Text('BarChart', { style: new TextStyle({ fontFamily: 'Intent' }) }),
				SizedBox({
					width: 200,
					height: 150,
					child: Row({
						mainAxisAlignment: MainAxisAlignment.spaceBetween,
						children: [
							{ label: 'S', value: 60 },
							{ label: 'M', value: 20 },
							{ label: 'T', value: 30 },
							{ label: 'W', value: 90 },
							{ label: 'T', value: 70 },
							{ label: 'F', value: 50 },
							{ label: 'S', value: 40 }
						].map(({ label, value }) => new Bar(label, value))
					})
				})
			]
		})
	});
}

class Bar extends StatefulWidget {
	constructor(
		public label: string,
		public value: number
	) {
		super();
	}

	createState(): State<StatefulWidget> {
		return new BarState();
	}
}

class BarState extends State<Bar> {
	animationController!: AnimationController;
	tweenAnimation!: Animation<number>;

	override initState(): void {
		this.animationController = new AnimationController({
			duration: 1000
		});
		this.animationController.addListener(() => {
			this.setState();
		});
		const tween = new Tween({ begin: 0, end: this.widget.value });
		this.tweenAnimation = tween.animated(
			new CurvedAnimation({
				parent: this.animationController,
				curve: Curves.easeInOut
			})
		);
		this.animationController.forward();
	}

	override build() {
		return Column({
			mainAxisAlignment: MainAxisAlignment.end,
			children: [
				FractionallySizedBox({
					heightFactor: this.tweenAnimation.value / 100,
					child: Column({
						children: [
							Container({
								width: 20,
								decoration: new BoxDecoration({
									borderRadius: BorderRadius.only({
										topLeft: Radius.circular(4),
										topRight: Radius.circular(4)
									}),
									color: '#1a1a1a'
								})
							}),
							SizedBox({ height: 5 }),
							Text(this.widget.label, { style: new TextStyle({ fontFamily: 'Intent' }) })
						]
					})
				})
			]
		});
	}
}
