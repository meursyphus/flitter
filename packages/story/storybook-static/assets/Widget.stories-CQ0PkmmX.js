import{W as r}from"./Widget-B6WpeV_a.js";import{d as o}from"./index-DrFu-skq.js";import{a as s,b as a,C as d}from"./Widget-Dxvrat1N.js";const h=o`import { Container, ConstrainedBox, Constraints } from '@meursyphus/flitter';
\n\n`,c={title:"Widget/ConstrainedBox",component:r},g=o`
    ConstrainedBox({
        constraints: new Constraints({ maxWidth: 200, maxHeight: 200 }),
        child: Container({
            width: Infinity,
            height: Infinity,
            color: 'green'
        })
    })
`,t={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:h+g,widget:s({constraints:new a({maxWidth:200,maxHeight:200}),child:d({width:1/0,height:1/0,color:"green"})})}};var n,i,e;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: ConstrainedBox({
      constraints: new Constraints({
        maxWidth: 200,
        maxHeight: 200
      }),
      child: Container({
        width: Infinity,
        height: Infinity,
        color: 'green'
      })
    })
  }
}`,...(e=(i=t.parameters)==null?void 0:i.docs)==null?void 0:e.source}}};const m=["Basic"],f=Object.freeze(Object.defineProperty({__proto__:null,Basic:t,__namedExportsOrder:m,default:c},Symbol.toStringTag,{value:"Module"}));export{t as B,f as S};
