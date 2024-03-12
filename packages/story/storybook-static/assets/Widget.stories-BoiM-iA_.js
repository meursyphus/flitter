import{W as p}from"./Widget-B6WpeV_a.js";import{f as u,P as R,R as m,B as a,k as C,C as g}from"./Widget-Dxvrat1N.js";import{C as f}from"./Center-BPlvJyPx.js";import{d}from"./index-DrFu-skq.js";function w({child:s,borderRadius:c=a.zero,clipped:l=!0,clipper:r,key:h}){return u({child:s,key:h,clipped:l,clipper:t=>new R().addRRect(r?r(t):c.toRRect(m.fromLTWH({left:0,top:0,width:t.width,height:t.height})))})}const B={title:"Widget/ClipRRect",component:p,parameters:{layout:"fullscreen"}},S=d`
    Center({
        child: ClipRRect({
            borderRadius: BorderRadius.all(Radius.circular(20)),
            child: Container({
                color: 'red',
                width: 200,
                height: 200
            })
        })
    })
`,e={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:f({child:w({borderRadius:a.all(C.circular(40)),child:g({color:"red",width:200,height:200})})}),code:d`import { Container, Center, ClipRRect } from '@meursyphus/flitter';\n\n\n`+S}};var i,o,n;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: ClipRRect({
        borderRadius: BorderRadius.all(Radius.circular(40)),
        child: Container({
          color: 'red',
          width: 200,
          height: 200
        })
      })
    }),
    code: dedent\`import { Container, Center, ClipRRect } from '@meursyphus/flitter';\\n\\n\\n\` + BasicCode
  }
}`,...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const _=["Basic"],P=Object.freeze(Object.defineProperty({__proto__:null,Basic:e,__namedExportsOrder:_,default:B},Symbol.toStringTag,{value:"Module"}));export{e as B,P as S};
