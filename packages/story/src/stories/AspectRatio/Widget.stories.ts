import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Column, Opacity, Center, Alignment, AspectRatio } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/AspectRatio',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
	Container({
		width: Infinity,
		height: 150,
		color: 'orange',
		alignment: Alignment.center,
		child: AspectRatio({
			aspectRatio: 16 / 9,
			child: Container({
				color: 'purple'
			})
		})
	})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 300 },
		width: '400px',
		height: '300px',
		code:
			dedent`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\n\n\n` + BasicCode,
		widget: Container({
			width: Infinity,
			height: 150,
			color: 'orange',
			alignment: Alignment.center,
			child: AspectRatio({
				aspectRatio: 16 / 9,
				child: Container({
					color: 'purple'
				})
			})
		})
	}
};
