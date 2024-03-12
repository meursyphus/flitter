import{W as A}from"./Widget-B6WpeV_a.js";import{d as n}from"./index-DrFu-skq.js";import{A as o,C as s,a as B,b as T,c as a,d as W}from"./Widget-Dxvrat1N.js";const S={title:"Widget/Align",component:A,argTypes:{}},z=n`
    Align({
        child: Container({
            width: 200,
            height: 200,
            color: 'orange'
        })
    })
`,t={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Container, Align, Alignment } from '@meursyphus/flitter'\n\n\n`+z,widget:o({child:s({width:200,height:200,color:"orange"})})}},y=n`
    ConstrainedBox({
        constraints: Constraints.tight({ width: 600, height: 300 }),
        child: Align({
            child: Container({
                width: 200,
                height: 200,
                color: 'orange'
            })
    })
`,i={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Container, Align, ConstrainedBox, Constraints } from '@meursyphus/flitter'\n\n\n`+y,widget:B({constraints:T.tight({width:600,height:300}),child:o({child:s({width:200,height:200,color:"orange"})})}),description:"This widget loosen parent constraints so child does not expand"}},b=n`
    ConstraintsTransformBox({
        constraintsTransform: ConstraintsTransformBox.unconstrained,
        alignment: Alignment.topLeft,
        child: Align({
            child: Container({
                width: 200,
                height: 200,
                color: 'orange'
            })
        })
    }),
`,e={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Container, Align, ConstraintsTransformBox, Alignment } from '@meursyphus/flitter'\n\n\n`+b,widget:a({constraintsTransform:a.unconstrained,alignment:W.topLeft,child:o({child:s({width:200,height:200,color:"orange"})})}),description:"Under unbounded constraints, This widget match its child size."}},F=n`
    Align({
        widthFactor: 2,
        heightFactor: 1.2,
        child: Container({
            width: 200,
            height: 200,
            color: 'orange'
        })
    }),
`,r={args:{ssrSize:{width:600,height:300},width:"600px",height:"300px",code:n`import { Container, Align } from '@meursyphus/flitter'\n\n\n`+F,widget:o({widthFactor:2,heightFactor:1.2,child:s({width:200,height:200,color:"orange"})}),description:n`
            With factorProps, This widget will match the size witch is multiplied child size by given factorProps
            It works regardless of boundedness
        `}};var d,h,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Align, Alignment } from '@meursyphus/flitter'\\n\\n\\n\` + BasicWidget,
    widget: Align({
      child: Container({
        width: 200,
        height: 200,
        color: 'orange'
      })
    })
  }
}`,...(c=(h=t.parameters)==null?void 0:h.docs)==null?void 0:c.source}}};var g,l,p;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Align, ConstrainedBox, Constraints } from '@meursyphus/flitter'\\n\\n\\n\` + ChildConstraintsBeLoosenedWidget,
    widget: ConstrainedBox({
      constraints: Constraints.tight({
        width: 600,
        height: 300
      }),
      child: Align({
        child: Container({
          width: 200,
          height: 200,
          color: 'orange'
        })
      })
    }),
    description: 'This widget loosen parent constraints so child does not expand'
  }
}`,...(p=(l=i.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,w,u;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Align, ConstraintsTransformBox, Alignment } from '@meursyphus/flitter'\\n\\n\\n\` + UnderUnconstrainedWidget,
    widget: ConstraintsTransformBox({
      constraintsTransform: ConstraintsTransformBox.unconstrained,
      alignment: Alignment.topLeft,
      child: Align({
        child: Container({
          width: 200,
          height: 200,
          color: 'orange'
        })
      })
    }),
    description: 'Under unbounded constraints, This widget match its child size.'
  }
}`,...(u=(w=e.parameters)==null?void 0:w.docs)==null?void 0:u.source}}};var C,f,x;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 600,
      height: 300
    },
    width: '600px',
    height: '300px',
    code: dedent\`import { Container, Align } from '@meursyphus/flitter'\\n\\n\\n\` + WithFactorPropsWidget,
    widget: Align({
      widthFactor: 2,
      heightFactor: 1.2,
      child: Container({
        width: 200,
        height: 200,
        color: 'orange'
      })
    }),
    description: dedent\`
            With factorProps, This widget will match the size witch is multiplied child size by given factorProps
            It works regardless of boundedness
        \`
  }
}`,...(x=(f=r.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const U=["Basic","ChildConstraintsBeLoosened","UnderUnconstrained","WithFactorProps"],v=Object.freeze(Object.defineProperty({__proto__:null,Basic:t,ChildConstraintsBeLoosened:i,UnderUnconstrained:e,WithFactorProps:r,__namedExportsOrder:U,default:S},Symbol.toStringTag,{value:"Module"}));export{t as B,v as S};
