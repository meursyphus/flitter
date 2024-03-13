import{u as c,z as a,b as d,y as l,W as g,C as n,d as m}from"./Widget-Dxvrat1N.js";import{C as p}from"./Column-BDxz2XB9.js";import"./index-CLMXyYHN.js";import"./lifecycle-VEl8UHsD.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./Flex-edvBr9RZ.js";class u extends c{createRenderObject(){return new w({isPainter:!1})}updateRenderObject(i){}}class w extends a{preformLayout(){if(this.child==null)return;const i=this.child.getIntrinsicWidth(this.constraints.maxHeight)||0,o=d.tightFor({width:i}).enforce(this.constraints);this.child.layout(o),this.size=this.child.size}}const C=l(u),b={title:"Widget/IntrinsicWidth",component:g,tags:["autodocs"],parameters:{layout:"fullscreen"}},t={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",widget:n({width:1/0,height:1/0,alignment:m.center,color:"grey",child:C({child:p({mainAxisAlignment:"spaceBetween",crossAxisAlignment:"stretch",children:[n({height:50,width:50,color:"red"}),n({height:50,width:200,color:"green"}),n({height:50,width:100,color:"blue"})]})})})}};var e,r,s;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
      child: IntrinsicWidth({
        child: Column({
          mainAxisAlignment: 'spaceBetween',
          crossAxisAlignment: 'stretch',
          children: [Container({
            height: 50,
            width: 50,
            color: 'red'
          }), Container({
            height: 50,
            width: 200,
            color: 'green'
          }), Container({
            height: 50,
            width: 100,
            color: 'blue'
          })]
        })
      })
    })
  }
}`,...(s=(r=t.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const z=["Case1"];export{t as Case1,z as __namedExportsOrder,b as default};
