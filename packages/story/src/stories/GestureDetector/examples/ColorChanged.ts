import {
	Alignment,
	Container,
	GestureDetector,
	Text,
	TextStyle,
	StatefulWidget,
	State
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
				child: Text('click here!!', {
					style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
				})
			})
		});
	}
}

const ColorChangeStory = {
	widget: Container({
		alignment: Alignment.center,
		color: 'lightgreen',
		child: new CustomWidget({
			colors: ['black', 'red', 'green']
		})
	}),
	code: dedent`
		`
};

export default ColorChangeStory;
