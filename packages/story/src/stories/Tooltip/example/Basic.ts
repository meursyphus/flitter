import { dedent } from 'ts-dedent';
import {
	Container,
	Text,
	Center,
	Tooltip,
	EdgeInsets,
	BoxDecoration,
	TextStyle,
	BorderRadius,
	Radius
} from '@meursyphus/flitter';

const BasicStory = {
	widget: Center({
		child: Tooltip({
			child: Text('hover me'),
			tooltip: Container({
				child: Container({
					padding: EdgeInsets.all(4),
					decoration: new BoxDecoration({
						color: 'black',
						borderRadius: BorderRadius.all(Radius.circular(4))
					}),
					child: Text('tooltip', { style: new TextStyle({ color: 'white' }) })
				})
			})
		})
	}),
	code: dedent`
	Center({
		child: Tooltip({
			child: Text('hover me'),
			tooltip: Container({
				child: Container({
					padding: EdgeInsets.all(4),
					decoration: new BoxDecoration({
						color: 'black',
						borderRadius: BorderRadius.all(Radius.circular(4))
					}),
					child: Text('tooltip', { style: new TextStyle({ color: 'white' }) })
				})
			})
		})
	}),
	`
};

export default BasicStory;
