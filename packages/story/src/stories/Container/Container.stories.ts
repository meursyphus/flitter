import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Container,
	Text,
	Alignment,
	EdgeInsets,
	Matrix4,
	BoxDecoration,
	BorderRadius,
	Radius,
	TextStyle
} from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';
const ImportWidgetCode = dedent`import { Container, Text, Alignment, EdgeInsets } from '@meursyphus/flitter';
\n\n`;

const meta = {
	title: 'Widget/Container',
	component: Widget,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: dedent`
				This is **Container** widget. 
				This widget motivated by Container in Flutter.

				<iframe width="560" height="315" src="https://www.youtube.com/embed/c1xLMaTUWCY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

				See: https://api.flutter.dev/flutter/widgets/Container-class.html

				## Props
				### width
				**Value: number | undefined**

				### height
				**Value: number | undefined**

				### color
				**Value: string** (default: **transparent**)

				This define background color of the container.

				### margin
				**Value: EdgeInsets** (default: **EdgeInsets.all(0)**)

				### padding
				**Value: EdgeInsets** (default: **EdgeInsets.all(0)**)

				### Alignment
				**Value: Alignment | undefined**

				### child
				**Value: Widget | undefined**
				`
			}
		}
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const Case1Code = dedent`
	Container({
		color: 'lightblue'
	})
`;
export const Case1: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue'
		}),
		code: ImportWidgetCode + Case1Code
	}
};
const Case2Code = dedent`
	Container({
		color: 'lightblue',
		child: Text('text', { style: new TextStyle({ fontSize: 30 }) })
	})
`;
export const Case2: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Text('text', { style: new TextStyle({ fontSize: 30 }) })
		}),
		code: ImportWidgetCode + Case2Code
	}
};
const Case3Code = dedent`
	Container({
		color: 'lightblue',
		width: 300,
		height: 300,
		padding: EdgeInsets.all(10),
		child: Container({
			color: 'green',
			child: Text('child in blue container')
		})
	})
`;
export const Case3: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			padding: EdgeInsets.all(10),
			child: Container({
				color: 'green',
				child: Text('child in blue container')
			})
		}),

		code: ImportWidgetCode + Case3Code
	}
};
const Case4Code = dedent`
	Container({
		color: 'lightblue',
		width: 300,
		height: 300,
		padding: EdgeInsets.all(10),
		alignment: Alignment.center,
		child: Container({
			color: 'green',
			child: Text('child')
		})
	})
`;
export const Case4: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			padding: EdgeInsets.all(10),
			alignment: Alignment.center,
			child: Container({
				color: 'green',
				child: Text('child')
			})
		}),
		code: ImportWidgetCode + Case4Code
	}
};

const WithTransformCode = dedent`
	Container({
		color: 'lightblue',
		width: 300,
		height: 300,
		transform: Matrix4.translationValues(10, 10, 0)
	})
`;
export const WithTransform: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			transform: Matrix4.translationValues(10, 10, 0)
		}),
		code: ImportWidgetCode + WithTransformCode
	}
};

const WithClipDecorationCode = dedent`
		Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			clipped: true,
			decoration: new BoxDecoration({
				borderRadius: BorderRadius.all(Radius.circular(20))
			}),
			alignment: Alignment.topLeft,
			child: Container({
				width: 100,
				height: 100,
				color: 'red'
			})
		}),
`;
export const WithClipDecoration: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		widget: Container({
			width: 300,
			height: 300,
			clipped: true,
			decoration: new BoxDecoration({
				borderRadius: BorderRadius.all(Radius.circular(20)),
				color: 'lightblue'
			}),
			alignment: Alignment.topLeft,
			child: Container({
				width: 100,
				height: 100,
				color: 'red'
			})
		}),
		code: ImportWidgetCode + WithClipDecorationCode
	}
};

export const ColoredBoxOnCanvas: Story = {
	args: {
		ssrSize: { width: 600, height: 300 },
		width: '600px',
		height: '300px',
		renderer: 'canvas',
		widget: Container({
			color: 'lightblue'
		}),
		code: ImportWidgetCode + Case1Code
	}
};
