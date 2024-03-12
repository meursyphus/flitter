import { dedent } from 'ts-dedent';
import {
	BoxDecoration,
	Container,
	Offset,
	Positioned,
	Row,
	Stack,
	Transform,
	ZIndex
} from '@meursyphus/flitter';

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
						child: Row({
							children: [
								Container({
									width: 50,
									height: 50,
									color: 'red'
								}),
								Transform.translate({
									offset: new Offset({ x: -25, y: 0 }),
									child: ZIndex({
										zIndex: -1,
										child: Container({
											width: 50,
											height: 50,
											decoration: new BoxDecoration({
												shape: 'circle',
												color: 'black'
											})
										})
									})
								})
							]
						})
					})
				})
			})
		]
	});
}

const StoryArgs = {
	widget: ZIndexLocalContext(),

	code: dedent`
import {
	BoxDecoration,
	Container,
	Positioned,
	Stack,
	ZIndex
} from '@meursyphus/flitter';

Stack({
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
					child: Row({
						children: [
							Container({
								width: 50,
								height: 50,
								color: 'red'
							}),
							Transform.translate({
								offset: new Offset({ x: -25, y: 0 }),
								child: ZIndex({
									zIndex: -1,
									child: Container({
										width: 50,
										height: 50,
										decoration: new BoxDecoration({
											shape: 'circle',
											color: 'black'
										})
									})
								})
							})
						]
					})
				})
			})
		})
	]
});
`
};

export default StoryArgs;
