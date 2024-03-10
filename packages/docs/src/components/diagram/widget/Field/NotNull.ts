import {
	BorderRadius,
	BoxDecoration,
	Container,
	EdgeInsets,
	Text,
	TextStyle
} from '@moonmoonbrothers/flutterjs';

function NotNull() {
	return Container({
		padding: EdgeInsets.symmetric({ horizontal: 2 }),
		decoration: new BoxDecoration({
			borderRadius: BorderRadius.circular(2),
			color: 'lightgrey'
		}),
		child: Text('NN', {
			style: new TextStyle({
				fontSize: 12,
				fontWeight: '500',
				color: 'grey',
				height: 1.2,
				fontFamily: 'Noto Sans KR, sans-serif'
			})
		})
	});
}

export default NotNull;
