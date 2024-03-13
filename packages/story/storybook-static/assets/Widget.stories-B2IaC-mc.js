import{W as s}from"./Widget-B6WpeV_a.js";import{d as l}from"./index-DrFu-skq.js";import{C as t,m as o,O as e}from"./Widget-Dxvrat1N.js";import{C as h}from"./Column-BDxz2XB9.js";const c={title:"Widget/FractionalTranslation",component:s},d=l`
        Container({
            color: 'lightblue',
            child: Column({
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'purple'
                    }),
                    FractionalTranslation({
                        translation: new Offset({ x: 1, y: -1 }),
                        child: Container({
                            width: 50,
                            height: 50,
                            color: 'blue'
                        })
                    }),
                    FractionalTranslation({
                        translation: new Offset({ x: 1, y: -1 }),
                        child: Container({
                            width: 50,
                            height: 50,
                            color: 'orange'
                        })
                    })
                ]
            })
        })
`,n={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:l`import { Container, Column, FractionalTranslation, Offset } from '@meursyphus/flitter';'\n\n\n`+d,widget:t({color:"lightblue",child:h({children:[t({width:50,height:50,color:"purple"}),o({translation:new e({x:1,y:-1}),child:t({width:50,height:50,color:"blue"})}),o({translation:new e({x:1,y:-1}),child:t({width:50,height:50,color:"orange"})})]})})}};var i,r,a;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`import { Container, Column, FractionalTranslation, Offset } from '@meursyphus/flitter';'\\n\\n\\n\` + BasicCode,
    widget: Container({
      color: 'lightblue',
      child: Column({
        children: [Container({
          width: 50,
          height: 50,
          color: 'purple'
        }), FractionalTranslation({
          translation: new Offset({
            x: 1,
            y: -1
          }),
          child: Container({
            width: 50,
            height: 50,
            color: 'blue'
          })
        }), FractionalTranslation({
          translation: new Offset({
            x: 1,
            y: -1
          }),
          child: Container({
            width: 50,
            height: 50,
            color: 'orange'
          })
        })]
      })
    })
  }
}`,...(a=(r=n.parameters)==null?void 0:r.docs)==null?void 0:a.source}}};const g=["Basic"],w=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,__namedExportsOrder:g,default:c},Symbol.toStringTag,{value:"Module"}));export{n as B,w as S};
