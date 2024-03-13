import{W as b}from"./Widget-B6WpeV_a.js";import{d as n}from"./index-DrFu-skq.js";import{C as t,n as i,o as e,j as C,p as H,a as v,b as _,q as j,r as M}from"./Widget-Dxvrat1N.js";import{C as r}from"./Center-BPlvJyPx.js";const q={title:"Widget/RichText",component:b},k=n`
        Center({
            child: Container({
                color: 'orange',
                child: RichText({
                    text: new TextSpan({
                        text: 'Rich Text!!'
                    })
                })
            })
        })
`,o={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Container, Center } from '@meursyphus/flitter'\n\n\n`+k,widget:r({child:t({color:"orange",child:i({text:new e({text:"Rich Text!!"})})})})}},a={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",child:i({text:new e({text:"Text1 ",style:new C({color:"white"}),children:[new e({text:"Text2 ",style:new C({fontSize:24})}),new e({text:"Text3",style:new C({inherit:!1})})]})})})}),code:n`
        import { Container, Center, RichTExt, TextSpan, TextStyle } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                child: RichText({
                    text: new TextSpan({
                        text: 'Text1 ',
                        style: new TextStyle({
                            color: 'white'
                        }),
                        children: [
                            new TextSpan({
                                text: 'Text2 ',
                                style: new TextStyle({
                                    fontSize: 24,
                                })
                            }),
                            new TextSpan({
                                text: 'Text3',
                                style: new TextStyle({
                                    inherit: false
                                })
                            })
                        ]
                    })
                })
            })
        }),
            `}},h={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",width:300,child:i({textAlign:H.center,text:new e({text:"Align Center"})})})}),code:n`
        import { Container, Center, RichText, TextAlign, TextSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: RichText({
                    textAlign: TextAlign.center,
                    text: new TextSpan({
                        text: 'Align Center'
                    })
                })
            })
        }),
            `}},s={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",width:300,child:v({constraints:new _({maxWidth:300}),child:i({text:new e({text:"[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING"})})})})}),code:n`
        import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: ConstrainedBox({
                    constraints: new Constraints({ maxWidth: 300 }),
                    child: RichText({
                        text: new TextSpan({
                            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
                        })
                    })
                })
            })
        }),
            `}},x={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",child:v({constraints:new _({maxWidth:300}),child:i({textWidthBasis:j.longestLine,text:new e({text:"[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING"})})})})}),code:n`
        import { TextWidthBasis, RichText, Container, Center, ConstrainedBox, Constraints } from '@meursyphus/flitter'

        Center({ 
            child: Container({
                color: 'orange',
                child: ConstrainedBox({
                    constraints: new Constraints({ maxWidth: 300 }),
                    child: RichText({
                        textWidthBasis: TextWidthBasis.longestLine,
                        text: new TextSpan({
                            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
                        })
                    })
                })
            })
        }),
            `}},d={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",width:100,height:100,child:i({overflow:M.clip,text:new e({text:"[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트"})})})}),code:n`
        import { Container, Center, RichText, TextOverflow, TExtSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 100,
                height: 100,
                child: RichText({
                    overflow: TextOverflow.clip,
                    text: new TextSpan({
                        text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
                    })
                })
            })
        }),
            `}},c={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",width:300,child:i({softWrap:!1,text:new e({text:"[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트"})})})}),code:n`import { Container, Center, RichText, TextSpan } from '@meursyphus/flitter'
            
        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: RichText({
                    softWrap: false,
                    text: new TextSpan({
                        text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
                    })
                })
            })
        })
    `}},l={storyName:`Line Change At 
`,args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:r({child:t({color:"orange",child:i({text:new e({text:`Hello
Line Changed!!`})})})}),code:n`
import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

