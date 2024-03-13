import{W as j}from"./Widget-B6WpeV_a.js";import{d as n}from"./index-DrFu-skq.js";import{C as i,F as a,d,T as g,j as m}from"./Widget-Dxvrat1N.js";import{F as e,A as t,M as W,V as O,a as v,C as R}from"./Flex-edvBr9RZ.js";const E={code:n`
  import { Flex, Container, Axis } from '@meursyphus/flitter'

  Container({
		color: 'lightblue',
		child: Flex({
			direction: Axis.vertical,
			children: [
				Container({
					width: 50,
					height: 50,
					color: 'red'
				}),
				Container({
					width: 50,
					height: 100,
					color: 'blue'
				}),
				Container({
					width: 50,
					height: 50,
					color: 'green'
				})
			]
		})
  `,widget:i({color:"lightblue",child:e({direction:t.vertical,children:[i({width:50,height:50,color:"red"}),i({width:50,height:100,color:"blue"}),i({width:50,height:50,color:"green"})]})})},P={title:"Widget/Flex",component:j,args:{ssrSize:{width:600,height:300},width:"600px",height:"300px"}},$=n`
    Center({
        child: FractionallySizedBox({
            widthFactor: 0.5,
            heightFactor: 0.5,
            child: Container({
                color: 'orange'
            })
        })
    })
`,r={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Flex, Container, Axis } from '@meursyphus/flitter'\n\n\n`+$,widget:i({color:"lightblue",child:e({direction:t.horizontal,children:[i({width:50,height:50,color:"red"}),i({width:50,height:100,color:"blue"}),i({width:50,height:50,color:"green"})]})})}},o={args:E},k=n`
        Container({
            color: 'lightblue',
            child: Flex({
                direction: Axis.horizontal,
                mainAxisSize: MainAxisSize.min,
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green'
                    })
                ]
            })
        })
`,h={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Flex, Container, Axis } from '@meursyphus/flitter'\n\n\n`+k,widget:i({color:"lightblue",child:e({direction:t.horizontal,mainAxisSize:W.min,children:[a({child:i({width:50,height:50,color:"red"})}),a({child:i({width:50,height:50,color:"green"})})]})})}},q=n`
        Container({
            color: 'lightblue',
            child: Flex({
                direction: Axis.horizontal,
                verticalDirection: VerticalDirection.up,
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'red',
                        alignment: Alignment.center,
                        child: Text('1', { style: { fontColor: 'white', fontSize: '30px' } })
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green',
                        alignment: Alignment.center,
                        child: Text('2', { style: { fontColor: 'white', fontSize: '30px' } })
                    })
                ]
            })
        })
`,l={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Flex, Container, Axis, VerticalDireciton, Text, Alignment } from '@meursyphus/flitter'\n\n\n`+q,widget:i({color:"lightblue",child:e({direction:t.horizontal,verticalDirection:O.up,children:[i({width:50,height:50,color:"red",alignment:d.center,child:g("1",{style:new m({color:"white",fontSize:30})})}),i({width:50,height:50,color:"green",alignment:d.center,child:g("2",{style:new m({color:"white",fontSize:30})})})]})})}},G=n`
        Container({
            color: 'lightblue',
            child: Flex({
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green'
                    })
                ]
            })
        })
`,s={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Flex, Container, Axis } from '@meursyphus/flitter'\n\n\n`+G,widget:i({color:"lightblue",child:e({direction:t.horizontal,mainAxisAlignment:v.center,children:[i({width:50,height:50,color:"red"}),i({width:50,height:50,color:"green"})]})})}},c={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:i({color:"lightblue",width:300,height:300,child:e({direction:t.horizontal,mainAxisAlignment:v.spaceBetween,mainAxisSize:W.min,crossAxisAlignment:R.end,children:[i({width:50,height:50,color:"red"}),i({width:50,height:50,color:"green"})]})}),code:n`
        import { Flex, Container, Axis, CrossAxisAlignment, MainAxisAlignment, MainAxisSize } from '@meursyphus/flitter;

        Container({
            color: 'lightblue',
            width: 300,
            height: 300,
            child: Flex({
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green'
                    })
                ]
            })
            `}};var x,A,w;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Flex, Container, Axis } from '@meursyphus/flitter'\\n\\n\\n\` + BasicWidget,
    widget: Container({
      color: 'lightblue',
      child: Flex({
        direction: Axis.horizontal,
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 100,
          color: 'blue'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    })
  }
}`,...(w=(A=r.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var p,u,C;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: Examples.Column
}`,...(C=(u=o.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var z,S,f;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Flex, Container, Axis } from '@meursyphus/flitter'\\n\\n\\n\` + MainAxisSize_minCode,
    widget: Container({
      color: 'lightblue',
      child: Flex({
        direction: Axis.horizontal,
        mainAxisSize: MainAxisSize.min,
        children: [Flexible({
          child: Container({
            width: 50,
            height: 50,
            color: 'red'
          })
        }), Flexible({
          child: Container({
            width: 50,
            height: 50,
            color: 'green'
          })
        })]
      })
    })
  }
}`,...(f=(S=h.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var F,b,M;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Flex, Container, Axis, VerticalDireciton, Text, Alignment } from '@meursyphus/flitter'\\n\\n\\n\` + VerticalDirection_upCode,
    widget: Container({
      color: 'lightblue',
      child: Flex({
        direction: Axis.horizontal,
        verticalDirection: VerticalDirection.up,
        children: [Container({
          width: 50,
          height: 50,
          color: 'red',
          alignment: Alignment.center,
          child: Text('1', {
            style: new TextStyle({
              color: 'white',
              fontSize: 30
            })
          })
        }), Container({
          width: 50,
          height: 50,
          color: 'green',
          alignment: Alignment.center,
          child: Text('2', {
            style: new TextStyle({
              color: 'white',
              fontSize: 30
            })
          })
        })]
      })
    })
  }
}`,...(M=(b=l.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var y,_,T;s.parameters={...s.parameters,docs:{...(y=s.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Flex, Container, Axis } from '@meursyphus/flitter'\\n\\n\\n\` + MainAxisAlignment_centerCode,
    widget: Container({
      color: 'lightblue',
      child: Flex({
        direction: Axis.horizontal,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    })
  }
}`,...(T=(_=s.parameters)==null?void 0:_.docs)==null?void 0:T.source}}};var D,V,B;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      width: 300,
      height: 300,
      child: Flex({
        direction: Axis.horizontal,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    }),
    code: dedent\`
        import { Flex, Container, Axis, CrossAxisAlignment, MainAxisAlignment, MainAxisSize } from '@meursyphus/flitter;

        Container({
            color: 'lightblue',
            width: 300,
            height: 300,
            child: Flex({
                direction: Axis.horizontal,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                    Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green'
                    })
                ]
            })
            \`
  }
}`,...(B=(V=c.parameters)==null?void 0:V.docs)==null?void 0:B.source}}};const H=["Row","Column","MainAxisSize_min","VerticalDirection_up","MainAxisAlignment_center","WithConstraintsTight"],N=Object.freeze(Object.defineProperty({__proto__:null,Column:o,MainAxisAlignment_center:s,MainAxisSize_min:h,Row:r,VerticalDirection_up:l,WithConstraintsTight:c,__namedExportsOrder:H,default:P},Symbol.toStringTag,{value:"Module"}));export{r as R,N as S};
