import {
	EdgeInsets,
	Text,
	TextStyle,
	Padding,
	Row,
	SizedBox,
	Spacer,
	Container
} from '@meursyphus/flitter';
import type { Field as FieldProps } from '../../type';
import PK from './PK';
import Note from './Note';
import NotNull from './NotNull';

function FieldContent({ field, active }: { field: FieldProps; active: boolean }) {
	const {
		name,
		pk,
		type: { typeName },
		notNull,
		note
	} = field;

	return Container({
		key: field.id,
		color: active ? '#4b4c53' : '#37383f',
		padding: EdgeInsets.symmetric({ vertical: 8, horizontal: 8 }),
		child: Row({
			children: [
				Text(name, {
					style: new TextStyle({
						fontSize: 16,
						fontWeight: pk ? '800' : '400',
						color: 'lightgrey',
						fontFamily: 'Noto Sans KR, sans-serif'
					})
				}),
				pk
					? Padding({
							padding: EdgeInsets.only({ left: 2 }),
							child: PK()
						})
					: SizedBox.shrink(),
				note
					? Padding({
							padding: EdgeInsets.only({ left: 2 }),
							child: Note()
						})
					: SizedBox.shrink(),

				SizedBox({ width: 4 }),
				Spacer(),
				Text(typeName, {
					style: new TextStyle({
						fontSize: 14,
						fontWeight: pk ? '800' : '400',
						fontFamily: 'Noto Sans KR, sans-serif',
						color: '#a9a9a9'
					})
				}),
				notNull
					? Padding({
							padding: EdgeInsets.only({ left: 2 }),
							child: NotNull()
						})
					: SizedBox.shrink()
			]
		})
	});
}

export default FieldContent;
