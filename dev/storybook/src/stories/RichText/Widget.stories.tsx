import type { Meta, StoryObj } from '@storybook/react';
import DualRenderer from '../../components/DualRenderer';
import {
	TextStyle,
	Container,
	Center,
	RichText,
	TextSpan,
	TextAlign,
	TextWidthBasis,
	TextOverflow,
	ConstrainedBox,
	Constraints
} from 'flitter-core';

const meta = {
	title: 'Text/RichText',
	component: DualRenderer
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({ text: new TextSpan({ text: 'Rich Text!!' }) })
			})
		})
	}
};

export const WidthChildren: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Text1 ',
						style: new TextStyle({ color: 'white' }),
						children: [
							new TextSpan({ text: 'Text2 ', style: new TextStyle({ fontSize: 24 }) }),
							new TextSpan({ text: 'Text3', style: new TextStyle({ inherit: false }) })
						]
					})
				})
			})
		})
	}
};

export const TextAlignCenter: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					textAlign: TextAlign.center,
					text: new TextSpan({ text: 'Align Center' })
				})
			})
		})
	}
};

export const MultiLine: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: ConstrainedBox({
					constraints: new Constraints({ maxWidth: 300 }),
					child: RichText({
						text: new TextSpan({
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST\u23AAEp.07 CLEANING'
						})
					})
				})
			})
		})
	}
};

export const TextWidthBasisLongestLine: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: ConstrainedBox({
					constraints: new Constraints({ maxWidth: 300 }),
					child: RichText({
						textWidthBasis: TextWidthBasis.longestLine,
						text: new TextSpan({
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST\u23AAEp.07 CLEANING'
						})
					})
				})
			})
		})
	}
};

export const Clipped: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 100,
				height: 100,
				child: RichText({
					overflow: TextOverflow.clip,
					text: new TextSpan({
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST\u23AA\uCCAD\uC18C\uD560 \uB54C \uB4E3\uAE30 \uC88B\uC740 \uBE14\uB8E8\uC2A4 \uD31D \uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8'
					})
				})
			})
		})
	}
};

export const NoWrapped: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					softWrap: false,
					text: new TextSpan({
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST\u23AA\uCCAD\uC18C\uD560 \uB54C \uB4E3\uAE30 \uC88B\uC740 \uBE14\uB8E8\uC2A4 \uD31D \uD50C\uB808\uC774\uB9AC\uC2A4\uD2B8'
					})
				})
			})
		})
	}
};

export const LineChangeAtN: Story = {
	name: 'Line Change At \\n',
	args: {
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({ text: 'Hello\nLine Changed!!' })
				})
			})
		})
	}
};
