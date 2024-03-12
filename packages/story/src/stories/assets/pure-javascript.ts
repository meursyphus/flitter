import { dedent } from 'ts-dedent';

export default dedent`
 <script>
  import { Widget, Container } from '@meursyphus/flitter';

  const svgElement = document.getElementById('mySvg');
  const runner = new AppRunner({
  // Size is automatically calculated by svgElement size.
  view: svgElement,
  /*
    this is not required if javascript is running on only brower.
    If server sider redering is needed, you should configure below props.
    Third party libraries may be required for window, document, and svgElement running on server side.
    window: window,
    document: document,
    ssrSize: {width: 600, height: 300},
  */
  });
  const widget = Container({
    color: 'lightblue',
  })
  runner.runApp(widget);
 </script>

<svg id="mySvg" style="width: 600px; height: 300px;" />
`;
