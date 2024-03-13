import{W as S}from"./Widget-B6WpeV_a.js";import{d}from"./index-DrFu-skq.js";import{f as O,P as R,R as o,S as F,h as P,i as l,C as i,F as t,O as c}from"./Widget-Dxvrat1N.js";import{C as W}from"./Column-BDxz2XB9.js";import{R as s}from"./Row-Df4bPl7Z.js";function r({child:e,clipper:x,clipped:u=!0,key:z}){return O({clipped:u,child:e,key:z,clipper:b=>new R().addOval(x(b))})}const f=d`import {
    Container,
    Rect,
    ClipOval,
    Column,
    Row,
    Flexible,
    Stack,
    Positioned,
    SizedBox,
} from '@meursyphus/flitter'
`,v={title:"Widget/ClipOval",component:S},y=d`
    ClipOval({
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
    `,n={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:f+`

`+y,widget:r({clipper:e=>o.fromLTWH({left:0,top:0,width:e.width*3/4,height:e.height*3/4}),child:F({children:[P({width:400,height:400}),l({child:i({width:200,height:200,color:"blue"})}),l({left:200,child:i({width:200,height:200,color:"red"})}),l({top:200,child:i({width:200,height:200,color:"green"})}),l({left:200,top:200,child:i({width:200,height:200,color:"purple"})})]})})}},B=d`
    Column({
        children: [
            Flexible({
                child: Row({
                    children: [
                        Flexible({
                            child: ClipOval({
                                clipper: (size) =>
                                    Rect.fromCenter({
                                        center: { x: size.width / 2, y: size.height / 2 },
                                        width: size.width / 2,
                                        height: size.height / 2
                                    }),
                                child: Container({
                                    color: 'blue'
                                })
                            })
                        }),
                        Flexible({
                            child: Container({
                                color: 'red'
                            })
                        })
                    ]
                })
            }),
            Flexible({
                child: Row({
                    children: [
                        Flexible({
                            child: Container({
                                color: 'green'
                            })
                        }),
                        Flexible({
                            child: ClipOval({
                                clipper: (size) =>
                                    Rect.fromCenter({
                                        center: { x: size.width / 2, y: size.height / 2 },
                                        width: size.width / 2,
                                        height: size.height / 2
                                    }),
                                child: Container({
                                    color: 'purple'
                                })
                            })
                        })
                    ]
                })
            })
        ]
    })
`,h={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:W({children:[t({child:s({children:[t({child:r({clipper:e=>o.fromCenter({center:new c({x:e.width/2,y:e.height/2}),width:e.width/2,height:e.height/2}),child:i({color:"blue"})})}),t({child:i({color:"red"})})]})}),t({child:s({children:[t({child:i({color:"green"})}),t({child:r({clipper:e=>o.fromCenter({center:new c({x:e.width/2,y:e.height/2}),width:e.width/2,height:e.height/2}),child:i({color:"purple"})})})]})})]}),code:f+`

`+B}};var a,p,g;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + '\\n\\n' + BasicWidget,
    widget: ClipOval({
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
    })
  }
}`,...(g=(p=n.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var w,C,m;h.parameters={...h.parameters,docs:{...(w=h.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Column({
      children: [Flexible({
        child: Row({
          children: [Flexible({
            child: ClipOval({
              clipper: size => Rect.fromCenter({
                center: new Offset({
                  x: size.width / 2,
                  y: size.height / 2
                }),
                width: size.width / 2,
                height: size.height / 2
              }),
              child: Container({
                color: 'blue'
              })
            })
          }), Flexible({
            child: Container({
              color: 'red'
            })
          })]
        })
      }), Flexible({
        child: Row({
          children: [Flexible({
            child: Container({
              color: 'green'
            })
          }), Flexible({
            child: ClipOval({
              clipper: size => Rect.fromCenter({
                center: new Offset({
                  x: size.width / 2,
                  y: size.height / 2
                }),
                width: size.width / 2,
                height: size.height / 2
              }),
              child: Container({
                color: 'purple'
              })
            })
          })]
        })
      })]
    }),
    code: importWidgets + '\\n\\n' + TranslatedClipWidget
  }
}`,...(m=(C=h.parameters)==null?void 0:C.docs)==null?void 0:m.source}}};const T=["Basic","TranslatedClip"],E=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,TranslatedClip:h,__namedExportsOrder:T,default:v},Symbol.toStringTag,{value:"Module"}));export{n as B,E as S};
