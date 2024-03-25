import {
	Container,
	EdgeInsets,
	Text,
	TextStyle,
	Row,
	MainAxisSize,
	CustomPaint,
	Path,
	Size,
	Column,
	SizedBox,
	CrossAxisAlignment,
	Padding,
	ZIndex
} from '@meursyphus/flitter';

function NoteTooltip({
	name,
	type,
	note,
	defaultValue
}: {
	name: string;
	type: string;
	note: string;
	defaultValue?: string | number;
}) {
	const tooltip = Padding({
		padding: EdgeInsets.only({ top: -24 }),
		child: Row({
			mainAxisSize: MainAxisSize.min,
			crossAxisAlignment: CrossAxisAlignment.start,
			children: [
				Padding({
					padding: EdgeInsets.only({ top: 10 }),
					child: CustomPaint({
						size: new Size({ width: 8, height: 10 }),
						painter: {
							createDefaultSvgEl(context) {
								return { path: context.createSvgEl('path') };
							},
							shouldRepaint() {
								return false;
							},
							paint({ path }, { width, height }) {
								const p = new Path();
								p.moveTo({ x: 0, y: height / 2 })
									.lineTo({ x: width, y: height })
									.lineTo({ x: width, y: 0 })
									.close();

								path.setAttribute('fill', 'black');
								path.setAttribute('d', p.getD());
							}
						}
					})
				}),

				Container({
					color: 'black',
					padding: EdgeInsets.all(8),
					width: 200,
					child: Column({
						mainAxisSize: MainAxisSize.min,
						crossAxisAlignment: CrossAxisAlignment.start,
						children: [
							Row({
								children: [
									Text(name, {
										style: new TextStyle({
											fontSize: 12,
											fontWeight: '800',
											fontFamily: 'Noto Sans KR, sans-serif',
											color: 'white'
										})
									}),
									SizedBox({ width: 4 }),
									Text(type, {
										style: new TextStyle({
											fontSize: 12,
											fontWeight: '600',
											fontFamily: 'Noto Sans KR, sans-serif',
											color: 'orange'
										})
									})
								]
							}),
							SizedBox({ height: 8 }),
							Container({ width: Infinity, height: 2, color: 'white' }),
							SizedBox({ height: 8 }),
							Text(note, {
								style: new TextStyle({
									fontSize: 12,
									fontWeight: '400',
									fontFamily: 'Noto Sans KR, sans-serif',
									color: 'white'
								})
							}),
							defaultValue != null
								? Padding({
										padding: EdgeInsets.only({ top: 2 }),
										child: Row({
											children: [
												Text('Default: ', {
													style: new TextStyle({
														fontSize: 12,
														fontWeight: '800',
														fontFamily: 'Noto Sans KR, sans-serif',
														color: 'red'
													})
												}),
												Text(`${defaultValue}`, {
													style: new TextStyle({
														fontSize: 12,
														fontWeight: '400',
														fontFamily: 'Noto Sans KR, sans-serif',
														color: 'white'
													})
												})
											]
										})
									})
								: SizedBox.shrink()
						]
					})
				})
			]
		})
	});

	return ZIndex({
		zIndex: Infinity,
		child: tooltip
	});
}

export default NoteTooltip;
