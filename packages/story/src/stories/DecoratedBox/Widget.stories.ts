import type { Meta, StoryObj } from '@storybook/svelte';
import Widget from '../../Widget.svelte';
import {
	Container,
	BorderRadius,
	Radius,
	Center,
	DecoratedBox,
	BoxDecoration,
	SizedBox,
	Border,
	Stack,
	BoxShadow,
	Offset,
	BorderSide
} from '@meursyphus/flitter';

const meta = {
	title: 'Widget/DecoratedBox',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: DecoratedBox({
				decoration: new BoxDecoration({ color: 'red' }),
				child: SizedBox({
					width: 200,
					height: 200
				})
			})
		})
	}
};

export const Circle: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					Container({
						decoration: new BoxDecoration({
							color: 'red',
							shape: 'circle'
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const InnerBorder: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							border: Border.all({ width: 20, color: 'green' })
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const OuterBorder: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							border: Border.all({
								width: 20,
								color: 'green',
								strokeAlign: BorderSide.strokeAlignOutside
							})
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const WithBorderRadius: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							border: Border.all({
								width: 20
							}),
							borderRadius: BorderRadius.all(Radius.circular(10))
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const BorderTop: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							border: new Border({
								top: new BorderSide({ width: 10, color: 'black' })
							})
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const UnUniformBorder: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							border: new Border({
								top: new BorderSide({ width: 10, color: 'blue' }),
								left: new BorderSide({ width: 5, color: 'green' }),
								right: new BorderSide({ width: 20, color: 'red' }),
								bottom: new BorderSide({ width: 15, color: 'purple' })
							})
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};

export const WithBoxShadow: Story = {
	args: {
		width: '400px',
		height: '400px',
		widget: Center({
			child: Stack({
				clipped: false,
				children: [
					Container({
						width: 200,
						height: 200,
						color: 'white'
					}),
					DecoratedBox({
						decoration: new BoxDecoration({
							color: 'gray',
							boxShadow: [
								new BoxShadow({
									blurRadius: 10,
									offset: new Offset({ x: 10, y: 10 })
								}),
								new BoxShadow({
									blurRadius: 10,
									color: 'blue',
									offset: new Offset({ x: -10, y: -10 })
								})
							]
						}),
						child: SizedBox({
							width: 200,
							height: 200
						})
					})
				]
			})
		})
	}
};
