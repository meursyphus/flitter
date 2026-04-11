import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Container, Column, FractionalTranslation, Offset } from 'flitter-core';

const meta = {
	title: 'Painting/FractionalTranslation',
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
					Container({ width: 50, height: 50, color: 'purple' }),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({ width: 50, height: 50, color: 'blue' })
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({ width: 50, height: 50, color: 'orange' })
					})
				]
			})
		})
	}
};
