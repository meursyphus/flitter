import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Container, Column, FractionalTranslation, Offset } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/FractionalTranslation',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
		Container({
			color: 'lightblue',
			child: Column({
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'purple'
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'blue'
						})
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'orange'
						})
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
			dedent`import { Container, Column, FractionalTranslation, Offset } from '@meursyphus/flitter';'\n\n\n` +
			BasicCode,
		widget: Container({
			color: 'lightblue',
			child: Column({
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'purple'
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'blue'
						})
					}),
					FractionalTranslation({
						translation: new Offset({ x: 1, y: -1 }),
						child: Container({
							width: 50,
							height: 50,
							color: 'orange'
						})
					})
				]
			})
		})
	}
};
