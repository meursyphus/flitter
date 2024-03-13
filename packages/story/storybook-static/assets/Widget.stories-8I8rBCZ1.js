import{W as a}from"./Widget-B6WpeV_a.js";import{d as l}from"./index-DrFu-skq.js";import{A as c,d,C as n,l as s}from"./Widget-Dxvrat1N.js";import{R as g}from"./Row-Df4bPl7Z.js";import{S as t}from"./Spacer-CR_sgBcC.js";const h=l`import { Container, Align, Alignment, Row, Expanded, Spacer } from '@meursyphus/flitter';
\n\n`,p={title:"Widget/Expanded",component:a},m=l`
    Align({
        alignment: Alignment.center,
        child: Container({
            color: 'lightblue',
            child: Row({
                children: [
                    Spacer({ flex: 0.5 }),
                    Expanded({
                        flex: 1,
                        child: Container({
                            color: 'orange',
                            height: 50
                        })
                    }),
                    Spacer({ flex: 0.5 }),
                ]
            })
        })
    })
`,e={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:h+m,widget:c({alignment:d.center,child:n({color:"lightblue",child:g({children:[t({flex:.5}),s({flex:1,child:n({color:"orange",height:50})}),t({flex:.5})]})})})}};var i,r,o;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
          children: [Spacer({
            flex: 0.5
          }), Expanded({
            flex: 1,
            child: Container({
              color: 'orange',
              height: 50
            })
          }), Spacer({
            flex: 0.5
          })]
        })
      })
    })
  }
}`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const x=["Basic"],C=Object.freeze(Object.defineProperty({__proto__:null,Basic:e,__namedExportsOrder:x,default:p},Symbol.toStringTag,{value:"Module"}));export{e as B,C as S};
