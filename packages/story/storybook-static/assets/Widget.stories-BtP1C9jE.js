var u=Object.defineProperty;var S=(s,t,e)=>t in s?u(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var i=(s,t,e)=>(S(s,typeof t!="symbol"?t+"":t,e),e);import{W as f}from"./Widget-B6WpeV_a.js";import{d as p}from"./index-DrFu-skq.js";import{d as l,t as w,y as W,H as T,I as k,J as x,C,T as y,j as A}from"./Widget-Dxvrat1N.js";import{C as B}from"./Center-BPlvJyPx.js";import{I as b,A as _,T as z}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";class j extends b{constructor({child:e,curve:n,duration:o,key:h,scale:m,alignment:g=l.center}){super({key:h,curve:n,duration:o});i(this,"scale");i(this,"child");i(this,"alignment");this.child=e,this.scale=m,this.alignment=g}createState(){return new D}}class D extends _{constructor(){super(...arguments);i(this,"scaleTween")}forEachTween(e){this.scaleTween=e({tween:this.scaleTween,targetValue:this.widget.scale,constructor:n=>new z({begin:n})})}build(){var e;return w.scale({scale:(e=this.scaleTween)==null?void 0:e.evaluate(this.animation),alignment:this.widget.alignment,child:this.widget.child})}}const G=W(j);class I extends T{createState(){return new O}}class O extends k{constructor(){super(...arguments);i(this,"shrinked",!1)}build(){return B({child:x({onClick:()=>{this.setState(()=>{this.shrinked=!this.shrinked})},child:G({scale:this.shrinked?.8:1,duration:1e3,child:C({color:"red",alignment:l.center,child:y(this.shrinked?"restore":"make it shrink",{style:new A({fontSize:32,fontWeight:"700"})})})})})})}}const v={widget:new I,code:p`
import {
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	AnimatedScale
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	shrinked = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.shrinked = !this.shrinked;
					});
				},
				child: AnimatedScale({
					scale: this.shrinked ? 0.8 : 1,
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(!this.shrinked ? 'make it shrink' : 'restore', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						})
					})
				})
			})
		});
	}
}
`},E={title:"Widget/AnimatedScale",component:f,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},a={args:v};var r,d,c;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: BasicStory
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const F=["Basic"],K=Object.freeze(Object.defineProperty({__proto__:null,Basic:a,__namedExportsOrder:F,default:E},Symbol.toStringTag,{value:"Module"}));export{a as B,K as S};
