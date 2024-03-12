import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	BasicStory,
	ColorChangeStory,
	DynamicallyExistsStory,
	SizeChangeStory,
	TestStatefulWidgetStory,
	EventBubbleStory
} from './examples';

const meta = {
	title: 'Widget/GestureDetector',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	},
	args: {
		width: '400px',
		height: '400px',
		ssrSize: { width: 400, height: 400 }
	}
} satisfies Meta<Widget>;

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
