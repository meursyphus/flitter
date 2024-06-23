import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Text,
	Column,
	Container,
	Flexible,
	VerticalDirection,
	Alignment,
	TextStyle,
	MainAxisAlignment,
	CrossAxisAlignment
} from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

const meta = {
	title: 'Widget/Column',
	component: Widget,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: dedent`
				This is **Column** widget. 
				This widget motivated by Column in Flutter.
				
				>To cause a child to expand to fill the available vertical space, wrap the child in an Expanded widget.
				The Column widget does not scroll (and in general it is considered an error to have more children in a Column than will fit in the available room). If you have a line of widgets and want them to be able to scroll if there is insufficient room, consider using a ListView.
				For a horizontal variant, see Column.
				If you only have one child, then consider using Align or Center to position the child.

				See: https://api.flutter.dev/flutter/widgets/Column-class.html

				## Props
				### mainAxisAlignment 
				**Value: center | start | end | spaceBetween | spaceEven | spaceAround** (default: **start**)

				This prop defines the **vertical** display of its children.

				### crossAxisAlignment
				**Value: stretch | start | center | end** (default: **center**)

				This prop defines the **horizontal** display of its children.

				### children
				**value**: **Widget[]**
				`
			}
		}
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Case1: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 100,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case2: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.end,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const MainAxisAlignment_center: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.center,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case3: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case4: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceEvenly,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case5: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceAround,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case6: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				crossAxisAlignment: CrossAxisAlignment.center,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 100,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case7: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				crossAxisAlignment: CrossAxisAlignment.start,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 100,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case8: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				crossAxisAlignment: CrossAxisAlignment.end,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 100,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case9: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				crossAxisAlignment: CrossAxisAlignment.stretch,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 100,
						height: 50,
						color: 'blue'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				]
			})
		})
	}
};

export const Case10: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				children: [
					Flexible({
						child: Container({
							width: 50,
							height: 50,
							color: 'red'
						})
					}),
					Flexible({
						fit: 'tight',
						child: Container({
							width: 50,
							height: 50,
							color: 'blue'
						})
					})
				]
			})
		})
	}
};

export const VerticalDirection_up: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Column({
				verticalDirection: VerticalDirection.up,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red',
						alignment: Alignment.center,
						child: Text('1', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					}),
					Container({
						width: 50,
						height: 50,
						color: 'blue',
						alignment: Alignment.center,
						child: Text('2', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					}),
					Container({
						width: 50,
						height: 50,
						color: 'green',
						alignment: Alignment.center,
						child: Text('3', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
					})
				]
			})
		})
	}
};
