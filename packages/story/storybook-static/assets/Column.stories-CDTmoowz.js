import{W as ie}from"./Widget-B6WpeV_a.js";import{C as e,F as A,d as p,T as u,j as x}from"./Widget-Dxvrat1N.js";import{V as te}from"./Flex-edvBr9RZ.js";import{C as i}from"./Column-BDxz2XB9.js";import{d as n}from"./index-DrFu-skq.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./spread-CgU5AtxT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const t=n`import { Column, Container, Flexible } from '@meursyphus/flitter';
\n\n`,ve={title:"Widget/Column",component:ie,tags:["autodocs"],parameters:{docs:{description:{component:n`
                This is **Column** widget. 
                This widget motivated by Column in Flutter.
                
                >To cause a child to expand to fill the available vertical space, wrap the child in an Expanded widget.
                The Column widget does not scroll (and in general it is considered an error to have more children in a Column than will fit in the available room). If you have a line of widgets and want them to be able to scroll if there is insufficient room, consider using a ListView.
                For a horizontal variant, see Column.
                If you only have one child, then consider using Align or Center to position the child.

                See: https://api.flutter.dev/flutter/widgets/Column-class.html

                ## Props
                ### mainAxisAlignment 
                **Value: center | start | end | spaceBetween | spaceEven | spaceAround** (default: **start**)

                This prop defines the **vertical** display of its children.

                ### crossAxisAlignment
                **Value: stretch | start | center | end** (default: **center**)

                This prop defines the **horizontal** display of its children.

                ### children
                **value**: **Widget[]**
                `}}}},oe=n`
    Container({
        color: 'lightblue',
        child: Column({
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 100,
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
`,o={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({children:[e({width:50,height:50,color:"red"}),e({width:100,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+oe}},re=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,r={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"end",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+re}},he=n`
        Container({
            color: 'lightblue',
            child: Column({
                mainAxisAlignment: 'center',
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
        }),
`,h={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"center",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+he}},le=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,l={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+le}},de=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,d={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceEvenly",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+de}},ce=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,c={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceAround",children:[e({width:50,height:50,color:"red"}),e({width:50,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ce}},se=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,s={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"center",children:[e({width:50,height:50,color:"red"}),e({width:100,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+se}},ae=n`
    Container({
        color: 'lightblue',
        child: Column({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'start',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 100,
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
`,a={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"start",children:[e({width:50,height:50,color:"red"}),e({width:100,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ae}},ge=n`
    Container({
        color: 'lightblue',
        child: Column({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'end',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 100,
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
`,g={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"end",children:[e({width:50,height:50,color:"red"}),e({width:100,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+ge}},we=n`
    Container({
        color: 'lightblue',
        child: Column({
            mainAxisAlignment: 'spaceBetween',
            crossAxisAlignment: 'stretch',
            children: [
                Container({
                    width: 50,
                    height: 50,
                    color: 'red'
                }),
                Container({
                    width: 100,
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
`,w={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"stretch",children:[e({width:50,height:50,color:"red"}),e({width:100,height:50,color:"blue"}),e({width:50,height:50,color:"green"})]})}),code:t+we}},Ce=n`
    Container({
        color: 'lightblue',
        child: Column({
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
`,C={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:i({children:[A({child:e({width:50,height:50,color:"red"})}),A({fit:"tight",child:e({width:50,height:50,color:"blue"})})]})}),code:t+Ce}},me=n`
        Container({
            color: 'lightblue',
            child: Column({
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
`,m={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:t+me,widget:e({color:"lightblue",child:i({verticalDirection:te.up,children:[e({width:50,height:50,color:"red",alignment:p.center,child:u("1",{style:new x({color:"white",fontSize:30})})}),e({width:50,height:50,color:"blue",alignment:p.center,child:u("2",{style:new x({color:"white",fontSize:30})})}),e({width:50,height:50,color:"green",alignment:p.center,child:u("3",{style:new x({color:"white",fontSize:30})})})]})})}};var b,S,f;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 100,
          height: 50,
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
}`,...(f=(S=o.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var z,y,v;r.parameters={...r.parameters,docs:{...(z=r.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
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
}`,...(v=(y=r.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var T,W,B;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        mainAxisAlignment: 'center',
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
    code: ImportWidgetCode + MainAxisAlignment_centerCode
  }
}`,...(B=(W=h.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};var I,V,_;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
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
}`,...(_=(V=l.parameters)==null?void 0:V.docs)==null?void 0:_.source}}};var D,F,E;d.parameters={...d.parameters,docs:{...(D=d.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
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
}`,...(E=(F=d.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var M,j,L;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
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
}`,...(L=(j=c.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var O,P,k;s.parameters={...s.parameters,docs:{...(O=s.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'center',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 100,
          height: 50,
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
}`,...(k=(P=s.parameters)==null?void 0:P.docs)==null?void 0:k.source}}};var q,G,H;a.parameters={...a.parameters,docs:{...(q=a.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'start',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 100,
          height: 50,
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
}`,...(H=(G=a.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,K,N;g.parameters={...g.parameters,docs:{...(J=g.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'end',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 100,
          height: 50,
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
}`,...(N=(K=g.parameters)==null?void 0:K.docs)==null?void 0:N.source}}};var Q,R,U;w.parameters={...w.parameters,docs:{...(Q=w.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
        mainAxisAlignment: 'spaceBetween',
        crossAxisAlignment: 'stretch',
        children: [Container({
          width: 50,
          height: 50,
          color: 'red'
        }), Container({
          width: 100,
          height: 50,
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
}`,...(U=(R=w.parameters)==null?void 0:R.docs)==null?void 0:U.source}}};var X,Y,Z;C.parameters={...C.parameters,docs:{...(X=C.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Column({
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
}`,...(Z=(Y=C.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var $,ee,ne;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
      child: Column({
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
}`,...(ne=(ee=m.parameters)==null?void 0:ee.docs)==null?void 0:ne.source}}};const Te=["Case1","Case2","MainAxisAlignment_center","Case3","Case4","Case5","Case6","Case7","Case8","Case9","Case10","VerticalDirection_up"];export{o as Case1,C as Case10,r as Case2,l as Case3,d as Case4,c as Case5,s as Case6,a as Case7,g as Case8,w as Case9,h as MainAxisAlignment_center,m as VerticalDirection_up,Te as __namedExportsOrder,ve as default};
