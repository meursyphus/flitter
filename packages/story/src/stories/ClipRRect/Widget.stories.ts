import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, ClipRRect, BorderRadius, Radius, Center } from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

const meta = {
	title: 'Widget/ClipRRect',
	component: Widget as any,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
	Center({
		child: ClipRRect({
			borderRadius: BorderRadius.all(Radius.circular(20)),
			child: Container({
				color: 'red',
				width: 200,
				height: 200
			})
		})
	})
`;
export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		widget: Center({
			child: ClipRRect({
				borderRadius: BorderRadius.all(Radius.circular(40)),
				child: Container({
					color: 'red',
					width: 200,
					height: 200
				})
			})
		}),
		code:
			dedent`import { Container, Center, ClipRRect } from '@meursyphus/flitter';\n\n\n` + BasicCode
	}
};
