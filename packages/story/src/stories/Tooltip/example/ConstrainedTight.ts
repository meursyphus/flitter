import {
	Container,
	Text,
	Center,
	Tooltip,
	EdgeInsets,
	BoxDecoration,
	TextStyle,
	BorderRadius,
	Radius,
	Alignment
} from '@meursyphus/flitter';

const BasicStory = {
	widget: Center({
		child: Tooltip({
			position: 'centerRight',
			child: Container({
				width: 200,
				height: 200,
				color: 'orange',
				alignment: Alignment.center,
				child: Text('orange box')
			}),
			tooltip: Container({
				child: Container({
					padding: EdgeInsets.all(4),
					margin: EdgeInsets.only({ left: 5 }),
					decoration: new BoxDecoration({
						color: 'black',
						borderRadius: BorderRadius.all(Radius.circular(4))
					}),
					child: Text('tooltip', { style: new TextStyle({ color: 'white' }) })
				})
			})
		})
	})
};

export default BasicStory;
