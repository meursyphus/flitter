import { dedent } from 'ts-dedent';

export default dedent`
import { Container, Alignment } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-svelte';

const App = () => {

  return(
    <Widget
      width="600px"
      height="300px"
      widget={Container({
        alignment: Alignment.center,
        color: 'lightblue',
        child: Text("Hello, FlutterJS!", style: TextStyle({ fontSize: 30, weight: 'bold' })
      })}
    />
  )
}
`;
