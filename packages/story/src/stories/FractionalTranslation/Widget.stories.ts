import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Column, FractionalTranslation, Offset } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/FractionalTranslation',
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
					Container({
						width: 50,
						height: 50,
						color: 'purple'
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'blue'
						})
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'orange'
						})
					})
				]
			})
		})
	}
};
