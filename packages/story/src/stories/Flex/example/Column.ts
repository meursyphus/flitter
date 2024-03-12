import { dedent } from 'ts-dedent';
import { Container, Flex, Axis } from '@meursyphus/flitter';
export default {
	code: dedent`
  import { Flex, Container, Axis } from '@meursyphus/flitter'

  Container({
		color: 'lightblue',
		child: Flex({
			direction: Axis.vertical,
			children: [
				Container({
					width: 50,
					height: 50,
					color: 'red'
				}),
				Container({
					width: 50,
					height: 100,
					color: 'blue'
				}),
				Container({
					width: 50,
					height: 50,
					color: 'green'
				})
			]
		})
  `,
	widget: Container({
		color: 'lightblue',
		child: Flex({
			direction: Axis.vertical,
			children: [
				Container({
					width: 50,
					height: 50,
					color: 'red'
				}),
				Container({
					width: 50,
					height: 100,
					color: 'blue'
				}),
				Container({
					width: 50,
					height: 50,
					color: 'green'
				})
			]
		})
	})
};
