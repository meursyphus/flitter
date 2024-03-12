import { dedent } from 'ts-dedent';
import {
	StatefulWidget,
	State,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	AnimatedFractionallySizedBox,
	Stack,
	StackFit
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Container({
			color: 'red',
			width: Infinity,
			height: Infinity,
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.selected = !this.selected;
					});
				},
				child: Stack({
					fit: StackFit.expand,
					children: [
						Text('Click me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						}),
						AnimatedFractionallySizedBox({
							widthFactor: this.selected ? 0.25 : 0.75,
							heightFactor: this.selected ? 0.75 : 0.25,
							alignment: this.selected ? Alignment.topLeft : Alignment.bottomRight,
							duration: 1000,
							child: Container({
								color: 'blue'
							})
						})
					]
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
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	AnimatedFractionallySizedBox,
	Stack,
	StackFit
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Container({
			color: 'red',
			width: Infinity,
			height: Infinity,
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.selected = !this.selected;
					});
				},
				child: Stack({
					fit: StackFit.expand,
					children: [
						Text('Click me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						}),
						AnimatedFractionallySizedBox({
							widthFactor: this.selected ? 0.25 : 0.75,
							heightFactor: this.selected ? 0.75 : 0.25,
							alignment: this.selected ? Alignment.topLeft : Alignment.bottomRight,
							duration: 1000,
							child: Container({
								color: 'blue'
							})
						})
					]
				})
			})
		});
	}
}
`
};

export default BasicStory;
