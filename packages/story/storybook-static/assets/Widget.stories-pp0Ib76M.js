import{W as z}from"./Widget-B6WpeV_a.js";import{d as n}from"./index-DrFu-skq.js";import{t as a,M as S,C as e,d as h,T as A,j as y}from"./Widget-Dxvrat1N.js";import{C as s}from"./Center-BPlvJyPx.js";const M={title:"Widget/Transform",component:z},b=n`
        Center({
            child: Transform({
                transform: Matrix4.translationValues(-50, -50, 0),
                child: Container({
                    width: 200,
                    height: 200,
                    color: 'green'
                })
            })
        })
`,t={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:n`import { Center, Transform, Matrix4, Container } from '@meursyphus/flitter';\n\n\n`+b,widget:s({child:a({transform:S.translationValues(-50,-50,0),child:e({width:200,height:200,color:"green"})})})}},r={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:n`
        import { Center, Transform, Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';

        Center({
            child: Transform.rotate({
                angle: Math.PI / 4,
                child: Container({
                    width: 200,
                    height: 200,
                    color: 'green',
                    alignment: Alignment.bottomRight,
                    child: Container({
                        color: 'red',
                        child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
                    })
                })
            })
        })
            
            `,widget:s({child:a.rotate({angle:Math.PI/4,child:e({width:200,height:200,color:"green",alignment:h.bottomRight,child:e({color:"red",child:A("AAAA",{style:new y({color:"white",fontSize:30})})})})})})}},R=n`
        Center({
            child: Transform.scale({
                scale: 0.5,
                child: Container({
                    width: 200,
                    height: 200,
                    color: 'green'
                })
            })
        })
`,i={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:n`import { Center, Transform, Container } from '@meursyphus/flitter';\n\n\n`+R,widget:s({child:a.scale({scale:.5,child:e({width:200,height:200,color:"green"})})})}},o={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:n`
            import { Center, Transform, Container, Text, TextStyle, Matrix4, Alignment } from '@meursyphus/flitter'
            
            `,widget:s({child:a({transform:S.diagonal3Values(1,-1,1),alignment:h.center,child:e({width:200,height:200,color:"green",alignment:h.bottomRight,child:e({color:"red",child:A("AAAA",{style:new y({color:"white",fontSize:30})})})})})})}};var l,d,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`import { Center, Transform, Matrix4, Container } from '@meursyphus/flitter';\\n\\n\\n\` + BasicWidget,
    widget: Center({
      child: Transform({
        transform: Matrix4.translationValues(-50, -50, 0),
        child: Container({
          width: 200,
          height: 200,
          color: 'green'
        })
      })
    })
  }
}`,...(c=(d=t.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var m,g,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`
        import { Center, Transform, Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';

        Center({
            child: Transform.rotate({
                angle: Math.PI / 4,
                child: Container({
                    width: 200,
                    height: 200,
                    color: 'green',
                    alignment: Alignment.bottomRight,
                    child: Container({
                        color: 'red',
                        child: Text('AAAA', { style: new TextStyle({ color: 'white', fontSize: 30 }) })
                    })
                })
            })
        })
            
            \`,
    widget: Center({
      child: Transform.rotate({
        angle: Math.PI / 4,
        child: Container({
          width: 200,
          height: 200,
          color: 'green',
          alignment: Alignment.bottomRight,
          child: Container({
            color: 'red',
            child: Text('AAAA', {
              style: new TextStyle({
                color: 'white',
                fontSize: 30
              })
            })
          })
        })
      })
    })
  }
}`,...(p=(g=r.parameters)==null?void 0:g.docs)==null?void 0:p.source}}};var f,w,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`import { Center, Transform, Container } from '@meursyphus/flitter';\\n\\n\\n\` + ScaleCode,
    widget: Center({
      child: Transform.scale({
        scale: 0.5,
        child: Container({
          width: 200,
          height: 200,
          color: 'green'
        })
      })
    })
  }
}`,...(x=(w=i.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};var C,T,u;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`
            import { Center, Transform, Container, Text, TextStyle, Matrix4, Alignment } from '@meursyphus/flitter'
            
            \`,
    widget: Center({
      child: Transform({
        transform: Matrix4.diagonal3Values(1, -1, 1),
        alignment: Alignment.center,
        child: Container({
          width: 200,
          height: 200,
          color: 'green',
          alignment: Alignment.bottomRight,
          child: Container({
            color: 'red',
            child: Text('AAAA', {
              style: new TextStyle({
                color: 'white',
                fontSize: 30
              })
            })
          })
        })
      })
    })
  }
}`,...(u=(T=o.parameters)==null?void 0:T.docs)==null?void 0:u.source}}};const _=["Basic","Rotate","Scale","Symmetric"],I=Object.freeze(Object.defineProperty({__proto__:null,Basic:t,Rotate:r,Scale:i,Symmetric:o,__namedExportsOrder:_,default:M},Symbol.toStringTag,{value:"Module"}));export{t as B,I as S};
