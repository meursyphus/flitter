import { dedent } from 'ts-dedent';
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
