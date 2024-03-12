import {
	Alignment,
	Column,
	Container,
	Draggable,
	GestureDetector,
	Text,
	TextStyle
} from '@meursyphus/flitter';
import { dedent } from 'ts-dedent';

const Basic = {
	widget: Column({
		children: [
			Draggable({
				child: Container({
					width: 50,
					height: 50,
					color: 'red'
				})
			}),
			Draggable({
				child: Container({
					width: 50,
					height: 50,
					color: 'blue'
				})
			})
		]
	}),
	code: dedent`
	`
};

export default Basic;
