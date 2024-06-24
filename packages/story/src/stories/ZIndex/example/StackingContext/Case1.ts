import { BoxDecoration, Container, Positioned, Stack, ZIndex } from '@meursyphus/flitter';

function ZIndexLocalContext() {
	return Stack({
		children: [
			Positioned({
				top: 0,
				left: 0,
				child: ZIndex({
					zIndex: 0,
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

const StoryArgs = {
	widget: ZIndexLocalContext()
};

export default StoryArgs;
