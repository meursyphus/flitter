import{W as x}from"./Widget-B6WpeV_a.js";import{d as t}from"./index-DrFu-skq.js";import{c as e,L as c,C as m}from"./Widget-Dxvrat1N.js";const p=t`import { Container, ConstraintsTransformBox, LimitedBox } from '@meursyphus/flitter';
\n\n`,l={title:"Widget/LimitedBox",component:x},g=t`
    ConstraintsTransformBox({
        constraintsTransform: ConstraintsTransformBox.unconstrained,
        child: LimitedBox({
            maxHeight: 200,
            maxWidth: 200,
            child: Container({
                width: Infinity,
                height: Infinity,
                color: 'purple'
            })
        })
    })
`,i={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:p+g,widget:e({constraintsTransform:e.unconstrained,child:c({maxHeight:200,maxWidth:200,child:m({width:1/0,height:1/0,color:"purple"})})})}},n={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:p+g,widget:c({maxHeight:200,maxWidth:200,child:m({width:1/0,height:1/0,color:"purple"})}),description:t`
            LimitedBox doesn't work within bounded constraints.
        `}};var o,r,s;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: ConstraintsTransformBox({
      constraintsTransform: ConstraintsTransformBox.unconstrained,
      child: LimitedBox({
        maxHeight: 200,
        maxWidth: 200,
        child: Container({
          width: Infinity,
          height: Infinity,
          color: 'purple'
        })
      })
    })
  }
}`,...(s=(r=i.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var d,a,h;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: LimitedBox({
      maxHeight: 200,
      maxWidth: 200,
      child: Container({
        width: Infinity,
        height: Infinity,
        color: 'purple'
      })
    }),
    description: dedent\`
            LimitedBox doesn't work within bounded constraints.
        \`
  }
}`,...(h=(a=n.parameters)==null?void 0:a.docs)==null?void 0:h.source}}};const f=["Basic","WithinBoundedConstraints"],W=Object.freeze(Object.defineProperty({__proto__:null,Basic:i,WithinBoundedConstraints:n,__namedExportsOrder:f,default:l},Symbol.toStringTag,{value:"Module"}));export{i as B,W as S,n as W};
