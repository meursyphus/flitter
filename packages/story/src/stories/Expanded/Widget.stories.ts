import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Align, Alignment, Row, Expanded, Spacer } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Expanded',
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
						Spacer({ flex: 0.5 }),
						Expanded({
							flex: 1,
							child: Container({
								color: 'orange',
								height: 50
							})
						}),
						Spacer({ flex: 0.5 })
					]
				})
			})
		})
	}
};
