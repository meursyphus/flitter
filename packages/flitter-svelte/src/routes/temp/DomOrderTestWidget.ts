import {
	Container,
	Element,
	MainAxisSize,
	Row,
	SizedBox,
	State,
	StatefulWidget,
	Text,
	ZIndex
} from '@meursyphus/flitter';

class DomOrderTestWidget extends StatefulWidget {
	subscribe: (callback: (text: string) => void) => void;
	constructor({ subscribe }: { subscribe: (callback: (text: string) => void) => void }) {
		super();
		this.subscribe = subscribe;
	}
	createState() {
		return new DomOrderTestWidgetState();
	}
}

class DomOrderTestWidgetState extends State<DomOrderTestWidget> {
	visible = true;
	text = '';

	initState(context: Element): void {
		this.widget.subscribe((text: string) => {
			this.setState(() => {
				this.text = text;
			});
		});
	}

	build() {
		return Row({
			mainAxisSize: MainAxisSize.min,
			children: [
				Text(this.text),
				SizedBox({ width: 10 }),
				ZIndex({
					zIndex: 0,
					child: Container({
						width: 100,
						height: 100,
						color: 'red'
					})
				})
			]
		});
	}
}

export default DomOrderTestWidget;
