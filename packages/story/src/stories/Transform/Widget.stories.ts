import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import {
	Center,
	Transform,
	Matrix4,
	Container,
	Alignment,
	Text,
	TextStyle
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/Transform',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
		Center({
			child: Transform({
				transform: Matrix4.translationValues(-50, -50, 0),
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code:
			dedent`import { Center, Transform, Matrix4, Container } from '@meursyphus/flitter';\n\n\n` +
			BasicWidget,
		widget: Center({
			child: Transform({
				transform: Matrix4.translationValues(-50, -50, 0),
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
	}
};

export const Rotate: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code: dedent`
		import { Center, Transform, Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';

		Center({
			child: Transform.rotate({
				angle: Math.PI / 4,
				child: Container({
					width: 200,
					height: 200,
					color: 'green',
					alignment: Alignment.bottomRight,
					child: Container({
						color: 'red',
						child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				})
			})
		})
			
			`,
		widget: Center({
			child: Transform.rotate({
				angle: Math.PI / 4,
				child: Container({
					width: 200,
					height: 200,
					color: 'green',
					alignment: Alignment.bottomRight,
					child: Container({
						color: 'red',
						child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				})
			})
		})
	}
};

const ScaleCode = dedent`
		Center({
			child: Transform.scale({
				scale: 0.5,
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
`;

export const Scale: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code:
			dedent`import { Center, Transform, Container } from '@meursyphus/flitter';\n\n\n` + ScaleCode,
		widget: Center({
			child: Transform.scale({
				scale: 0.5,
				child: Container({
					width: 200,
					height: 200,
					color: 'green'
				})
			})
		})
	}
};

export const Symmetric: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		code: dedent`
			import { Center, Transform, Container, Text, TextStyle, Matrix4, Alignment } from '@meursyphus/flitter'
			
			`,
		widget: Center({
			child: Transform({
				transform: Matrix4.diagonal3Values(1, -1, 1),
				alignment: Alignment.center,
				child: Container({
					width: 200,
					height: 200,
					color: 'green',
					alignment: Alignment.bottomRight,
					child: Container({
						color: 'red',
						child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				})
			})
		})
	}
};
