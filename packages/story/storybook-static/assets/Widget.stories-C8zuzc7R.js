import{W as s}from"./Widget-B6WpeV_a.js";import{d as e}from"./index-DrFu-skq.js";import{C as i}from"./Widget-Dxvrat1N.js";import{C as p}from"./Column-BDxz2XB9.js";import{O as n}from"./Opacity-CBfHa7_s.js";const g={title:"Widget/Opacity",component:s},m=e`
        Container({
            color: 'lightblue',
            child: Column({
                children: [
                    Opacity({
                        opacity: 1,
                        child: Container({
                            width: 400,
                            height: 60,
                            color: 'orange'
                        })
                    }),
                    Opacity({
                        opacity: 0.5,
                        child: Container({
                            width: 400,
                            height: 60,
                            color: 'orange'
                        })
                    }),
                    Opacity({
                        opacity: 0.25,
                        child: Container({
                            width: 400,
                            height: 60,
                            color: 'orange'
                        })
                    })
                ]
            })
        })
`,t={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:e`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\n\n\n`+m,widget:i({color:"lightblue",child:p({children:[n({opacity:1,child:i({width:400,height:60,color:"orange"})}),n({opacity:.5,child:i({width:400,height:60,color:"orange"})}),n({opacity:.25,child:i({width:400,height:60,color:"orange"})})]})})}},y=e`
        Column({
            children: [
                Opacity({
                    opacity: 0.5,
                    child: Container({
                        width: 400,
                        height: 60,
                        color: 'blue'
                    })
                }),
                Opacity({
                    opacity: 0.5,
                    child: Container({
                        child: Opacity({
                            opacity: 0.5,
                            child: Container({
                                width: 400,
                                height: 60,
                                color: 'blue'
                            })
                        })
                    })
                })
            ]
        })
`,o={args:{ssrSize:{width:600,height:300},width:"400px",height:"400px",code:e`import {  Container, Column, Opacity, Column } from '@meursyphus/flitter';'\n\n\n`+y,widget:p({children:[n({opacity:.5,child:i({width:400,height:60,color:"blue"})}),n({opacity:.5,child:i({child:n({opacity:.5,child:i({width:400,height:60,color:"blue"})})})})]})}};var r,c,h;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\\n\\n\\n\` + BasicCode,
    widget: Container({
      color: 'lightblue',
      child: Column({
        children: [Opacity({
          opacity: 1,
          child: Container({
            width: 400,
            height: 60,
            color: 'orange'
          })
        }), Opacity({
          opacity: 0.5,
          child: Container({
            width: 400,
            height: 60,
            color: 'orange'
          })
        }), Opacity({
          opacity: 0.25,
          child: Container({
            width: 400,
            height: 60,
            color: 'orange'
          })
        })]
      })
    })
  }
}`,...(h=(c=t.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var a,d,l;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '400px',
    height: '400px',
    code: dedent\`import {  Container, Column, Opacity, Column } from '@meursyphus/flitter';'\\n\\n\\n\` + NestCode,
    widget: Column({
      children: [Opacity({
        opacity: 0.5,
        child: Container({
          width: 400,
          height: 60,
          color: 'blue'
        })
      }), Opacity({
        opacity: 0.5,
        child: Container({
          child: Opacity({
            opacity: 0.5,
            child: Container({
              width: 400,
              height: 60,
              color: 'blue'
            })
          })
        })
      })]
    })
  }
}`,...(l=(d=o.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const u=["Basic","Nest"],x=Object.freeze(Object.defineProperty({__proto__:null,Basic:t,Nest:o,__namedExportsOrder:u,default:g},Symbol.toStringTag,{value:"Module"}));export{t as B,x as S};
