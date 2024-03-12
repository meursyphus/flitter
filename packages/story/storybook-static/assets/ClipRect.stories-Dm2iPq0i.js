import{W as m}from"./Widget-B6WpeV_a.js";import{g as o,R as r,S as f,h as z,i as n,C as t,O as c}from"./Widget-Dxvrat1N.js";import{d}from"./index-DrFu-skq.js";const C=d`import {
    Container,
    ClipRect,
    Rect,
    Stack,
    Positioned,
    SizedBox
} from '@meursyphus/flitter';
\n\n`,u={title:"Widget/ClipRect",component:m,parameters:{layout:"fullscreen"}},x=d`
    ClipRect({
        clipper: (size) =>
            Rect.fromLTWH({
                left: 0,
                top: 0,
                width: (size.width * 3) / 4,
                height: (size.height * 3) / 4
            }),
        child: Stack({
            children: [
                SizedBox({
                    width: 400,
                    height: 400
                }),
                Positioned({
                    child: Container({ width: 200, height: 200, color: 'blue' })
                }),
                Positioned({
                    left: 200,
                    child: Container({ width: 200, height: 200, color: 'red' })
                }),
                Positioned({
                    top: 200,
                    child: Container({ width: 200, height: 200, color: 'green' })
                }),
                Positioned({
                    left: 200,
                    top: 200,
                    child: Container({ width: 200, height: 200, color: 'purple' })
                })
            ]
        })
    })
`,i={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:o({clipper:e=>r.fromLTWH({left:0,top:0,width:e.width*3/4,height:e.height*3/4}),child:f({children:[z({width:400,height:400}),n({child:t({width:200,height:200,color:"blue"})}),n({left:200,child:t({width:200,height:200,color:"red"})}),n({top:200,child:t({width:200,height:200,color:"green"})}),n({left:200,top:200,child:t({width:200,height:200,color:"purple"})})]})}),code:C+x}},S=d`
    ClipRect({
        clipper: (size) =>
            Rect.fromCenter({
                center: { x: size.width / 2, y: size.height / 2 },
                width: size.width / 2,
                height: size.height / 2
            }),
        child: ClipRect({
            clipper: (size) =>
                Rect.fromCenter({
                    center: { x: (size.width * 3) / 4, y: size.height / 4 },
                    width: size.width / 2,
                    height: size.height / 2
                }),
            child: Container({
                color: 'black'
            })
        })
    })
`,h={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:o({clipper:e=>r.fromCenter({center:new c({x:e.width/2,y:e.height/2}),width:e.width/2,height:e.height/2}),child:o({clipper:e=>r.fromCenter({center:new c({x:e.width*3/4,y:e.height/4}),width:e.width/2,height:e.height/2}),child:t({color:"black"})})}),code:C+S}};var s,l,p;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: ClipRect({
      clipper: size => Rect.fromLTWH({
        left: 0,
        top: 0,
        width: size.width * 3 / 4,
        height: size.height * 3 / 4
      }),
      child: Stack({
        children: [SizedBox({
          width: 400,
          height: 400
        }), Positioned({
          child: Container({
            width: 200,
            height: 200,
            color: 'blue'
          })
        }), Positioned({
          left: 200,
          child: Container({
            width: 200,
            height: 200,
            color: 'red'
          })
        }), Positioned({
          top: 200,
          child: Container({
            width: 200,
            height: 200,
            color: 'green'
          })
        }), Positioned({
          left: 200,
          top: 200,
          child: Container({
            width: 200,
            height: 200,
            color: 'purple'
          })
        })]
      })
    }),
    code: ImportWidgetCode + BasicCode
  }
}`,...(p=(l=i.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var g,a,w;h.parameters={...h.parameters,docs:{...(g=h.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: ClipRect({
      clipper: size => Rect.fromCenter({
        center: new Offset({
          x: size.width / 2,
          y: size.height / 2
        }),
        width: size.width / 2,
        height: size.height / 2
      }),
      child: ClipRect({
        clipper: size => Rect.fromCenter({
          center: new Offset({
            x: size.width * 3 / 4,
            y: size.height / 4
          }),
          width: size.width / 2,
          height: size.height / 2
        }),
        child: Container({
          color: 'black'
        })
      })
    }),
    code: ImportWidgetCode + NestedCode
  }
}`,...(w=(a=h.parameters)==null?void 0:a.docs)==null?void 0:w.source}}};const R=["Basic","Nested"],B=Object.freeze(Object.defineProperty({__proto__:null,Basic:i,Nested:h,__namedExportsOrder:R,default:u},Symbol.toStringTag,{value:"Module"}));export{i as B,B as S};
