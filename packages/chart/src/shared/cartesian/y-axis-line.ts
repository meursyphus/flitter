import { Container, type Widget } from 'flitter-core';

export function YAxisLine(): Widget {
	return Container({
		color: 'black',
		width: 1,
		height: Infinity
	});
}
