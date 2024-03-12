import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Column, Opacity, Center, Alignment } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Opacity',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
		Container({
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
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code:
			dedent`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\n\n\n` + BasicCode,
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

const NestCode = dedent`
		Column({
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
`;

export const Nest: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '400px',
		height: '400px',
		code:
			dedent`import {  Container, Column, Opacity, Column } from '@meursyphus/flitter';'\n\n\n` +
			NestCode,
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
