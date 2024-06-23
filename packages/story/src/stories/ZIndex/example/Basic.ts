import { Container, Positioned, Stack, ZIndex, BoxDecoration } from '@meursyphus/flitter';

function Example() {
	return Stack({
		children: [
			Positioned({
				top: 0,
				left: 0,
				child: Container({
					width: 100,
					height: 100,
					color: 'lightblue',
					child: ZIndex({
						zIndex: 9999,
						child: Container({
							width: 100,
							height: 100,
							decoration: new BoxDecoration({
								shape: 'circle',
								color: 'black'
							})
						})
					})
				})
			}),
			Positioned({
				top: 50,
				left: 0,
				child: Container({
					width: 100,
					height: 100,
					color: 'orange'
				})
			})
		]
	});
}

const BasicStory = {
	widget: Example()
};

export default BasicStory;
