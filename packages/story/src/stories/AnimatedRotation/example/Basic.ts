import { dedent } from 'ts-dedent';
import {
	AnimatedRotation,
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	turns = 0;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.turns += 0.25;
					});
				},
				child: AnimatedRotation({
					turns: this.turns,
					duration: 1000,
					child: Container({
						width: 200,
						height: 200,
						color: 'red',
						alignment: Alignment.center,
						child: Text('Tab me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
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
import { dedent } from 'ts-dedent';
import {
	AnimatedRotation,
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	turns = 0;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.turns += 0.25;
					});
				},
				child: AnimatedRotation({
					turns: this.turns,
					duration: 1000,
					child: Container({
						width: 200,
						height: 200,
						color: 'red',
						alignment: Alignment.center,
						child: Text('Tab me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
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
