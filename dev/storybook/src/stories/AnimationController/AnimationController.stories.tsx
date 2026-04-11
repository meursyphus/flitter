import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { BasicStory } from './examples/index.js';

const meta = {
	title: 'Animation/AnimationController',
	component: DualRenderer,
	parameters: {
		layout: 'fullscreen'
	},
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
