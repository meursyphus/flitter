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
import { dedent } from 'ts-dedent';

const meta = {
	title: 'Widget/DecoratedBox/canvas',
	component: Widget,
	parameters: {
		layout: 'fullscreen'
	}
} satisfies Meta<Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

const BasicCode = dedent`
		Center({
			child: DecoratedBox({
				decoration: new BoxDecoration({ color: 'red' }),
				child: SizedBox({
					width: 200,
					height: 200
				})
			})
		}),
`;
export const Basic: Story = {
	args: {
		renderer: 'canvas',
		ssrSize: { width: 400, height: 400 },
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
		}),
		code:
			dedent`import { SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
			BasicCode
	}
};

// const CircleCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({ border: Border.all({}), shape: 'circle' }),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const Circle: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					Container({
// 						decoration: new BoxDecoration({
// 							color: 'red',
// 							shape: 'circle'
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			CircleCode
// 	}
// };

// const InnerBorderCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({ width: 20, color: 'green' })
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const InnerBorder: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({ width: 20, color: 'green' })
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, Border, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			InnerBorderCode
// 	}
// };

// const OuterBorderCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({
// 								width: 20,
// 								color: 'green',
// 								strokeAlign: BorderSide.strokeAlignOutside
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const OuterBorder: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({
// 								width: 20,
// 								color: 'green',
// 								strokeAlign: BorderSide.strokeAlignOutside
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, Border, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			OuterBorderCode
// 	}
// };

// const WithBorderRadiusCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({
// 								width: 20
// 							}),
// 							borderRadius: BorderRadius.all(Radius.circular(10))
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const WithBorderRadius: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: Border.all({
// 								width: 20
// 							}),
// 							borderRadius: BorderRadius.all(Radius.circular(10))
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, Border, BorderRadius, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			WithBorderRadiusCode
// 	}
// };

// const BorderTopCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: new Border({
// 								top: new BorderSide({ width: 10, color: 'black' })
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const BorderTop: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: new Border({
// 								top: new BorderSide({ width: 10, color: 'black' })
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, Border, BorderSide SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			BorderTopCode
// 	}
// };

// const UnUniformedBorderCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: new Border({
// 								top: new BorderSide({ width: 10, color: 'blue' }),
// 								left: new BorderSide({ width: 5, color: 'green' }),
// 								right: new BorderSide({ width: 20, color: 'red' }),
// 								bottom: new BorderSide({ width: 15, color: 'purple' })
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const UnUniformBorder: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							border: new Border({
// 								top: new BorderSide({ width: 10, color: 'blue' }),
// 								left: new BorderSide({ width: 5, color: 'green' }),
// 								right: new BorderSide({ width: 20, color: 'red' }),
// 								bottom: new BorderSide({ width: 15, color: 'purple' })
// 							})
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Border, Stack, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			UnUniformedBorderCode
// 	}
// };

// const WithBoxShadowCode = dedent`
// 		Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							color: 'gray',
// 							boxShadow: [
// 								new BoxShadow({
// 									blurRadius: 10,
// 									offset: new Offset({ x: 10, y: 10 })
// 								}),
// 								new BoxShadow({
// 									blurRadius: 10,
// 									color: 'blue',
// 									offset: new Offset({ x: -10, y: -10 })
// 								})
// 							]
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// `;
// export const WithBoxShadow: Story = {
// 	args: {
// 		renderer: 'canvas',
// 		ssrSize: { width: 400, height: 400 },
// 		width: '400px',
// 		height: '400px',
// 		widget: Center({
// 			child: Stack({
// 				clipped: false,
// 				children: [
// 					Container({
// 						width: 200,
// 						height: 200,
// 						color: 'white'
// 					}),
// 					DecoratedBox({
// 						decoration: new BoxDecoration({
// 							color: 'gray',
// 							boxShadow: [
// 								new BoxShadow({
// 									blurRadius: 10,
// 									offset: new Offset({ x: 10, y: 10 })
// 								}),
// 								new BoxShadow({
// 									blurRadius: 10,
// 									color: 'blue',
// 									offset: new Offset({ x: -10, y: -10 })
// 								})
// 							]
// 						}),
// 						child: SizedBox({
// 							width: 200,
// 							height: 200
// 						})
// 					})
// 				]
// 			})
// 		}),
// 		code:
// 			dedent`import { Stack, BoxShadow, Offset, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n` +
// 			WithBoxShadowCode
// 	}
// };
