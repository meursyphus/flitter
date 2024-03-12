import{W as R}from"./Widget-B6WpeV_a.js";import{d}from"./index-DrFu-skq.js";import{f as r,P as c,C as o,R as t}from"./Widget-Dxvrat1N.js";const y={title:"Widget/ClipPath",component:R},a=d`import { Container, Path, ClipPath, Rect, Center } from '@meursyphus/flitter' \n\n\n`,f=d`
    ClipPath({
        clipper: (size) =>
            new Path()
                .moveTo({ x: 0, y: 0 })
                .lineTo({ x: 0, y: size.height })
                .lineTo({ x: size.width, y: size.height })
                .close(),
        child: Container({
            color: 'black'
        })
    })
`,i={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:r({clipper:e=>new c().moveTo({x:0,y:0}).lineTo({x:0,y:e.height}).lineTo({x:e.width,y:e.height}).close(),child:o({color:"black"})}),code:a+f}},P=d`
    ClipPath({
        clipper: (size) =>
            new Path()
                .addRect(
                    Rect.fromCenter({
                        center: { x: size.width / 2, y: size.height / 2 },
                        width: size.width / 2,
                        height: size.height / 2
                    })
                )
                .addRect(
                    Rect.fromCenter({
                        center: { x: (size.width * 7) / 8, y: size.height / 8 },
                        width: size.width / 4,
                        height: size.height / 4
                    })
                )
                .addRect(
                    Rect.fromCenter({
                        center: { x: size.width / 8, y: size.height / 8 },
                        width: size.width / 4,
                        height: size.height / 4
                    })
                )
                .addRect(
                    Rect.fromCenter({
                        center: { x: size.width / 8, y: (size.height * 7) / 8 },
                        width: size.width / 4,
                        height: size.height / 4
                    })
                )
                .addRect(
                    Rect.fromCenter({
                        center: { x: (size.width * 7) / 8, y: (size.height * 7) / 8 },
                        width: size.width / 4,
                        height: size.height / 4
                    })
                ),
        child: Container({
            color: 'black'
        })
    })
`,h={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:r({clipper:e=>new c().addRect(t.fromCenter({center:{x:e.width/2,y:e.height/2},width:e.width/2,height:e.height/2})).addRect(t.fromCenter({center:{x:e.width*7/8,y:e.height/8},width:e.width/4,height:e.height/4})).addRect(t.fromCenter({center:{x:e.width/8,y:e.height/8},width:e.width/4,height:e.height/4})).addRect(t.fromCenter({center:{x:e.width/8,y:e.height*7/8},width:e.width/4,height:e.height/4})).addRect(t.fromCenter({center:{x:e.width*7/8,y:e.height*7/8},width:e.width/4,height:e.height/4})),child:o({color:"black"})}),code:a+P}},u=d`
    ClipPath({
        clipper: (size) =>
            new Path().addOval(
                Rect.fromCenter({
                    center: { x: size.width / 2, y: size.height / 2 },
                    width: size.width,
                    height: size.height
                })
            ),
        child: Container({
            color: 'black'
        })
    })
`,n={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:r({clipper:e=>new c().addOval(t.fromCenter({center:{x:e.width/2,y:e.height/2},width:e.width,height:e.height})),child:o({color:"black"})}),code:a+u}};var s,g,w;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: ClipPath({
      clipper: size => new Path().moveTo({
        x: 0,
        y: 0
      }).lineTo({
        x: 0,
        y: size.height
      }).lineTo({
        x: size.width,
        y: size.height
      }).close(),
      child: Container({
        color: 'black'
      })
    }),
    code: ImportWidgetCode + BasicWidget
  }
}`,...(w=(g=i.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};var l,p,m;h.parameters={...h.parameters,docs:{...(l=h.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: ClipPath({
      clipper: size => new Path().addRect(Rect.fromCenter({
        center: {
          x: size.width / 2,
          y: size.height / 2
        },
        width: size.width / 2,
        height: size.height / 2
      })).addRect(Rect.fromCenter({
        center: {
          x: size.width * 7 / 8,
          y: size.height / 8
        },
        width: size.width / 4,
        height: size.height / 4
      })).addRect(Rect.fromCenter({
        center: {
          x: size.width / 8,
          y: size.height / 8
        },
        width: size.width / 4,
        height: size.height / 4
      })).addRect(Rect.fromCenter({
        center: {
          x: size.width / 8,
          y: size.height * 7 / 8
        },
        width: size.width / 4,
        height: size.height / 4
      })).addRect(Rect.fromCenter({
        center: {
          x: size.width * 7 / 8,
          y: size.height * 7 / 8
        },
        width: size.width / 4,
        height: size.height / 4
      })),
      child: Container({
        color: 'black'
      })
    }),
    code: ImportWidgetCode + RectClipCode
  }
}`,...(m=(p=h.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var C,z,x;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: ClipPath({
      clipper: size => new Path().addOval(Rect.fromCenter({
        center: {
          x: size.width / 2,
          y: size.height / 2
        },
        width: size.width,
        height: size.height
      })),
      child: Container({
        color: 'black'
      })
    }),
    code: ImportWidgetCode + RectOvalCode
  }
}`,...(x=(z=n.parameters)==null?void 0:z.docs)==null?void 0:x.source}}};const S=["Basic","RectClip","RectOval"],T=Object.freeze(Object.defineProperty({__proto__:null,Basic:i,RectClip:h,RectOval:n,__namedExportsOrder:S,default:y},Symbol.toStringTag,{value:"Module"}));export{i as B,h as R,T as S,n as a};
