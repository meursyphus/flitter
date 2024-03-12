import {
	Alignment,
	AnimationController,
	Container,
	Element,
	GestureDetector,
	State,
	StatefulWidget,
	Text,
	TextStyle,
	Transform,
	Widget
} from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

class RotateRectangleWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new RotateRectangleState();
	}
}

class RotateRectangleState extends State<RotateRectangleWidget> {
	animationController!: AnimationController;
	initState(): void {
		this.animationController = new AnimationController({ duration: 3000 });
		this.animationController.addListener(() => {
			this.setState();
		});
		this.animationController.forward();
	}

	build(context: Element): Widget {
		return GestureDetector({
			onClick: () => {
				if (this.animationController.isCompleted || this.animationController.status === 'forward') {
					this.animationController.reverse();
				} else {
					this.animationController.forward();
				}
				this.setState();
			},
			child: Transform.rotate({
				angle: this.animationController.value * Math.PI * 2,
				child: Container({
					width: 200,
					height: 200,
					color: 'black',
					alignment: Alignment.center,
					child: Text(this.animationController.status === 'dismissed' ? 'Move' : 'Stop', {
						style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
					})
				})
			})
		});
	}
}

const Basic = {
	widget: Container({
		alignment: Alignment.center,
		color: 'lightgreen',
		child: new RotateRectangleWidget()
	}),

	code: dedent`
	`
};

export default Basic;
