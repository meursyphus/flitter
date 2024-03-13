var m=Object.defineProperty;var g=(a,s,t)=>s in a?m(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var r=(a,s,t)=>(g(a,typeof s!="symbol"?s+"":s,t),t);import{W as u}from"./Widget-B6WpeV_a.js";import{d}from"./index-DrFu-skq.js";import{u as R,z as f,G as o,x,b as C,y,C as c,d as _}from"./Widget-Dxvrat1N.js";let b=class extends R{constructor({child:t,aspectRatio:e,key:i}){super({child:t,key:i});r(this,"aspectRatio");this.aspectRatio=e}createRenderObject(){return new A({aspectRatio:this.aspectRatio})}updateRenderObject(t){t.aspectRatio=this.aspectRatio}};class A extends f{constructor({aspectRatio:t}){super({isPainter:!1});r(this,"_aspectRatio");this._aspectRatio=t}get aspectRatio(){return this._aspectRatio}set aspectRatio(t){o(t>0),o(Number.isFinite(t)),this._aspectRatio=t}getIntrinsicWidth(t){return Number.isFinite(t)?t*this.aspectRatio:this.child!=null?this.child.getIntrinsicWidth(t):0}getIntrinsicHeight(t){return Number.isFinite(t)?t/this.aspectRatio:this.child!=null?this.child.getIntrinsicHeight(t):0}_applyAspectRatio(t){if(t.isTight)return t.smallest;let e=t.maxWidth,i;return Number.isFinite(e)?i=e/this.aspectRatio:(i=t.maxHeight,e=i*this.aspectRatio),e>t.maxWidth&&(e=t.maxWidth,i=e/this.aspectRatio),i>t.maxHeight&&(i=t.maxHeight,e=i*this.aspectRatio),e<t.minWidth&&(e=t.minWidth,i=e/this.aspectRatio),i<t.minHeight&&(i=t.minHeight,e=i*this.aspectRatio),t.constrain(new x({width:e,height:i}))}preformLayout(){this.size=this._applyAspectRatio(this.constraints),this.child!=null&&this.child.layout(C.tight(this.size))}}const W=y(b),w={title:"Widget/AspectRatio",component:u},S=d`
    Container({
        width: Infinity,
        height: 150,
        color: 'orange',
        alignment: Alignment.center,
        child: AspectRatio({
            aspectRatio: 16 / 9,
            child: Container({
                color: 'purple'
            })
        })
    })
`,n={args:{ssrSize:{width:400,height:300},width:"400px",height:"300px",code:d`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\n\n\n`+S,widget:c({width:1/0,height:150,color:"orange",alignment:_.center,child:W({aspectRatio:16/9,child:c({color:"purple"})})})}};var h,p,l;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 300
    },
    width: '400px',
    height: '300px',
    code: dedent\`import {  Container, Column, Opacity } from '@meursyphus/flitter';'\\n\\n\\n\` + BasicCode,
    widget: Container({
      width: Infinity,
      height: 150,
      color: 'orange',
      alignment: Alignment.center,
      child: AspectRatio({
        aspectRatio: 16 / 9,
        child: Container({
          color: 'purple'
        })
      })
    })
  }
}`,...(l=(p=n.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};const O=["Basic"],F=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,__namedExportsOrder:O,default:w},Symbol.toStringTag,{value:"Module"}));export{n as B,F as S};
