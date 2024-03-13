import{W as H}from"./Widget-B6WpeV_a.js";import{D as i,h as r,S as d,C as o,B as J,k as K,O as S}from"./Widget-Dxvrat1N.js";import{B as n,a as g,b as h,c as u}from"./box-decoration-BcTLV75v.js";import{C as t}from"./Center-BPlvJyPx.js";import{d as e}from"./index-DrFu-skq.js";const L={title:"Widget/DecoratedBox",component:H,parameters:{layout:"fullscreen"}},N=e`
        Center({
            child: DecoratedBox({
                decoration: new BoxDecoration({ color: 'red' }),
                child: SizedBox({
                    width: 200,
                    height: 200
                })
            })
        }),
`,c={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:i({decoration:new n({color:"red"}),child:r({width:200,height:200})})}),code:e`import { SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+N}},Q=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({ border: Border.all({}), shape: 'circle' }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,a={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),o({decoration:new n({color:"red",shape:"circle"}),child:r({width:200,height:200})})]})}),code:e`import { Stack, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+Q}},V=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            border: Border.all({ width: 20, color: 'green' })
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,s={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({border:g.all({width:20,color:"green"})}),child:r({width:200,height:200})})]})}),code:e`import { Stack, Border, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+V}},X=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            border: Border.all({
                                width: 20,
                                color: 'green',
                                strokeAlign: BorderSide.strokeAlignOutside
                            })
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,l={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({border:g.all({width:20,color:"green",strokeAlign:h.strokeAlignOutside})}),child:r({width:200,height:200})})]})}),code:e`import { Stack, Border, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+X}},Y=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            border: Border.all({
                                width: 20
                            }),
                            borderRadius: BorderRadius.all(Radius.circular(10))
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,w={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({border:g.all({width:20}),borderRadius:J.all(K.circular(10))}),child:r({width:200,height:200})})]})}),code:e`import { Stack, Border, BorderRadius, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+Y}},Z=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            border: new Border({
                                top: new BorderSide({ width: 10, color: 'black' })
                            })
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,B={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({border:new g({top:new h({width:10,color:"black"})})}),child:r({width:200,height:200})})]})}),code:e`import { Stack, Border, BorderSide SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+Z}},$=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            border: new Border({
                                top: new BorderSide({ width: 10, color: 'blue' }),
                                left: new BorderSide({ width: 5, color: 'green' }),
                                right: new BorderSide({ width: 20, color: 'red' }),
                                bottom: new BorderSide({ width: 15, color: 'purple' })
                            })
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,p={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({border:new g({top:new h({width:10,color:"blue"}),left:new h({width:5,color:"green"}),right:new h({width:20,color:"red"}),bottom:new h({width:15,color:"purple"})})}),child:r({width:200,height:200})})]})}),code:e`import { Border, Stack, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+$}},ee=e`
        Center({
            child: Stack({
                clipped: false,
                children: [
                    Container({
                        width: 200,
                        height: 200,
                        color: 'white'
                    }),
                    DecoratedBox({
                        decoration: new BoxDecoration({
                            color: 'gray',
                            boxShadow: [
                                new BoxShadow({
                                    blurRadius: 10,
                                    offset: new Offset({ x: 10, y: 10 })
                                }),
                                new BoxShadow({
                                    blurRadius: 10,
                                    color: 'blue',
                                    offset: new Offset({ x: -10, y: -10 })
                                })
                            ]
                        }),
                        child: SizedBox({
                            width: 200,
                            height: 200
                        })
                    })
                ]
            })
        }),
