import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
import { Center, CustomPaint, Size } from '@meursyphus/flitter';

const meta = {
	title: 'Widget/CustomPaint',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		ssrSize: { width: 400, height: 400 },
		width: '400px',
		height: '400px',
		widget: Center({
			child: CustomPaint({
				size: Size.infinite,
				painter: {
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
			})
		}),
		code: dedent`
		import { Center, CustomPaint, Size } from '@meursyphus/flitter';

		Center({
			child: CustomPaint({
				size: Size.infinite,
				painter: {
					paint({ rect }, size) {
						rect.setAttribute('fill', 'red');
						rect.setAttribute('width', \`\${size.width}\`);
						rect.setAttribute('height', \`\${size.height}\`);
					},

					createDefaultSvgEl({ createSvgEl }) {
						const rect = createSvgEl('rect');

						return {
							rect
						};
					},
				}
			})
		})
		`
	}
};
