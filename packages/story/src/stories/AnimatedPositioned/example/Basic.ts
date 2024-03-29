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
	Stack,
	AnimatedPositioned,
	Curves,
	Center,
	SizedBox
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Center({
			child: SizedBox({
				width: 200,
				height: 400,
				child: Stack({
					children: [
						AnimatedPositioned({
							width: this.selected ? 200 : 60,
							height: this.selected ? 60 : 200,
							top: this.selected ? 50 : 150,
							duration: 1000,
							curve: Curves.backInOut,
							child: GestureDetector({
								onClick: () => {
									this.setState(() => {
										this.selected = !this.selected;
									});
								},
								child: Container({
									alignment: Alignment.center,
									color: 'lightblue',
									child: Text('Tap me', {
										style: new TextStyle({ fontSize: 14, fontWeight: '400' })
									})
								})
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
	Stack,
	AnimatedPositioned,
	Curves,
	Center,
	SizedBox
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Center({
			child: SizedBox({
				width: 200,
				height: 400,
				child: Stack({
					children: [
						AnimatedPositioned({
							width: this.selected ? 200 : 60,
							height: this.selected ? 60 : 200,
							top: this.selected ? 50 : 150,
							duration: 1000,
							curve: Curves.backInOut,
							child: GestureDetector({
								onClick: () => {
									this.setState(() => {
										this.selected = !this.selected;
									});
								},
								child: Container({
									alignment: Alignment.center,
									color: 'lightblue',
									child: Text('Tap me', {
										style: new TextStyle({ fontSize: 14, fontWeight: '400' })
									})
								})
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
