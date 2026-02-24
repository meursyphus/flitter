import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../components/DualRenderer';
import {
	Alignment,
	Container,
	CrossAxisAlignment,
	IntrinsicHeight,
	MainAxisAlignment,
	Row
} from 'flitter-core';

const meta = {
	title: 'Layout/IntrinsicHeight',
	component: DualRenderer,
	tags: ['autodocs'],
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Case1: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			color: 'grey',
			child: IntrinsicHeight({
				child: Row({
					mainAxisAlignment: MainAxisAlignment.spaceBetween,
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						Container({ width: 50, height: 50, color: 'red' }),
						Container({ width: 50, height: 200, color: 'green' }),
						Container({ width: 50, height: 100, color: 'blue' })
					]
				})
			})
		})
	}
};
