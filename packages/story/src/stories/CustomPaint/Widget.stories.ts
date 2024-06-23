import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Center, CustomPaint, Size } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/CustomPaint',
	component: Widget
} satisfies Meta<Widget>;

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
					}
				}
			})
		})
	}
};

export const BasicOnCanvas: Story = {
	args: {
		width: '400px',
		height: '400px',
		renderer: 'canvas',
		widget: Center({
			child: CustomPaint({
				size: Size.infinite,
				painter: {
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
