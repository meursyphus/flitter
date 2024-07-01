import { dedent } from 'ts-dedent';
import {
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Widget,
	Text,
	TextStyle,
	AnimatedContainer,
	BoxDecoration,
	Border,
	BorderRadius,
	Radius,
	Alignment,
	BoxShadow,
	Offset,
	Matrix4
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	index = 0;
	props = [
		{
			width: 150,
			height: 200,
			transform: Matrix4.identity(),
			decoration: new BoxDecoration({
				color: 'yellow',
				border: Border.all({ width: 5, color: 'black' }),
				borderRadius: BorderRadius.all(Radius.circular(0)),
				boxShadow: [
					new BoxShadow({
						blurRadius: 10,
						color: 'blue',
						offset: new Offset({ x: -10, y: -10 })
					})
				]
			})
		},
		{
			height: 150,
			width: 200,
			transform: Matrix4.skewY(0.2),
			decoration: new BoxDecoration({
				color: 'red',
				border: Border.all({ width: 20, color: 'white' }),
				borderRadius: BorderRadius.all(Radius.circular(10)),
				boxShadow: [
					new BoxShadow({
						blurRadius: 10,
						color: 'black',
						offset: new Offset({ x: 20, y: -20 })
					})
				]
			})
		}
	];
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.index = (this.index + 1) % this.props.length;
					});
				},
				child: AnimatedContainer({
					duration: 1000,
					child: Text('Tab me', {
						style: new TextStyle({ fontSize: 16 })
					}),
					...this.props[this.index],
					alignment: Alignment.center
				})
			})
		});
	}
}

const BasicStory = {
	widget: new CustomWidget(),
	code: dedent`
import {
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	Offset,
	AnimatedSlide
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	clicked = false;
	build(): Widget {
		return Center({
			child: AnimatedSlide({
				offset: this.clicked ? new Offset({ x: 1, y: 1 }) : new Offset({ x: 0, y: 0 }),
				duration: 1000,
				child: GestureDetector({
					onClick: () => {
						this.setState(() => {
							this.clicked = !this.clicked;
						});
					},
					child: Container({
						width: 100,
						height: 100,
						color: 'yellow',
						alignment: Alignment.center,
						child: Text('Tab me', {
							style: new TextStyle({ fontSize: 16 })
						})
					})
				})
			})
		});
	}
}
`
};

export default BasicStory;