`,x={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:t({child:d({clipped:!1,children:[o({width:200,height:200,color:"white"}),i({decoration:new n({color:"gray",boxShadow:[new u({blurRadius:10,offset:new S({x:10,y:10})}),new u({blurRadius:10,color:"blue",offset:new S({x:-10,y:-10})})]}),child:r({width:200,height:200})})]})}),code:e`import { Stack, BoxShadow, Offset, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\n\n\n`+ee}};var m,f,C;c.parameters={...c.parameters,docs:{...(m=c.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: DecoratedBox({
        decoration: new BoxDecoration({
          color: 'red'
        }),
        child: SizedBox({
          width: 200,
          height: 200
        })
      })
    }),
    code: dedent\`import { SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + BasicCode
  }
}`,...(C=(f=c.parameters)==null?void 0:f.docs)==null?void 0:C.source}}};var D,z,b;a.parameters={...a.parameters,docs:{...(D=a.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), Container({
          decoration: new BoxDecoration({
            color: 'red',
            shape: 'circle'
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + CircleCode
  }
}`,...(b=(z=a.parameters)==null?void 0:z.docs)==null?void 0:b.source}}};var k,y,R;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            border: Border.all({
              width: 20,
              color: 'green'
            })
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, Border, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + InnerBorderCode
  }
}`,...(R=(y=s.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};var O,W,U;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            border: Border.all({
              width: 20,
              color: 'green',
              strokeAlign: BorderSide.strokeAlignOutside
            })
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, Border, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + OuterBorderCode
  }
}`,...(U=(W=l.parameters)==null?void 0:W.docs)==null?void 0:U.source}}};var _,A,T;w.parameters={...w.parameters,docs:{...(_=w.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            border: Border.all({
              width: 20
            }),
            borderRadius: BorderRadius.all(Radius.circular(10))
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, Border, BorderRadius, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + WithBorderRadiusCode
  }
}`,...(T=(A=w.parameters)==null?void 0:A.docs)==null?void 0:T.source}}};var I,j,v;B.parameters={...B.parameters,docs:{...(I=B.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            border: new Border({
              top: new BorderSide({
                width: 10,
                color: 'black'
              })
            })
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, Border, BorderSide SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + BorderTopCode
  }
}`,...(v=(j=B.parameters)==null?void 0:j.docs)==null?void 0:v.source}}};var E,M,P;p.parameters={...p.parameters,docs:{...(E=p.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            border: new Border({
              top: new BorderSide({
                width: 10,
                color: 'blue'
              }),
              left: new BorderSide({
                width: 5,
                color: 'green'
              }),
              right: new BorderSide({
                width: 20,
                color: 'red'
              }),
              bottom: new BorderSide({
                width: 15,
                color: 'purple'
              })
            })
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Border, Stack, BorderSide, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + UnUniformedBorderCode
  }
}`,...(P=(M=p.parameters)==null?void 0:M.docs)==null?void 0:P.source}}};var q,F,G;x.parameters={...x.parameters,docs:{...(q=x.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: Stack({
        clipped: false,
        children: [Container({
          width: 200,
          height: 200,
          color: 'white'
        }), DecoratedBox({
          decoration: new BoxDecoration({
            color: 'gray',
            boxShadow: [new BoxShadow({
              blurRadius: 10,
              offset: new Offset({
                x: 10,
                y: 10
              })
            }), new BoxShadow({
              blurRadius: 10,
              color: 'blue',
              offset: new Offset({
                x: -10,
                y: -10
              })
            })]
          }),
          child: SizedBox({
            width: 200,
            height: 200
          })
        })]
      })
    }),
    code: dedent\`import { Stack, BoxShadow, Offset, SizedBox, Center, BoxDecoration, DecoratedBox } from '@meursyphus/flitter';\\n\\n\\n\` + WithBoxShadowCode
  }
}`,...(G=(F=x.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};const oe=["Basic","Circle","InnerBorder","OuterBorder","WithBorderRadius","BorderTop","UnUniformBorder","WithBoxShadow"],he=Object.freeze(Object.defineProperty({__proto__:null,Basic:c,BorderTop:B,Circle:a,InnerBorder:s,OuterBorder:l,UnUniformBorder:p,WithBorderRadius:w,WithBoxShadow:x,__namedExportsOrder:oe,default:L},Symbol.toStringTag,{value:"Module"}));export{c as B,he as S};
