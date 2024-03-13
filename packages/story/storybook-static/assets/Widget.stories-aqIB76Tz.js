import{W as p}from"./Widget-B6WpeV_a.js";import{d as s}from"./index-DrFu-skq.js";import{c as t,d as c,A as u,C as i}from"./Widget-Dxvrat1N.js";function f({alignment:d=c.center,clipped:h=!1,child:l,textDirection:g,constrainedAxis:e,key:m}){return t({alignment:d,child:l,clipped:h,textDirection:g,key:m,constraintsTransform:function(){if(e==null)return t.unconstrained;switch(e){case"vertical":return t.widthUnconstrained;case"horizontal":return t.heightUnconstrained}}()})}const w=s`import { Container, UnconstrainedBox, Align, Alignment } from '@meursyphus/flitter';
\n\n`,x={title:"Widget/UnconstrainedBox",component:p},A=s`
    Align({
        alignment: Alignment.center,
        child: Container({
            width: 200,
            height: 200,
            color: 'grey',
            child: UnconstrainedBox({
                constrainedAxis: 'horizontal',
                child: Container({
                    width: 50,
                    height: 50,
                    color: 'orange'
                })
            })
        })
    })
`,n={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:w+A,widget:u({alignment:c.center,child:i({width:200,height:200,color:"grey",child:f({constrainedAxis:"horizontal",child:i({width:50,height:50,color:"orange"})})})})}};var r,o,a;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: importWidgets + BasicWidget,
    widget: Align({
      alignment: Alignment.center,
      child: Container({
        width: 200,
        height: 200,
        color: 'grey',
        child: UnconstrainedBox({
          constrainedAxis: 'horizontal',
          child: Container({
            width: 50,
            height: 50,
            color: 'orange'
          })
        })
      })
    })
  }
}`,...(a=(o=n.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};const B=["Basic"],U=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,__namedExportsOrder:B,default:x},Symbol.toStringTag,{value:"Module"}));export{n as B,U as S};
