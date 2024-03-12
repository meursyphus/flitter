import { dedent } from 'ts-dedent';
import { BoxDecoration, Container, Positioned, Stack, ZIndex } from '@meursyphus/flitter';

function ZIndexLocalContext() {
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
						zIndex: -1,
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
			child: Container({
				width: 100,
				height: 100,
				color: 'lightblue',
				child: ZIndex({
					zIndex: -1,
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
	]
});
`
};

export default StoryArgs;
