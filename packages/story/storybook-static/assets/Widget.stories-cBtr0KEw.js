import{W as g}from"./Widget-B6WpeV_a.js";import{d as r}from"./index-DrFu-skq.js";import{C as i,F as p}from"./Widget-Dxvrat1N.js";import{R as m}from"./Row-Df4bPl7Z.js";import{C as l}from"./Center-BPlvJyPx.js";import{F as s}from"./FractionallySizedBox-Bm-UT4Gm.js";const w={title:"Widget/FractionallySizedBox",component:g},F=r`
    Center({
        child: FractionallySizedBox({
            widthFactor: 0.5,
            heightFactor: 0.5,
            child: Container({
                color: 'orange'
            })
        })
    })
`,e={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:r`import { Center, FractionallySizedBox, Container } from '@meursyphus/flitter'\n\n\n`+F,widget:l({child:s({widthFactor:.5,heightFactor:.5,child:i({color:"orange"})})})}},x=r`
    Center({
        child: Container({
            color: 'white',
            child: Row({
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green'
                    }),
                    Flexible({
                        child: FractionallySizedBox({
                            widthFactor: 0.2
                        })
                    }),
                    Container({
                        width: 100,
                        height: 100,
                        color: 'red'
                    })
                ]
            })
        })
    })
`,t={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:r`import { Container, Row, FractionallySizedBox, Flexible } from '@meursyphus/flitter'\n\n\n`+x,widget:l({child:i({color:"white",child:m({children:[i({width:50,height:50,color:"green"}),p({child:s({widthFactor:.3})}),i({width:100,height:100,color:"red"})]})})})}};var o,n,a;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Center, FractionallySizedBox, Container } from '@meursyphus/flitter'\\n\\n\\n\` + BasicWidget,
    widget: Center({
      child: FractionallySizedBox({
        widthFactor: 0.5,
        heightFactor: 0.5,
        child: Container({
          color: 'orange'
        })
      })
    })
  }
}`,...(a=(n=e.parameters)==null?void 0:n.docs)==null?void 0:a.source}}};var c,d,h;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Row, FractionallySizedBox, Flexible } from '@meursyphus/flitter'\\n\\n\\n\` + WhitespaceCode,
    widget: Center({
      child: Container({
        color: 'white',
        child: Row({
          children: [Container({
            width: 50,
            height: 50,
            color: 'green'
          }), Flexible({
            child: FractionallySizedBox({
              widthFactor: 0.3
            })
          }), Container({
            width: 100,
            height: 100,
            color: 'red'
          })]
        })
      })
    })
  }
}`,...(h=(d=t.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};const C=["Basic","Whitespace"],W=Object.freeze(Object.defineProperty({__proto__:null,Basic:e,Whitespace:t,__namedExportsOrder:C,default:w},Symbol.toStringTag,{value:"Module"}));export{e as B,W as S};
