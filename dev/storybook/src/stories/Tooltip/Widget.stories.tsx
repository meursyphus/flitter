import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { BasicStory, ConstrainedTightStory } from './example/index.js';

const meta = {
	title: 'Interaction/Tooltip',
	component: DualRenderer,
	args: {
		width: '400px',
		height: '400px'
	}
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};

export const ConstrainedTight: Story = {
	args: ConstrainedTightStory
};
