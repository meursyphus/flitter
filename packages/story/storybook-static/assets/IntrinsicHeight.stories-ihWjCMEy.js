import{u as c,z as a,b as d,y as l,W as g,C as t,d as m}from"./Widget-Dxvrat1N.js";import{R as p}from"./Row-Df4bPl7Z.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Flex-edvBr9RZ.js";class w extends c{createRenderObject(){return new u({isPainter:!1})}updateRenderObject(e){}}class u extends a{preformLayout(){if(this.child==null)return;const e=this.child.getIntrinsicHeight(this.constraints.maxWidth)||0,o=d.tightFor({height:e}).enforce(this.constraints);this.child.layout(o),this.size=this.child.size}}const x=l(w),b={title:"Widget/IntrinsicHeight",component:g,tags:["autodocs"],parameters:{layout:"fullscreen"}},n={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:t({width:1/0,height:1/0,alignment:m.center,color:"grey",child:x({child:p({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"stretch",children:[t({width:50,height:50,color:"red"}),t({width:50,height:200,color:"green"}),t({width:50,height:100,color:"blue"})]})})})}};var i,r,s;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    widget: Container({
      width: Infinity,
      height: Infinity,
      alignment: Alignment.center,
      color: 'grey',
      child: IntrinsicHeight({
        child: Row({
          mainAxisAlignment: 'spaceBetween',
          crossAxisAlignment: 'stretch',
          children: [Container({
            width: 50,
            height: 50,
            color: 'red'
          }), Container({
            width: 50,
            height: 200,
            color: 'green'
          }), Container({
            width: 50,
            height: 100,
            color: 'blue'
          })]
        })
      })
    })
  }
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const H=["Case1"];export{n as Case1,H as __namedExportsOrder,b as default};
