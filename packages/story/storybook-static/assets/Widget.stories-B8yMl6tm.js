var p=Object.defineProperty;var m=(a,s,t)=>s in a?p(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var e=(a,s,t)=>(m(a,typeof s!="symbol"?s+"":s,t),t);import{W as f}from"./Widget-B6WpeV_a.js";import{y as D,H as S,I as b,O as l,t as w,J as M,C as d}from"./Widget-Dxvrat1N.js";import{C as _}from"./Column-BDxz2XB9.js";import{d as y}from"./index-DrFu-skq.js";class v extends S{constructor({onDragUpdate:t,key:i,child:r,feedback:n}){super(i);e(this,"onDragUpdate");e(this,"child");e(this,"feedback");this.onDragUpdate=t,this.child=r,this.feedback=n??r}createState(){return new x}}class x extends b{constructor(){super(...arguments);e(this,"origin");e(this,"state");e(this,"delta",l.zero());e(this,"lastDelta",this.delta);e(this,"childKey",1);e(this,"handleMouseDown",({x:t,y:i})=>{this.setState(()=>{this.origin=new l({x:t,y:i})})});e(this,"handleMouseMove",({x:t,y:i})=>{this.origin!=null&&this.setState(()=>{var r,n;this.delta=this.lastDelta.plus(new l({x:t,y:i}).minus(this.origin)),(n=(r=this.widget).onDragUpdate)==null||n.call(r,{delta:this.delta})})});e(this,"handleMouseUp",t=>{this.setState(()=>{this.origin=void 0,this.lastDelta=this.delta,this.childKey+=1})})}get active(){return this.origin!=null}build(t){return w.translate({offset:this.delta,child:M({onDragStart:this.handleMouseDown,onDragMove:this.handleMouseMove,onDragEnd:this.handleMouseUp,child:this.widget.feedback})})}}const h=D(v),B={widget:_({children:[h({child:d({width:50,height:50,color:"red"})}),h({child:d({width:50,height:50,color:"blue"})})]}),code:y`
	`},O={title:"Widget/Draggable",component:f,parameters:{layout:"fullscreen"},args:{width:"400px",height:"400px",ssrSize:{width:400,height:400}}},o={args:B};var c,g,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: BasicStory
}`,...(u=(g=o.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const U=["Basic"],j=Object.freeze(Object.defineProperty({__proto__:null,Basic:o,__namedExportsOrder:U,default:O},Symbol.toStringTag,{value:"Module"}));export{o as B,j as S};