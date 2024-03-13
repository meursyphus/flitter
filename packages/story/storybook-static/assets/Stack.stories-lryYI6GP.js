import{W}from"./Widget-B6WpeV_a.js";import{C as n,d as t,S as i,i as a,s as b}from"./Widget-Dxvrat1N.js";import{d as e}from"./index-DrFu-skq.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./spread-CgU5AtxT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const r=e`import { Container, Alignment, Stack, Positioned } from '@meursyphus/flitter';
\n\n`,L={title:"Widget/Stack",component:W,tags:["autodocs"],parameters:{docs:{description:{component:e`
                    This is **Stack** widget. 
                    This widget motivated by Stack in Flutter.

                    <iframe width="560" height="315" src="https://www.youtube.com/embed/liEGSeD3Zt8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

                    See: https://api.flutter.dev/flutter/widgets/Stack-class.html

                    ### alignment

                    **Value: Alignment**(default: **Alignment.topLeft**)

                    ### clipped

                    **Value: boolean**(default: **true**)

                    ### sizing

                    **Value: StackFit**(default: **StackFit.loose**)

                    ### children

                    **Value: Widget[]**
                    `}}}},z=e`
    Container({
        color: 'lightgrey',
        alignment: Alignment.center,
        child: Stack({
            children: [
                Container({
                    width: 100,
                    height: 100,
                    color: 'green'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                })
            ]
        })
    })
`,o={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({color:"lightgrey",width:1/0,height:1/0,alignment:t.center,child:i({children:[n({width:100,height:100,color:"green"}),n({width:50,height:50,color:"red"})]})}),code:r+z}},F=e`
    Container({
        color: 'lightgrey',
        width: Infinity,
        height: Infinity,
        alignment: Alignment.center,
        child: Stack({
            children: [
                Container({
                    width: 100,
                    height: 100,
                    color: 'green'
                }),
                Positioned({
                    bottom: 0,
                    right: 0,
                    child: Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    })
                })
            ]
        })
    })
`,h={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({color:"lightgrey",width:1/0,height:1/0,alignment:t.center,child:i({children:[n({width:100,height:100,color:"green"}),a({bottom:0,right:0,child:n({width:50,height:50,color:"red"})})]})}),code:r+F}},E=e`
        Container({
            color: 'lightgrey',
            width: Infinity,
            height: Infinity,
            alignment: Alignment.center,
            child: Stack({
                children: [
                    Positioned({
                        top: 0,
                        left: 0,
                        child: Container({
                            width: 100,
                            height: 100,
                            color: 'green'
                        })
                    }),
                    Positioned({
                        top: 0,
                        left: 0,
                        child: Container({
                            width: 50,
                            height: 50,
                            color: 'red'
                        })
                    })
                ]
            })
        }),
`,d={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({color:"lightgrey",width:1/0,height:1/0,alignment:t.center,child:i({children:[a({top:0,left:0,child:n({width:100,height:100,color:"green"})}),a({top:0,left:0,child:n({width:50,height:50,color:"red"})})]})}),code:r+E}},N=e`
        Container({
            color: 'lightgrey',
            width: Infinity,
            height: Infinity,
            alignment: Alignment.center,
            child: Stack({
                fit: StackFit.expand,
                children: [
                    Container({
                        width: 0,
                        height: 0,
                        color: 'green'
                    })
                ]
            })
        }),
`,c={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({color:"lightgrey",width:1/0,height:1/0,alignment:t.center,child:i({fit:b.expand,children:[n({width:0,height:0,color:"green"})]})}),code:r+N}},V=e`
    Container({
        color: 'lightgrey',
        width: Infinity,
        height: Infinity,
        alignment: Alignment.center,
        child: Stack({
            alignment: Alignment.center,
            children: [
                Container({
                    width: 100,
                    height: 100,
                    color: 'green'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                })
            ]
        })
    }),
`,g={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({color:"lightgrey",width:1/0,height:1/0,alignment:t.center,child:i({alignment:t.center,children:[n({width:100,height:100,color:"green"}),n({width:50,height:50,color:"red"})]})}),code:r+V}};var l,s,m;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightgrey',
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: Stack({
        children: [Container({
          width: 100,
          height: 100,
          color: 'green'
        }), Container({
          width: 50,
          height: 50,
          color: 'red'
        })]
      })
    }),
    code: ImportWidgetCode + Case1Code
  }
}`,...(m=(s=o.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};var p,w,C;h.parameters={...h.parameters,docs:{...(p=h.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightgrey',
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: Stack({
        children: [Container({
          width: 100,
          height: 100,
          color: 'green'
        }), Positioned({
          bottom: 0,
          right: 0,
          child: Container({
            width: 50,
            height: 50,
            color: 'red'
          })
        })]
      })
    }),
    code: ImportWidgetCode + Case2Code
  }
}`,...(C=(w=h.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var f,y,u;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightgrey',
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: Stack({
        children: [Positioned({
          top: 0,
          left: 0,
          child: Container({
            width: 100,
            height: 100,
            color: 'green'
          })
        }), Positioned({
          top: 0,
          left: 0,
          child: Container({
            width: 50,
            height: 50,
            color: 'red'
          })
        })]
      })
    }),
    code: ImportWidgetCode + WithoutNonPositionedCode
  }
}`,...(u=(y=d.parameters)==null?void 0:y.docs)==null?void 0:u.source}}};var S,I,x;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightgrey',
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: Stack({
        fit: StackFit.expand,
        children: [Container({
          width: 0,
          height: 0,
          color: 'green'
        })]
      })
    }),
    code: ImportWidgetCode + FitExpandCode
  }
}`,...(x=(I=c.parameters)==null?void 0:I.docs)==null?void 0:x.source}}};var k,A,P;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightgrey',
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      child: Stack({
        alignment: Alignment.center,
        children: [Container({
          width: 100,
          height: 100,
          color: 'green'
        }), Container({
          width: 50,
          height: 50,
          color: 'red'
        })]
      })
    }),
    code: ImportWidgetCode + AlignmentCenterCode
  }
}`,...(P=(A=g.parameters)==null?void 0:A.docs)==null?void 0:P.source}}};const O=["Basic","HasPositioned","WithoutNonPositioned","FitExpand","AlignmentCenter"];export{g as AlignmentCenter,o as Basic,c as FitExpand,h as HasPositioned,d as WithoutNonPositioned,O as __namedExportsOrder,L as default};
