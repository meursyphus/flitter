var d=Object.defineProperty;var m=(e,t,o)=>t in e?d(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var r=(e,t,o)=>(m(e,typeof t!="symbol"?t+"":t,o),o);import{W as h}from"./Widget-B6WpeV_a.js";import{C as l,d as c,H as g,I as p,J as u,t as S,T as f,j as C}from"./Widget-Dxvrat1N.js";import{A as w}from"./AnimationController-DtlgA-dx.js";import{d as x}from"./index-DrFu-skq.js";class _ extends g{createState(){return new b}}class b extends p{constructor(){super(...arguments);r(this,"animationController")}initState(){this.animationController=new w({duration:3e3}),this.animationController.addListener(()=>{this.setState()}),this.animationController.forward()}build(o){return u({onClick:()=>{this.animationController.isCompleted||this.animationController.status==="forward"?this.animationController.reverse():this.animationController.forward(),this.setState()},child:S.rotate({angle:this.animationController.value*Math.PI*2,child:l({width:200,height:200,color:"black",alignment:c.center,child:f(this.animationController.status==="dismissed"?"Move":"Stop",{style:new C({fontSize:20,fontWeight:"bold",color:"white"})})})})})}}const y={widget:l({alignment:c.center,color:"lightgreen",child:new _}),code:x`
	`},A={title:"Animation/AnimationController",component:h,parameters:{layout:"fullscreen"},args:{width:"400px",height:"400px",ssrSize:{width:400,height:400}}},a={args:y};var i,n,s;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: BasicStory
}`,...(s=(n=a.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const B=["Basic"],z=Object.freeze(Object.defineProperty({__proto__:null,Basic:a,__namedExportsOrder:B,default:A},Symbol.toStringTag,{value:"Module"}));export{a as B,z as S};