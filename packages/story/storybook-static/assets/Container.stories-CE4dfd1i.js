import{W as A}from"./Widget-B6WpeV_a.js";import{C as e,T as l,E as V,d as R,M as B,B as D,k as M,j as L}from"./Widget-Dxvrat1N.js";import{B as v}from"./box-decoration-BcTLV75v.js";import{d as t}from"./index-DrFu-skq.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./spread-CgU5AtxT.js";import"./_commonjsHelpers-Cpj98o6Y.js";const i=t`import { Container, Text, Alignment, EdgeInsets } from '@meursyphus/flitter';
\n\n`,Q={title:"Widget/Container",component:A,tags:["autodocs"],parameters:{docs:{description:{component:t`
                This is **Container** widget. 
                This widget motivated by Container in Flutter.

                <iframe width="560" height="315" src="https://www.youtube.com/embed/c1xLMaTUWCY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

                See: https://api.flutter.dev/flutter/widgets/Container-class.html

                ## Props
                ### width
                **Value: number | undefined**

                ### height
                **Value: number | undefined**

                ### color
                **Value: string** (default: **transparent**)

                This define background color of the container.

                ### margin
                **Value: EdgeInsets** (default: **EdgeInsets.all(0)**)

                ### padding
                **Value: EdgeInsets** (default: **EdgeInsets.all(0)**)

                ### Alignment
                **Value: Alignment | undefined**

                ### child
                **Value: Widget | undefined**
                `}}}},_=t`
    Container({
        color: 'lightblue'
    })
`,n={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue"}),code:i+_}},k=t`
    Container({
        color: 'lightblue',
        child: Text('text', { style: new TextStyle({ fontSize: 30 }) })
    })
`,r={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",child:l("text",{style:new L({fontSize:30})})}),code:i+k}},Y=t`
    Container({
        color: 'lightblue',
        width: 300,
        height: 300,
        padding: EdgeInsets.all(10),
        child: Container({
            color: 'green',
            child: Text('child in blue container')
        })
    })
`,o={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",width:300,height:300,padding:V.all(10),child:e({color:"green",child:l("child in blue container")})}),code:i+Y}},j=t`
    Container({
        color: 'lightblue',
        width: 300,
        height: 300,
        padding: EdgeInsets.all(10),
        alignment: Alignment.center,
        child: Container({
            color: 'green',
            child: Text('child')
        })
    })
`,a={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",width:300,height:300,padding:V.all(10),alignment:R.center,child:e({color:"green",child:l("child")})}),code:i+j}},F=t`
    Container({
        color: 'lightblue',
        width: 300,
        height: 300,
        transform: Matrix4.translationValues(10, 10, 0)
    })
`,d={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({color:"lightblue",width:300,height:300,transform:B.translationValues(10,10,0)}),code:i+F}},O=t`
        Container({
            color: 'lightblue',
            width: 300,
            height: 300,
            clipped: true,
            decoration: new BoxDecoration({
                borderRadius: BorderRadius.all(Radius.circular(20))
            }),
            alignment: Alignment.topLeft,
            child: Container({
                width: 100,
                height: 100,
                color: 'red'
            })
        }),
`,s={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:e({width:300,height:300,clipped:!0,decoration:new v({borderRadius:D.all(M.circular(20)),color:"lightblue"}),alignment:R.topLeft,child:e({width:100,height:100,color:"red"})}),code:i+O}};var h,c,g;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue'
    }),
    code: ImportWidgetCode + Case1Code
  }
}`,...(g=(c=n.parameters)==null?void 0:c.docs)==null?void 0:g.source}}};var p,u,m;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      color: 'lightblue',
      child: Text('text', {
        style: new TextStyle({
          fontSize: 30
        })
      })
    }),
    code: ImportWidgetCode + Case2Code
  }
}`,...(m=(u=r.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var w,C,x;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
      padding: EdgeInsets.all(10),
      child: Container({
        color: 'green',
        child: Text('child in blue container')
      })
    }),
    code: ImportWidgetCode + Case3Code
  }
}`,...(x=(C=o.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var f,b,S;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
      padding: EdgeInsets.all(10),
      alignment: Alignment.center,
      child: Container({
        color: 'green',
        child: Text('child')
      })
    }),
    code: ImportWidgetCode + Case4Code
  }
}`,...(S=(b=a.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var T,W,I;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
      transform: Matrix4.translationValues(10, 10, 0)
    }),
    code: ImportWidgetCode + WithTransformCode
  }
}`,...(I=(W=d.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var z,y,E;s.parameters={...s.parameters,docs:{...(z=s.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      width: 300,
      height: 300,
      clipped: true,
      decoration: new BoxDecoration({
        borderRadius: BorderRadius.all(Radius.circular(20)),
        color: 'lightblue'
      }),
      alignment: Alignment.topLeft,
      child: Container({
        width: 100,
        height: 100,
        color: 'red'
      })
    }),
    code: ImportWidgetCode + WithClipDecorationCode
  }
}`,...(E=(y=s.parameters)==null?void 0:y.docs)==null?void 0:E.source}}};const X=["Case1","Case2","Case3","Case4","WithTransform","WithClipDecoration"];export{n as Case1,r as Case2,o as Case3,a as Case4,s as WithClipDecoration,d as WithTransform,X as __namedExportsOrder,Q as default};
