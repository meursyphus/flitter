import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, IndexedStack, Center } from 'flitter-core';

const meta = {
	title: 'Layout/IndexedStack',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

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
					Container({ width: 200, height: 200, color: 'green' }),
					Container({ width: 150, height: 150, color: 'purple' }),
					Container({ width: 100, height: 100, color: 'red' })
				]
			})
		})
	}
};
