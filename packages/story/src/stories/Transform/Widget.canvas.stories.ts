import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Center,
	Transform,
	Matrix4,
	Container,
	Alignment,
	Text,
	TextStyle
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Transform/canvas',
	component: Widget,
	args: {
		renderer: 'canvas'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Transform({
				transform: Matrix4.translationValues(-50, -50, 0),
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
	}
};

export const Rotate: Story = {
	args: {
		width: '400px',
		height: '400px',

		widget: Center({
			child: Transform.rotate({
				angle: Math.PI / 4,
				child: Container({
					width: 200,
					height: 200,
					color: 'green',
					alignment: Alignment.bottomRight,
					child: Container({
						color: 'red',
						child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				})
			})
		})
	}
};
export const Scale: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Transform.scale({
				scale: 0.5,
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
	}
};

export const Symmetric: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Transform({
				transform: Matrix4.diagonal3Values(1, -1, 1),
				alignment: Alignment.center,
				child: Container({
					width: 200,
					height: 200,
					color: 'green',
					alignment: Alignment.bottomRight,
					child: Container({
						color: 'red',
						child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				})
			})
		})
	}
};
