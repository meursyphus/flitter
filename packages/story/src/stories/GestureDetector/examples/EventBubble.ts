import {
	Alignment,
	Container,
	GestureDetector,
	Text,
	TextStyle,
	StatefulWidget,
	State,
	EdgeInsets
} from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

class CustomWidget extends StatefulWidget {
	colors: string[];

	constructor({ colors, key }: { colors: string[]; key?: string }) {
		super(key);
		this.colors = colors;
	}

	createState(): State<StatefulWidget> {
		return new CustomState();
	}
}

class CustomState extends State<CustomWidget> {
	index = 0;
	handleClick = () => {
		this.index = (this.index + 1) % this.widget.colors.length;
		this.setState();
	};
	build() {
		return GestureDetector({
			onClick: () => {
				this.handleClick();
			},
			child: Container({
				width: 200,
				height: 200,
				color: this.widget.colors[this.index],
				alignment: Alignment.center,
				child: GestureDetector({
					bubble: {
						click: true
					},
					onClick: () => {
						alert('nested click!');
					},
					child: Container({
						padding: EdgeInsets.all(10),
						color: 'yellow',
						child: Text('nested click!', {
							style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'black' })
						})
					})
				})
			})
		});
	}
}

const CustomStory = {
	widget: Container({
		alignment: Alignment.center,
		color: 'lightgreen',
		child: new CustomWidget({
			colors: ['black', 'red', 'green']
		})
	}),
	code: dedent`
class CustomWidget extends StatefulWidget {
	colors: string[];

	constructor({ colors, key }: { colors: string[]; key?: string }) {
		super(key);
		this.colors = colors;
	}

	createState(): State<StatefulWidget> {
		return new CustomState();
	}
}

class CustomState extends State<CustomWidget> {
	index = 0;
	handleClick = () => {
		this.index = (this.index + 1) % this.widget.colors.length;
		this.setState();
	};
	build() {
		return GestureDetector({
			onClick: () => {
				this.handleClick();
			},
			child: Container({
				width: 200,
				height: 200,
				color: this.widget.colors[this.index],
				alignment: Alignment.center,
				child: GestureDetector({
					bubble: {
						click: true
					},
					onClick: () => {
						alert('nested click!');
					},
					child: Container({
						padding: EdgeInsets.all(10),
						color: 'yellow',
						child: Text('nested click!', {
							style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'black' })
						})
					})
				})
			})
		});
	}
}
		`
};

export default CustomStory;
