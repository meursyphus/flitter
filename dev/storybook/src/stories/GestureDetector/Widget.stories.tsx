import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import {
	BasicStory,
	ColorChangeStory,
	DynamicallyExistsStory,
	SizeChangeStory,
	TestStatefulWidgetStory,
	EventBubbleStory
} from './examples/index.js';

const meta = {
	title: 'Interaction/GestureDetector',
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

export const ColorChange: Story = {
	args: ColorChangeStory
};

export const SizeChange: Story = {
	args: SizeChangeStory
};

export const TestStatefulWidget: Story = {
	args: TestStatefulWidgetStory
};

export const DynamicallyExists: Story = {
	args: DynamicallyExistsStory
};

export const EventBubble: Story = {
	args: EventBubbleStory
};
