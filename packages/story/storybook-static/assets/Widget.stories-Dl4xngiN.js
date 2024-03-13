import{W as c}from"./Widget-B6WpeV_a.js";import{d as o}from"./index-DrFu-skq.js";import{A as l,d as a,C as n}from"./Widget-Dxvrat1N.js";import{R as h}from"./Row-Df4bPl7Z.js";import{S as d}from"./Spacer-CR_sgBcC.js";const g=o`import { Container, Align, Alignment, Row, Spacer } from '@meursyphus/flitter';
\n\n`,s={title:"Widget/Spacer",component:c},m=o`
    Align({
        alignment: Alignment.center,
        child: Container({
            color: 'lightblue',
            child: Row({
                children: [
                    Container({
                        color: 'blue',
                        height: 50,
                        width: 50
                    }),
                    Spacer(),
                    Container({
                        color: 'green',
                        height: 50,
                        width: 50
                    }),
                ]
            })
        })
    })
`,e={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:g+m,widget:l({alignment:a.center,child:n({color:"lightblue",child:h({children:[n({color:"blue",height:50,width:50}),d(),n({color:"green",height:50,width:50})]})})})}};var t,i,r;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: importWidgets + BasicWidget,
    widget: Align({
      alignment: Alignment.center,
      child: Container({
        color: 'lightblue',
        child: Row({
          children: [Container({
            color: 'blue',
            height: 50,
            width: 50
          }), Spacer(), Container({
            color: 'green',
            height: 50,
            width: 50
          })]
        })
      })
    })
  }
}`,...(r=(i=e.parameters)==null?void 0:i.docs)==null?void 0:r.source}}};const p=["Basic"],A=Object.freeze(Object.defineProperty({__proto__:null,Basic:e,__namedExportsOrder:p,default:s},Symbol.toStringTag,{value:"Module"}));export{e as B,A as S};
