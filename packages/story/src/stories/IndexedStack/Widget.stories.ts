import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, IndexedStack, Center, Stack } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/IndexedStack',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
	Center({
		child: IndexedStack({
			index: 0,
			children: [
				Container({
					width: 200,
					height: 200,
					color: 'green'
				}),
				Container({
					width: 150,
					height: 150,
					color: 'purple'
				}),
				Container({
					width: 100,
					height: 100,
					color: 'red'
				})
			]
		})
	})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code:
			dedent`import { Container, Center, IndexedStack } from '@meursyphus/flitter';'\n\n\n` +
			BasicCode,
		widget: Center({
			child: IndexedStack({
				index: 0,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'green'
					}),
					Container({
						width: 150,
						height: 150,
						color: 'purple'
					}),
					Container({
						width: 100,
						height: 100,
						color: 'red'
					})
				]
			})
		})
	}
};
