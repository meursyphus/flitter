import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { BasicStory } from './example/index.js';

const meta = {
	title: 'Animation/AnimatedAlign',
	component: DualRenderer,
	args: {
		width: '600px',
		height: '300px'
	}
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: BasicStory
};
