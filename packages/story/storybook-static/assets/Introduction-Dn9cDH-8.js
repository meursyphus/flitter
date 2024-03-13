import{j as e}from"./jsx-runtime-DXsa7ODA.js";import{u as d}from"./index-afety-31.js";import{M as a,f as r}from"./index-U0n-umKR.js";import"./chunk-HLWAVYOI-BSW3NsLg.js";import{d as n}from"./index-DrFu-skq.js";import"./iframe-dVscGK44.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Bw8VTzHM.js";import"./index-BzJiga1e.js";const c=""+new URL("love_flutter-Dbp4e7mU.gif",import.meta.url).href,u=""+new URL("bubble-pOlbliNh.gif",import.meta.url).href,m=""+new URL("diagram-DxvVvw-u.gif",import.meta.url).href;var s=Object.freeze,h=Object.defineProperty,p=(i,t)=>s(h(i,"raw",{value:s(t||i.slice())})),o;const g=n(o||(o=p([`
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
 <\/script>

<svg id="mySvg" style="width: 600px; height: 300px;" />
`]))),f=n`
import { Container, Alignment } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-react';

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
`,x=n`
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
`,j=n`
 import { BuildContext } from "@meursyphus/flitter/src/widget/ComponentWidget"
 import {
  ComponentWidget,
  Padding,
  Row,
  Text,
  Widget,
 } from "@meursyphus/flitter"

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
`,y=n`
import SingleChildRenderObject from '../../renderobject/SingleChildRenderObject';
import { Size, Constraint } from '../../type';
import type { PaintContext } from '../../utils/type';
import SingleChildRenderObjectWidget from '../../widget/SingleChildRenderObjectWidget';
import type Widget from '../../widget/Widget';

class CustomWidget extends SingleChildRenderObjectWidget {
  createRenderObject(): RenderCustom {
    return new RenderFlexible({ flex: this.flex, fit: this.fit });
  }

  updateRenderObject(renderObject: RenderCustom): void {}
}

export class RenderFlexible extends SingleChildRenderObject {
  constructor({}: {}) {
    super({ isPainter: false });
  }

  protected preformLayout(): void {
    // you must call child's layout function and determine size of widget.
    let size = Size.zero();
    if (this.child != null) {
      this.child.layout(childConstraint);
      size = this.child.size;
    }
    this.size = this.constraint.constrain(size);
  }
}
`;function l(i){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",p:"p",pre:"pre",...d(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Introduction"}),`
`,e.jsx(t.h1,{id:"flutterjs",children:"Flutterjs"}),`
`,e.jsx(t.p,{children:`Flutterjs is a framework that deals with SVG.
Like React, it uses VDOM to manage state and optimize rendering,
and because the library calculates the layout directly,
it is much easier to visualize data than using D3.
This provides a high level of control and flexibility for data visualization.`}),`
`,e.jsx(t.p,{children:"(FlutterJs is a library inspired by Flutter, a cross-platform framework commonly used for mobile app development.)"}),`
`,e.jsx(t.p,{children:"Here is an some example about what you can do with Flutterjs."}),`
`,e.jsxs("div",{style:{display:"flex"},children:[e.jsx("img",{style:{width:"50%"},src:u}),e.jsx("img",{style:{width:"50%"},src:m})]}),`
`,e.jsx(t.h2,{id:"examples",children:"Examples"}),`
`,e.jsx(t.p,{children:"I do my best to make Flutterjs look like Flutter itself. See this."}),`
`,e.jsx("img",{src:c}),`
`,e.jsx(t.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(t.h3,{id:"pure-javascript",children:"Pure javascript"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{children:` npm i @meursyphus/flitter
`})}),`
`,e.jsx(r,{language:"js",dark:!0,format:!1,code:g}),`
`,e.jsx(t.h3,{id:"react",children:"React"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{children:` npm i @meursyphus/flitter @meursyphus/flitter-react
`})}),`
`,e.jsx(r,{language:"js",dark:!0,format:!1,code:f}),`
`,e.jsx(t.h3,{id:"svelte",children:"Svelte"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{children:` npm i @meursyphus/flitter @meursyphus/flitter-svelte
`})}),`
`,e.jsx(r,{language:"js",dark:!0,format:!1,code:x}),`
`,e.jsx(t.h3,{id:"see-result",children:"See Result"}),`
`,e.jsx("div",{style:{width:"600px",height:"300px",backgroundColor:"lightblue",display:"flex",justifyContent:"center",alignItems:"center"},children:e.jsx("div",{style:{fontSize:"30px",fontWeight:"bold"},children:"Hello, FlutterJS!"})}),`
`,e.jsx(t.h2,{id:"description",children:"Description"}),`
`,e.jsx(t.p,{children:"This framework use svg element unlike Flutter Web so I don't need to implement its own hit testing algorithm."}),`
`,e.jsx(t.p,{children:"By using svg, It can be rendered by Server side. (Ssr is possible!)"}),`
`,e.jsx(t.p,{children:"I try to provide all important widget in Flutter. If there is no widget you want, you can create widget by yourself through RenderObjectWidget."}),`
`,e.jsx(r,{language:"js",dark:!0,format:!1,code:y}),`
`,e.jsx(t.p,{children:"And you can also create your own component through ComponentWidget."}),`
`,e.jsx(r,{language:"js",dark:!0,format:!1,code:j}),`
`,e.jsx(t.h2,{id:"github",children:"Github"}),`
`,e.jsx(t.p,{children:e.jsx(t.a,{href:"https://github.com/moonmoonbrothers/uglychart",rel:"nofollow",children:"https://github.com/moonmoonbrothers/uglychart"})})]})}function k(i={}){const{wrapper:t}={...d(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(l,{...i})}):l(i)}export{k as default};
