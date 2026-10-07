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


export const EllipsisAndCjk: Story = {
  args: {
    width: '600px',
    height: '200px',
    widget: Center({
      child: Container({
        width: 180,
        color: '#eef2ff',
        child: RichText({
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          text: new TextSpan({
            text: '「こんにちは」世界。你好，世界！ 긴 문장도 자연스럽게 여러 줄로 표시됩니다.',
            style: new TextStyle({fontSize: 18})
          })
        })
      })
    })
  }
};

export const EmptyLinesAndSoftHyphens: Story = {
  args: {
    width: '600px',
    height: '200px',
    widget: Center({
      child: Container({
        width: 130,
        color: '#f0fdf4',
        child: RichText({
          text: new TextSpan({
            text: 'First line\n\ninter\u00adnational\u00adization\n',
            style: new TextStyle({fontSize: 20})
          })
        })
      })
    })
  }
};
