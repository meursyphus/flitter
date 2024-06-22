import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Align, Alignment, Row, Spacer } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Spacer',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Align({
			alignment: Alignment.center,
			child: Container({
				color: 'lightblue',
				child: Row({
					children: [
						Container({
							color: 'blue',
							height: 50,
							width: 50
						}),
						Spacer(),
						Container({
							color: 'green',
							height: 50,
							width: 50
						})
					]
				})
			})
		})
	}
};
