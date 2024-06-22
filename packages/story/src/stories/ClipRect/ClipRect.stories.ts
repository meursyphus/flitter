import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Container,
	ClipRect,
	Rect,
	Stack,
	Positioned,
	SizedBox,
	Offset
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/ClipRect',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: ClipRect({
			clipper: (size) =>
				Rect.fromLTWH({
					left: 0,
					top: 0,
					width: (size.width * 3) / 4,
					height: (size.height * 3) / 4
				}),
			child: Stack({
				children: [
					SizedBox({
						width: 400,
						height: 400
					}),
					Positioned({
						child: Container({ width: 200, height: 200, color: 'blue' })
					}),
					Positioned({
						left: 200,
						child: Container({ width: 200, height: 200, color: 'red' })
					}),
					Positioned({
						top: 200,
						child: Container({ width: 200, height: 200, color: 'green' })
					}),
					Positioned({
						left: 200,
						top: 200,
						child: Container({ width: 200, height: 200, color: 'purple' })
					})
				]
			})
		})
	}
};

export const Nested: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: ClipRect({
			clipper: (size) =>
				Rect.fromCenter({
					center: new Offset({ x: size.width / 2, y: size.height / 2 }),
					width: size.width / 2,
					height: size.height / 2
				}),
			child: ClipRect({
				clipper: (size) =>
					Rect.fromCenter({
						center: new Offset({ x: (size.width * 3) / 4, y: size.height / 4 }),
						width: size.width / 2,
						height: size.height / 2
					}),
				child: Container({
					color: 'black'
				})
			})
		})
	}
};
