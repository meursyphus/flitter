import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FlitterWidget from '@flitterjs/react';
import {
	Image,
	Colors,
	ColoredBox,
	Center,
	ObjectFit,
	ObjectPosition,
	type Widget
} from 'flitter-core';
import profile from './profile.png';

const createImageCase = (
	width?: number,
	height?: number,
	objectFit: ObjectFit = ObjectFit.none
) => {
	return Center({
		child: ColoredBox({
			color: Colors.white,
			child: Image({
				src: profile,
				width,
				height,
				objectFit,
				objectPosition: ObjectPosition.center
			})
		})
	});
};

const objectFits: ObjectFit[] = [
	ObjectFit.contain,
	ObjectFit.cover,
	ObjectFit.fill,
	ObjectFit.none,
	ObjectFit.scaleDown
];
const sizes = [250, 500, 750];

const cases: Widget[] = [
	createImageCase(),
	...sizes.flatMap((width) => objectFits.map((fit) => createImageCase(width, undefined, fit))),
	...sizes.flatMap((height) => objectFits.map((fit) => createImageCase(undefined, height, fit))),
	...sizes.flatMap((size) => objectFits.map((fit) => createImageCase(size, size, fit))),
	...[
		[250, 500],
		[250, 750],
		[500, 250],
		[500, 750],
		[750, 250],
		[750, 500]
	].flatMap(([width, height]) => objectFits.map((fit) => createImageCase(width, height, fit)))
];

const ImageStory = () => {
	return (
		<div>
			{cases.map((item, i) => (
				<div key={i} style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
					<div>
						<h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>SVG</h4>
						<FlitterWidget
							width="100%"
							height="100vh"
							renderer="svg"
							widget={item}
						/>
					</div>
					<div>
						<h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Canvas</h4>
						<FlitterWidget
							width="100%"
							height="100vh"
							renderer="canvas"
							widget={item}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

const meta: Meta<typeof ImageStory> = {
	title: 'Media/Image',
	component: ImageStory,
	parameters: {
		layout: 'fullscreen',
		chromatic: { disableSnapshot: true }
	}
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageDemo: Story = {};
