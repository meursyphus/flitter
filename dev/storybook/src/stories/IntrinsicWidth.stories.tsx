import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../components/DualRenderer';
import {
	Alignment,
	Column,
	Container,
	CrossAxisAlignment,
	IntrinsicWidth,
	MainAxisAlignment
} from 'flitter-core';

const meta = {
	title: 'Layout/IntrinsicWidth',
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
			child: IntrinsicWidth({
				child: Column({
					mainAxisAlignment: MainAxisAlignment.spaceBetween,
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						Container({ height: 50, width: 50, color: 'red' }),
						Container({ height: 50, width: 200, color: 'green' }),
						Container({ height: 50, width: 100, color: 'blue' })
					]
				})
			})
		})
	}
};
