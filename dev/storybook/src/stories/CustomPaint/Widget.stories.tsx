import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import { Center, CustomPaint, Size } from 'flitter-core';

const meta = {
	title: 'Painting/CustomPaint',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: CustomPaint({
				size: Size.infinite,
				painter: {
					svg: {
						createDefaultSvgEl({ createSvgEl }) {
							const rect = createSvgEl('rect');
							return {
								rect
							};
						},
						paint({ rect }, size) {
							rect.setAttribute('fill', 'red');
							rect.setAttribute('width', `${size.width}`);
							rect.setAttribute('height', `${size.height}`);
						}
					},
					canvas: {
						paint(context, size) {
							context.canvas.fillStyle = 'red';
							context.canvas.fillRect(0, 0, size.width, size.height);
						}
					}
				}
			})
		})
	}
};
