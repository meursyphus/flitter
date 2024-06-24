import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, IndexedStack, Center } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/IndexedStack',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: IndexedStack({
				index: 0,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'green'
					}),
					Container({
						width: 150,
						height: 150,
						color: 'purple'
					}),
					Container({
						width: 100,
						height: 100,
						color: 'red'
					})
				]
			})
		})
	}
};