Center({
    child: Container({
        color: 'orange',
        width: 300,
        child: ConstrainedBox({
            constraints: new Constraints({ maxWidth: 300 }),
            child: RichText({
                text: new TextSpan({
                    text: Hello\\n\ Line Changed!!'
                })
            })
        })
    })
})
        `}};var p,T,g;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Center } from '@meursyphus/flitter'\\n\\n\\n\` + BasicWidget,
    widget: Center({
      child: Container({
        color: 'orange',
        child: RichText({
          text: new TextSpan({
            text: 'Rich Text!!'
          })
        })
      })
    })
  }
}`,...(g=(T=o.parameters)==null?void 0:T.docs)==null?void 0:g.source}}};var u,w,S;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        child: RichText({
          text: new TextSpan({
            text: 'Text1 ',
            style: new TextStyle({
              color: 'white'
            }),
            children: [new TextSpan({
              text: 'Text2 ',
              style: new TextStyle({
                fontSize: 24
              })
            }), new TextSpan({
              text: 'Text3',
              style: new TextStyle({
                inherit: false
              })
            })]
          })
        })
      })
    }),
    code: dedent\`
        import { Container, Center, RichTExt, TextSpan, TextStyle } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                child: RichText({
                    text: new TextSpan({
                        text: 'Text1 ',
                        style: new TextStyle({
                            color: 'white'
                        }),
                        children: [
                            new TextSpan({
                                text: 'Text2 ',
                                style: new TextStyle({
                                    fontSize: 24,
                                })
                            }),
                            new TextSpan({
                                text: 'Text3',
                                style: new TextStyle({
                                    inherit: false
                                })
                            })
                        ]
                    })
                })
            })
        }),
            \`
  }
}`,...(S=(w=a.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var L,A,m;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        width: 300,
        child: RichText({
          textAlign: TextAlign.center,
          text: new TextSpan({
            text: 'Align Center'
          })
        })
      })
    }),
    code: dedent\`
        import { Container, Center, RichText, TextAlign, TextSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: RichText({
                    textAlign: TextAlign.center,
                    text: new TextSpan({
                        text: 'Align Center'
                    })
                })
            })
        }),
            \`
  }
}`,...(m=(A=h.parameters)==null?void 0:A.docs)==null?void 0:m.source}}};var P,E,B;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        width: 300,
        child: ConstrainedBox({
          constraints: new Constraints({
            maxWidth: 300
          }),
          child: RichText({
            text: new TextSpan({
              text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
            })
          })
        })
      })
    }),
    code: dedent\`
        import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: ConstrainedBox({
                    constraints: new Constraints({ maxWidth: 300 }),
                    child: RichText({
                        text: new TextSpan({
                            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
                        })
                    })
                })
            })
        }),
            \`
  }
}`,...(B=(E=s.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};var f,I,N;x.parameters={...x.parameters,docs:{...(f=x.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        child: ConstrainedBox({
          constraints: new Constraints({
            maxWidth: 300
          }),
          child: RichText({
            textWidthBasis: TextWidthBasis.longestLine,
            text: new TextSpan({
              text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
            })
          })
        })
      })
    }),
    code: dedent\`
        import { TextWidthBasis, RichText, Container, Center, ConstrainedBox, Constraints } from '@meursyphus/flitter'

        Center({ 
            child: Container({
                color: 'orange',
                child: ConstrainedBox({
                    constraints: new Constraints({ maxWidth: 300 }),
                    child: RichText({
                        textWidthBasis: TextWidthBasis.longestLine,
                        text: new TextSpan({
                            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪EP.07 CLEANING'
                        })
                    })
                })
            })
        }),
            \`
  }
}`,...(N=(I=x.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var y,R,W;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        width: 100,
        height: 100,
        child: RichText({
          overflow: TextOverflow.clip,
          text: new TextSpan({
            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
          })
        })
      })
    }),
    code: dedent\`
        import { Container, Center, RichText, TextOverflow, TExtSpan } from '@meursyphus/flitter'

        Center({
            child: Container({
                color: 'orange',
                width: 100,
                height: 100,
                child: RichText({
                    overflow: TextOverflow.clip,
                    text: new TextSpan({
                        text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
                    })
                })
            })
        }),
            \`
  }
}`,...(W=(R=d.parameters)==null?void 0:R.docs)==null?void 0:W.source}}};var Y,O,D;c.parameters={...c.parameters,docs:{...(Y=c.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        width: 300,
        child: RichText({
          softWrap: false,
          text: new TextSpan({
            text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
          })
        })
      })
    }),
    code: dedent\`import { Container, Center, RichText, TextSpan } from '@meursyphus/flitter'
            
        Center({
            child: Container({
                color: 'orange',
                width: 300,
                child: RichText({
                    softWrap: false,
                    text: new TextSpan({
                        text: '[PLAYLIST] EP.07 CLEANING BLUES POP PLAYLIST⎪청소할 때 듣기 좋은 블루스 팝 플레이리스트'
                    })
                })
            })
        })
    \`
  }
}`,...(D=(O=c.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};var G,z,U;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
  storyName: 'Line Change At \\n',
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Center({
      child: Container({
        color: 'orange',
        child: RichText({
          text: new TextSpan({
            text: 'Hello\\nLine Changed!!'
          })
        })
      })
    }),
    code: dedent\`
import { Container, Center, ConstrainedBox, RichText, TextSpan } from '@meursyphus/flitter'

Center({
    child: Container({
        color: 'orange',
        width: 300,
        child: ConstrainedBox({
            constraints: new Constraints({ maxWidth: 300 }),
            child: RichText({
                text: new TextSpan({
                    text: Hello\\\\n\\ Line Changed!!'
                })
            })
        })
    })
})
        \`
  }
}`,...(U=(z=l.parameters)==null?void 0:z.docs)==null?void 0:U.source}}};const F=["Basic","WidthChildren","TextAlignCenter","MultiLine","TextWidthBasisLongestLine","Clipped","NoWrapped","LineChangeAtN"],X=Object.freeze(Object.defineProperty({__proto__:null,Basic:o,Clipped:d,LineChangeAtN:l,MultiLine:s,NoWrapped:c,TextAlignCenter:h,TextWidthBasisLongestLine:x,WidthChildren:a,__namedExportsOrder:F,default:q},Symbol.toStringTag,{value:"Module"}));export{o as B,X as S};
