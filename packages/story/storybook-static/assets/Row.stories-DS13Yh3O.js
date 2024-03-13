import{W as Z}from"./Widget-B6WpeV_a.js";import{C as e,F as x,d as p,T as m,j as u}from"./Widget-Dxvrat1N.js";import{V as $}from"./Flex-edvBr9RZ.js";import{R as i}from"./Row-Df4bPl7Z.js";import{d as n}from"./index-DrFu-skq.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./spread-CgU5AtxT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const t=n`import { Row, Container, Flexible } from '@meursyphus/flitter';
\n\n`,be={title:"Widget/Row",component:Z,tags:["autodocs"],parameters:{docs:{description:{component:n`
                This is **Row** widget. 
                This widget motivated by Row in Flutter.
                
                >A widget that displays its children in a horizontal array.
                To cause a child to expand to fill the available horizontal space, wrap the child in an Expanded widget.
                The Row widget does not scroll (and in general it is considered an error to have more children in a Row than will fit in the available room). If you have a line of widgets and want them to be able to scroll if there is insufficient room, consider using a ListView.
                For a vertical variant, see Column.
                If you only have one child, then consider using Align or Center to position the child.

                See: https://api.flutter.dev/flutter/widgets/Row-class.html

                ## Props
                ### mainAxisAlignment 
                **Value: center | start | end | spaceBetween | spaceEven | spaceAround** (default: **start**)

                This prop defines the **horizontal** display of its children.

                ### crossAxisAlignment
                **Value: stretch | start | center | end** (default: **center**)

                This prop defines the **vertical** display of its children.

                ### children
                **value**: **Widget[]**
                `}}}},ee=n`
    Container({
        color: 'lightblue',
        child: Row({
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
    })
`,o={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({children:[e({width:50,height:50,color:"red"}),e({width:50,height:100,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ee}},ne=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'end',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'blue'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'green'
                })
            ]
        })
    })
`,r={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"end",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ne}},ie=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceBetween',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'blue'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'green'
                })
            ]
        })
    })
`,h={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ie}},te=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceEvenly',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'blue'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'green'
                })
            ]
        })
    })
`,l={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceEvenly",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+te}},oe=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceAround',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'blue'
                }),
                Container({
                    width: 50,
                    height: 50,
                    color: 'green'
                })
            ]
        })
    })
`,d={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceAround",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+oe}},re=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'center',
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
    })
`,c={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"center",children:[e({width:50,height:50,color:"red"}),e({width:50,height:100,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+re}},he=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'start',
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
    })
`,s={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"start",children:[e({width:50,height:50,color:"red"}),e({width:50,height:100,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+he}},le=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'end',
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
    })
`,a={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"end",children:[e({width:50,height:50,color:"red"}),e({width:50,height:100,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+le}},de=n`
    Container({
        color: 'lightblue',
        child: Row({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'stretch',
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
    })
`,g={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"stretch",children:[e({width:50,height:50,color:"red"}),e({width:50,height:100,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+de}},ce=n`
    Container({
        color: 'lightblue',
        child: Row({
            children: [
                Flexible({
                    child: Container({
                        width: 50,
                        height: 50,
                        color: 'red'
                    })
                }),
                Flexible({
                    child: Container({
                        width: 50,
                        height: 50,
                        color: 'blue'
                    })
                })
            ]
        })
    })
`,w={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({children:[x({child:e({width:50,height:50,color:"red"})}),x({fit:"tight",child:e({width:50,height:50,color:"blue"})})]})}),code:t+ce}},se=n`
        Container({
            color: 'lightblue',
            child: Row({
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
                        color: 'blue',
                        alignment: Alignment.center,
                        child: Text('2', { style: { fontColor: 'white', fontSize: '30px' } })
                    }),
                    Container({
                        width: 50,
                        height: 50,
                        color: 'green',
                        alignment: Alignment.center,
                        child: Text('3', { style: { fontColor: 'white', fontSize: '30px' } })
                    })
                ]
            })
        }),
`,C={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:t+se,widget:e({color:"lightblue",child:i({verticalDirection:$.up,children:[e({width:50,height:50,color:"red",alignment:p.center,child:m("1",{style:new u({color:"white",fontSize:30})})}),e({width:50,height:50,color:"blue",alignment:p.center,child:m("2",{style:new u({color:"white",fontSize:30})})}),e({width:50,height:50,color:"green",alignment:p.center,child:m("3",{style:new u({color:"white",fontSize:30})})})]})})}};var A,b,S;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
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
    }),
    code: ImportWidgetCode + Case1Code
  }
}`,...(S=(b=o.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var f,z,R;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'end',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'blue'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    }),
    code: ImportWidgetCode + Case2Code
  }
}`,...(R=(z=r.parameters)==null?void 0:z.docs)==null?void 0:R.source}}};var y,v,T;h.parameters={...h.parameters,docs:{...(y=h.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceBetween',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'blue'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    }),
    code: ImportWidgetCode + Case3Code
  }
}`,...(T=(v=h.parameters)==null?void 0:v.docs)==null?void 0:T.source}}};var B,W,I;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceEvenly',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'blue'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    }),
    code: ImportWidgetCode + Case4Code
  }
}`,...(I=(W=l.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var V,D,F;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceAround',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 50,
          height: 50,
          color: 'blue'
        }), Container({
          width: 50,
          height: 50,
          color: 'green'
        })]
      })
    }),
    code: ImportWidgetCode + Case5Code
  }
}`,...(F=(D=d.parameters)==null?void 0:D.docs)==null?void 0:F.source}}};var _,E,j;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'center',
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
    }),
    code: ImportWidgetCode + Case6Code
  }
}`,...(j=(E=c.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var L,O,P;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'start',
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
    }),
    code: ImportWidgetCode + Case7Code
  }
}`,...(P=(O=s.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};var k,q,G;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'end',
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
    }),
    code: ImportWidgetCode + Case8Code
  }
}`,...(G=(q=a.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var H,J,K;g.parameters={...g.parameters,docs:{...(H=g.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'stretch',
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
    }),
    code: ImportWidgetCode + Case9Code
  }
}`,...(K=(J=g.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var M,N,Q;w.parameters={...w.parameters,docs:{...(M=w.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Row({
        children: [Flexible({
          child: Container({
            width: 50,
            height: 50,
            color: 'red'
          })
        }), Flexible({
          fit: 'tight',
          child: Container({
            width: 50,
            height: 50,
            color: 'blue'
          })
        })]
      })
    }),
    code: ImportWidgetCode + Case10Code
  }
}`,...(Q=(N=w.parameters)==null?void 0:N.docs)==null?void 0:Q.source}}};var U,X,Y;C.parameters={...C.parameters,docs:{...(U=C.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: ImportWidgetCode + VerticalDirection_upCode,
    widget: Container({
      color: 'lightblue',
      child: Row({
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
          color: 'blue',
          alignment: Alignment.center,
          child: Text('2', {
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
          child: Text('3', {
            style: new TextStyle({
              color: 'white',
              fontSize: 30
            })
          })
        })]
      })
    })
  }
}`,...(Y=(X=C.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};const Se=["Case1","Case2","Case3","Case4","Case5","Case6","Case7","Case8","Case9","Case10","VerticalDirection_up"];export{o as Case1,w as Case10,r as Case2,h as Case3,l as Case4,d as Case5,c as Case6,s as Case7,a as Case8,g as Case9,C as VerticalDirection_up,Se as __namedExportsOrder,be as default};
