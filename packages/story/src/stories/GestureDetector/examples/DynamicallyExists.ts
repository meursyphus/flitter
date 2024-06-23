import {
	Alignment,
	Container,
	GestureDetector,
	Text,
	TextStyle,
	StatefulWidget,
	State,
	Stack,
	Positioned,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	visible = true;
	build() {
		const handleClick = () => {
			console.log('set state called!');
			this.setState(() => {
				this.visible = !this.visible;
			});
		};
		return Container({
			width: 300,
			height: 300,
			child: Stack({
				alignment: Alignment.center,
				children: [
					Positioned({
						right: 0,
						top: 0,
						child: GestureDetector({
							onClick() {
								handleClick();
							},
							child: Container({
								color: 'gray',
								padding: EdgeInsets.all(10),
								child: Text(this.visible ? 'hide' : 'show')
							})
						})
					}),
					GestureDetector({
						onClick() {
							handleClick();
						},
						child: !this.visible
							? undefined
							: Container({
									width: 200,
									height: 200,
									color: 'black',
									alignment: Alignment.center,
									child: Text('click to size up!', {
										style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
									})
								})
					})
				]
			})
		});
	}
}

const SizeChangeStory = {
	widget: Container({
		alignment: Alignment.center,
		child: new CustomWidget()
	})
};

export default SizeChangeStory;
