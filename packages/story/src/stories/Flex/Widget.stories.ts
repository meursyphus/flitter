import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Container,
	Flex,
	Axis,
	VerticalDirection,
	MainAxisSize,
	MainAxisAlignment,
	Text,
	Alignment,
	Flexible,
	TextStyle,
	CrossAxisAlignment
} from '@meursyphus/flitter';
import * as Examples from './example/index.js';

const meta = {
	title: 'Widget/Flex',
	component: Widget,
	args: {
		width: '600px',
		height: '300px'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Flex({
				direction: Axis.horizontal,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
					}),
					Container({
						width: 50,
						height: 100,
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

export const Column: Story = {
	args: Examples.Column
};

export const MainAxisSize_min: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			child: Flex({
				direction: Axis.horizontal,
				mainAxisSize: MainAxisSize.min,
				children: [
					Flexible({
						child: Container({
							width: 50,
							height: 50,
							color: 'red'
						})
					}),
					Flexible({
						child: Container({
							width: 50,
							height: 50,
							color: 'green'
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
			child: Flex({
				direction: Axis.horizontal,
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
						color: 'green',
						alignment: Alignment.center,
						child: Text('2', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
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
			child: Flex({
				direction: Axis.horizontal,
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
						color: 'green'
					})
				]
			})
		})
	}
};

export const WithConstraintsTight: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightblue',
			width: 300,
			height: 300,
			child: Flex({
				direction: Axis.horizontal,
				mainAxisAlignment: MainAxisAlignment.spaceBetween,
				mainAxisSize: MainAxisSize.min,
				crossAxisAlignment: CrossAxisAlignment.end,
				children: [
					Container({
						width: 50,
						height: 50,
						color: 'red'
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
