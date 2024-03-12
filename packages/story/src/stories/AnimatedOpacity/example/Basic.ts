import { dedent } from 'ts-dedent';
import {
	AnimatedOpacity,
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
	faded = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.faded = !this.faded;
					});
				},
				child: AnimatedOpacity({
					opacity: this.faded ? 0.2 : 1,
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.faded ? 'make it fade' : 'restore', {
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
	AnimatedOpacity,
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
	faded = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.faded = !this.faded;
					});
				},
				child: AnimatedOpacity({
					opacity: this.faded ? 0.2 : 1,
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.faded ? 'make it fade' : 'restore', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						})
					})
				})
			})
		});
	}
}`
};

export default BasicStory;
