import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Column, Opacity } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Opacity',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				children: [
					Opacity({
						opacity: 1,
						child: Container({
							width: 400,
							height: 60,
							color: 'orange'
						})
					}),
					Opacity({
						opacity: 0.5,
						child: Container({
							width: 400,
							height: 60,
							color: 'orange'
						})
					}),
					Opacity({
						opacity: 0.25,
						child: Container({
							width: 400,
							height: 60,
							color: 'orange'
						})
					})
				]
			})
		})
	}
};

export const Nest: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Column({
			children: [
				Opacity({
					opacity: 0.5,
					child: Container({
						width: 400,
						height: 60,
						color: 'blue'
					})
				}),
				Opacity({
					opacity: 0.5,
					child: Container({
						child: Opacity({
							opacity: 0.5,
							child: Container({
								width: 400,
								height: 60,
								color: 'blue'
							})
						})
					})
				})
			]
		})
	}
};

export const NestOnCanvas: Story = {
	args: {
		renderer: 'canvas',
		width: '400px',
		height: '400px',
		widget: Column({
			children: [
				Opacity({
					opacity: 0.5,
					child: Container({
						width: 400,
						height: 60,
						color: 'blue'
					})
				}),
				Opacity({
					opacity: 0.5,
					child: Container({
						child: Opacity({
							opacity: 0.5,
							child: Container({
								width: 400,
								height: 60,
								color: 'blue'
							})
						})
					})
				})
			]
		})
	}
};
