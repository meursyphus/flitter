import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import { Container, Alignment, Stack, Positioned, StackFit } from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

const meta = {
	title: 'Widget/Stack',
	component: Widget,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: dedent`
					This is **Stack** widget. 
					This widget motivated by Stack in Flutter.

					<iframe width="560" height="315" src="https://www.youtube.com/embed/liEGSeD3Zt8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

					See: https://api.flutter.dev/flutter/widgets/Stack-class.html

					### alignment

					**Value: Alignment**(default: **Alignment.topLeft**)

					### clipped

					**Value: boolean**(default: **true**)

					### sizing

					**Value: StackFit**(default: **StackFit.loose**)

					### children

					**Value: Widget[]**
					`
			}
		}
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightgrey',
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			child: Stack({
				children: [
					Container({
						width: 100,
						height: 100,
						color: 'green'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'red'
					})
				]
			})
		})
	}
};

export const HasPositioned: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightgrey',
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			child: Stack({
				children: [
					Container({
						width: 100,
						height: 100,
						color: 'green'
					}),
					Positioned({
						bottom: 0,
						right: 0,
						child: Container({
							width: 50,
							height: 50,
							color: 'red'
						})
					})
				]
			})
		})
	}
};

export const WithoutNonPositioned: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightgrey',
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			child: Stack({
				children: [
					Positioned({
						top: 0,
						left: 0,
						child: Container({
							width: 100,
							height: 100,
							color: 'green'
						})
					}),
					Positioned({
						top: 0,
						left: 0,
						child: Container({
							width: 50,
							height: 50,
							color: 'red'
						})
					})
				]
			})
		})
	}
};

export const FitExpand: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightgrey',
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			child: Stack({
				fit: StackFit.expand,
				children: [
					Container({
						width: 0,
						height: 0,
						color: 'green'
					})
				]
			})
		})
	}
};

export const AlignmentCenter: Story = {
	args: {
		width: '600px',
		height: '300px',
		widget: Container({
			color: 'lightgrey',
			width: Infinity,
			height: Infinity,
			alignment: Alignment.center,
			child: Stack({
				alignment: Alignment.center,
				children: [
					Container({
						width: 100,
						height: 100,
						color: 'green'
					}),
					Container({
						width: 50,
						height: 50,
						color: 'red'
					})
				]
			})
		})
	}
};
