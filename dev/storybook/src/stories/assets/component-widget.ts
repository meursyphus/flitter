import { dedent } from 'ts-dedent';

export default dedent`
 import { BuildContext } from "flitterjs/src/widget/ComponentWidget"
 import {
  ComponentWidget,
  Padding,
  Row,
  Text,
  Widget,
 } from "flitterjs"

class YoutComponent extends ComponentWidget {

  build(context: BuildContext): Widget {
    return Row({
      mainAxisAlignment: "spaceEvenly"
      children: [
          Padding({
          padding: margin,
          child: Text('It is Component Widget example'),
        }),
      ],
    })
  }
}
`;
