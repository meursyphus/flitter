import { Column, Container, Draggable } from 'flitterjs';

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
	})
};

export default Basic;
