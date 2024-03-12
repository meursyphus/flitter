import{W as e}from"./Widget-B6WpeV_a.js";import{d as r}from"./index-DrFu-skq.js";import{a,b as c,c as d,d as h,C as m}from"./Widget-Dxvrat1N.js";const g=r`import {
    Container,
    ConstraintsTransformBox,
    Constraints,
    ConstrainedBox,
    Alignment
} from '@meursyphus/flitter'
\n\n`,l={title:"Widget/ConstraintsTransformBox",component:e},p=r`
    ConstrainedBox({
        constraints: Constraints.tightFor({ width: 400, height: 400 }),
        child: ConstraintsTransformBox({
            constraintsTransform: (constraints) => constraints.loosen(),
            child: Container({
                color: 'blue',
                width: 200,
                height: 200
            })
        })
    })
`,t={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:g+p,widget:a({constraints:c.tightFor({width:400,height:400}),child:d({alignment:h.center,constraintsTransform:i=>i.loosen(),child:m({color:"blue",width:200,height:200})})})}};var n,o,s;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: ConstrainedBox({
      constraints: Constraints.tightFor({
        width: 400,
        height: 400
      }),
      child: ConstraintsTransformBox({
        alignment: Alignment.center,
        constraintsTransform: constraints => constraints.loosen(),
        child: Container({
          color: 'blue',
          width: 200,
          height: 200
        })
      })
    })
  }
}`,...(s=(o=t.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const C=["Basic"],u=Object.freeze(Object.defineProperty({__proto__:null,Basic:t,__namedExportsOrder:C,default:l},Symbol.toStringTag,{value:"Module"}));export{t as B,u as S};
