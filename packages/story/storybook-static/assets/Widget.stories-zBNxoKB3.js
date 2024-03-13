import{W as r}from"./Widget-B6WpeV_a.js";import{d as o}from"./index-DrFu-skq.js";import{A as d,d as s,h as a,C as h}from"./Widget-Dxvrat1N.js";const g=o`import { Container, SizedBox, Align, Alignment } from '@meursyphus/flitter';
\n\n`,c={title:"Widget/SizedBox",component:r},l=o`
    Align({
        alignment: Alignment.center,
        child: SizedBox({
            width: 200,
            height: 200,
            child: Container({
                width: 0,
                height: 0,
                color: 'orange'
            })
        })
    })
`,e={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:g+l,widget:d({alignment:s.center,child:a({width:200,height:200,child:h({width:0,height:0,color:"orange"})})})}};var t,i,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: Align({
      alignment: Alignment.center,
      child: SizedBox({
        width: 200,
        height: 200,
        child: Container({
          width: 0,
          height: 0,
          color: 'orange'
        })
      })
    })
  }
}`,...(n=(i=e.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};const m=["Basic"],x=Object.freeze(Object.defineProperty({__proto__:null,Basic:e,__namedExportsOrder:m,default:c},Symbol.toStringTag,{value:"Module"}));export{e as B,x as S};
