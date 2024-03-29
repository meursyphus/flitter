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
	AnimatedPadding,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	shrinked = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.shrinked = !this.shrinked;
					});
				},
				child: AnimatedPadding({
					padding: EdgeInsets.all(this.shrinked ? 50 : 0),
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.shrinked ? 'make it shrink' : 'restore', {
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
	AnimatedPadding,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	shrinked = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.shrinked = !this.shrinked;
					});
				},
				child: AnimatedPadding({
					padding: EdgeInsets.all(this.shrinked ? 50 : 0),
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.shrinked ? 'make it shrink' : 'restore', {
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
