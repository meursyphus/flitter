import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Column, Opacity } from 'flitter-core';

const meta = {
	title: 'Painting/Opacity',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				children: [
					Opacity({ opacity: 1, child: Container({ width: 400, height: 60, color: 'orange' }) }),
					Opacity({ opacity: 0.5, child: Container({ width: 400, height: 60, color: 'orange' }) }),
					Opacity({ opacity: 0.25, child: Container({ width: 400, height: 60, color: 'orange' }) })
				]
			})
		})
	}
};

export const Nest: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Column({
			children: [
				Opacity({
					opacity: 0.5,
					child: Container({ width: 400, height: 60, color: 'blue' })
				}),
				Opacity({
					opacity: 0.5,
					child: Container({
						child: Opacity({
							opacity: 0.5,
							child: Container({ width: 400, height: 60, color: 'blue' })
						})
					})
				})
			]
		})
	}
};
