import { dedent } from 'ts-dedent';
import {
	Container,
	AnimatedAlign,
	StatefulWidget,
	Alignment,
	State,
	Widget,
	GestureDetector,
	Text,
	Stack,
	Positioned,
	TextStyle,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	alignements = [
		Alignment.topLeft,
		Alignment.topRight,
		Alignment.bottomRight,
		Alignment.bottomLeft
	];
	name = ['To Top_Right', 'To Bottom_Right', 'To Bottom_Left', 'To Top_Left'];
	index = 0;
	build(): Widget {
		return Stack({
			alignment: Alignment.center,
			children: [
				AnimatedAlign({
					alignment: this.alignements[this.index],
					duration: 300,
					child: Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				}),
				Positioned({
					child: GestureDetector({
						child: Container({
							color: 'yellow',
							padding: EdgeInsets.all(10),
							child: Text(this.name[this.index], {
								style: new TextStyle({ fontSize: 32, color: 'black' })
							})
						}),
						onClick: () => {
							this.setState(() => {
								this.index = (this.index + 1) % this.alignements.length;
							});
						}
					})
				})
			]
		});
	}
}

const BasicStory = {
	widget: new CustomWidget(),
	code: dedent`
import {
	Container,
	AnimatedAlign,
	StatefulWidget,
	Alignment,
	State,
	Widget,
	GestureDetector,
	Text,
	Stack,
	Positioned,
	TextStyle,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidgetState extends State<CustomWidget> {
	alignements = [
		Alignment.topLeft,
		Alignment.topRight,
		Alignment.bottomRight,
		Alignment.bottomLeft
	];
	name = ['To Top_Right', 'To Bottom_Right', 'To Bottom_Left', 'To Top_Left'];
	index = 0;
	build(): Widget {
		return Stack({
			alignment: Alignment.center,
			children: [
				AnimatedAlign({
					alignment: this.alignements[this.index],
					duration: 300,
					child: Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				}),
				Positioned({
					child: GestureDetector({
						child: Container({
							color: 'yellow',
							padding: EdgeInsets.all(10),
							child: Text(this.name[this.index], {
								style: new TextStyle({ fontSize: 32, color: 'black' })
							})
						}),
						onClick: () => {
							this.setState(() => {
								this.index = (this.index + 1) % this.alignements.length;
							});
						}
					})
				}),
			]
		});
	}
}`
};

export default BasicStory;
