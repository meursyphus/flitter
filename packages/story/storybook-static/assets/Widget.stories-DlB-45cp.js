var H=Object.defineProperty;var f=(n,e,i)=>e in n?H(n,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[e]=i;var t=(n,e,i)=>(f(n,typeof e!="symbol"?e+"":e,i),i);import{W as p}from"./Widget-B6WpeV_a.js";import{d as c}from"./index-DrFu-skq.js";import{u as _,d as s,v as w,w as y,b as B,y as S,A,C as g,h as C}from"./Widget-Dxvrat1N.js";class O extends _{constructor({maxHeight:i,maxWidth:m,minHeight:r,minWidth:a,alignment:d=s.center,child:W,key:u}){super({child:W,key:u});t(this,"minWidth");t(this,"maxWidth");t(this,"minHeight");t(this,"maxHeight");t(this,"alignment");this.maxHeight=i,this.maxWidth=m,this.minHeight=r,this.minWidth=a,this.alignment=d}createRenderObject(){return new v({alignment:this.alignment,maxHeight:this.maxHeight,maxWidth:this.maxWidth,minHeight:this.minHeight,minWidth:this.minWidth})}updateRenderObject(i){i.maxHeight=this.maxHeight,i.maxWidth=this.maxWidth,i.minHeight=this.minHeight,i.minWidth=this.minWidth}}class v extends w{constructor({maxHeight:i,maxWidth:m,minHeight:r,minWidth:a,alignment:d=s.center}){super({alignment:d,textDirection:y.ltr});t(this,"_minWidth");t(this,"_maxWidth");t(this,"_minHeight");t(this,"_maxHeight");this._maxHeight=i,this._maxWidth=m,this._minHeight=r,this._minWidth=a}get minWidth(){return this._minWidth}set minWidth(i){this._minWidth!==i&&(this._minWidth=i,this.markNeedsLayout())}get maxWidth(){return this._maxWidth}set maxWidth(i){this._maxWidth!==i&&(this._maxWidth=i,this.markNeedsLayout())}get minHeight(){return this._minHeight}set minHeight(i){this._minHeight!==i&&(this._minHeight=i,this.markNeedsLayout())}get maxHeight(){return this._maxHeight}set maxHeight(i){this._maxHeight!==i&&(this._maxHeight=i,this.markNeedsLayout())}preformLayout(){this.size=this.constraints.biggest,this.child!=null&&(this.child.layout(this.getInnerConstraints(this.constraints)),this.alignChild())}getInnerConstraints(i){return new B({minHeight:this.minHeight??i.minHeight,maxHeight:this.maxHeight??i.maxHeight,minWidth:this.minWidth??i.minWidth,maxWidth:this.maxWidth??i.maxWidth})}}const z=S(O),I=c`import { Container, SizedBox, Align, OverflowBox, Alignment } from '@meursyphus/flitter';
\n\n`,L={title:"Widget/OverflowBox",component:p},b=c`
    Align({
        alignment: Alignment.center,
        child: Container({
            width: 400,
            height: 400,
            alignment: Alignment.topLeft,
            color: 'grey',
            child: SizedBox({
                width: 200,
                height: 200,
                child: OverflowBox({
                    maxWidth: Infinity,
                    maxHeight: Infinity,
                    child: Container({
                        color: 'red',
                        width: 400,
                        height: 400
                    })
                })
            })
        })
    })
`,h={args:{ssrSize:{width:500,height:600},width:"500px",height:"600px",code:I+b,widget:A({alignment:s.center,child:g({width:400,height:400,alignment:s.topLeft,color:"grey",child:C({width:200,height:200,child:z({maxWidth:1/0,maxHeight:1/0,child:g({color:"red",width:400,height:400})})})})})}};var o,l,x;h.parameters={...h.parameters,docs:{...(o=h.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 500,
      height: 600
    },
    width: '500px',
    height: '600px',
    code: importWidgets + BasicWidget,
    widget: Align({
      alignment: Alignment.center,
      child: Container({
        width: 400,
        height: 400,
        alignment: Alignment.topLeft,
        color: 'grey',
        child: SizedBox({
          width: 200,
          height: 200,
          child: OverflowBox({
            maxWidth: Infinity,
            maxHeight: Infinity,
            child: Container({
              color: 'red',
              width: 400,
              height: 400
            })
          })
        })
      })
    })
  }
}`,...(x=(l=h.parameters)==null?void 0:l.docs)==null?void 0:x.source}}};const R=["Basic"],D=Object.freeze(Object.defineProperty({__proto__:null,Basic:h,__namedExportsOrder:R,default:L},Symbol.toStringTag,{value:"Module"}));export{h as B,D as S};
