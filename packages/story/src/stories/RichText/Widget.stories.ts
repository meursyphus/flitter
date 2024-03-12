import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { dedent } from 'ts-dedent';
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
	Constraints,
	Text
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/RichText',
	component: Widget
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicWidget = dedent`
		Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Rich Text!!'
					})
				})
			})
		})
`;

export const Basic: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		code: dedent`import { Container, Center } from '@meursyphus/flitter'\n\n\n` + BasicWidget,
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Rich Text!!'
					})
				})
			})
		})
	}
};

export const WidthChildren: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Text1 ',
						style: new TextStyle({
							color: 'white'
						}),
						children: [
							new TextSpan({
								text: 'Text2 ',
								style: new TextStyle({
									fontSize: 24
								})
							}),
							new TextSpan({
								text: 'Text3',
								style: new TextStyle({
									inherit: false
								})
							})
						]
					})
				})
			})
		}),
		code: dedent`
		import { Container, Center, RichTExt, TextSpan, TextStyle } from '@meursyphus/flitter'

		Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Text1 ',
						style: new TextStyle({
							color: 'white'
						}),
						children: [
							new TextSpan({
								text: 'Text2 ',
								style: new TextStyle({
									fontSize: 24,
								})
							}),
							new TextSpan({
								text: 'Text3',
								style: new TextStyle({
									inherit: false
								})
							})
						]
					})
				})
			})
		}),
			`
	}
};

export const TextAlignCenter: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					textAlign: TextAlign.center,
					text: new TextSpan({
						text: 'Align Center'
					})
				})
			})
		}),
		code: dedent`
		import { Container, Center, RichText, TextAlign, TextSpan } from '@meursyphus/flitter'

		Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					textAlign: TextAlign.center,
					text: new TextSpan({
						text: 'Align Center'
					})
				})
			})
		}),
			`
	}
};

export const MultiLine: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
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
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
						})
					})
				})
			})
		}),
		code: dedent`
		import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

		Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: ConstrainedBox({
					constraints: new Constraints({ maxWidth: 300 }),
					child: RichText({
						text: new TextSpan({
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
						})
					})
				})
			})
		}),
			`
	}
};

export const TextWidthBasisLongestLine: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
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
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
						})
					})
				})
			})
		}),
		code: dedent`
		import { TextWidthBasis, RichText, Container, Center, ConstrainedBox, Constraints } from '@meursyphus/flitter'

		Center({ 
			child: Container({
				color: 'orange',
				child: ConstrainedBox({
					constraints: new Constraints({ maxWidth: 300 }),
					child: RichText({
						textWidthBasis: TextWidthBasis.longestLine,
						text: new TextSpan({
							text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
						})
					})
				})
			})
		}),
			`
	}
};

export const Clipped: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
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
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
					})
				})
			})
		}),
		code: dedent`
		import { Container, Center, RichText, TextOverflow, TExtSpan } from '@meursyphus/flitter'

		Center({
			child: Container({
				color: 'orange',
				width: 100,
				height: 100,
				child: RichText({
					overflow: TextOverflow.clip,
					text: new TextSpan({
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
					})
				})
			})
		}),
			`
	}
};

export const NoWrapped: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					softWrap: false,
					text: new TextSpan({
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
					})
				})
			})
		}),
		code: dedent`import { Container, Center, RichText, TextSpan } from '@meursyphus/flitter'
			
		Center({
			child: Container({
				color: 'orange',
				width: 300,
				child: RichText({
					softWrap: false,
					text: new TextSpan({
						text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
					})
				})
			})
		})
	`
	}
};

export const LineChangeAtN: Story = {
	storyName: 'Line Change At \n',
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Center({
			child: Container({
				color: 'orange',
				child: RichText({
					text: new TextSpan({
						text: 'Hello\nLine Changed!!'
					})
				})
			})
		}),
		code: dedent`
import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

Center({
	child: Container({
		color: 'orange',
		width: 300,
		child: ConstrainedBox({
			constraints: new Constraints({ maxWidth: 300 }),
			child: RichText({
				text: new TextSpan({
					text: Hello\\n\ Line Changed!!'
				})
			})
		})
	})
})
		`
	}
};
