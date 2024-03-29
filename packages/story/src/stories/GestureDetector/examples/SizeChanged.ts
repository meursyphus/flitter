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

class SizeChangeWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new SizeChangeState();
	}
}

class SizeChangeState extends State<SizeChangeWidget> {
	index = 0;
	width = 200;
	height = 200;
	build() {
		const handleClick = () => {
			this.width = this.width + 10;
			this.height = this.height + 10;
			console.log('set state called!');
			this.setState();
		};
		return GestureDetector({
			onClick() {
				handleClick();
			},
			child: Container({
				width: this.width,
				height: this.height,
				color: 'black',
				alignment: Alignment.center,
				child: Text('click to size up!', {
					style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
				})
			})
		});
	}
}

const SizeChangeStory = {
	widget: Container({
		alignment: Alignment.center,
		child: new SizeChangeWidget()
	}),
	code: dedent`
		`
};

export default SizeChangeStory;
