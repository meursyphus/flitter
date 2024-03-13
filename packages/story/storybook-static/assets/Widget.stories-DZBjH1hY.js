var m=Object.defineProperty;var u=(i,t,e)=>t in i?m(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var s=(i,t,e)=>(u(i,typeof t!="symbol"?t+"":t,e),e);import{W as p}from"./Widget-B6WpeV_a.js";import{d as S}from"./index-DrFu-skq.js";import{E as l,Y as f,y as w,H as W,I as C,J as k,C as x,d as T,T as y,j as A}from"./Widget-Dxvrat1N.js";import{C as b}from"./Center-BPlvJyPx.js";import{C as B}from"./CalculableTween-CgTmnWDg.js";import{I as P,A as _}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";class E extends P{constructor({child:e,curve:a,duration:c,key:g,padding:h=l.all(0)}){super({key:g,curve:a,duration:c});s(this,"opacity");s(this,"padding");s(this,"child");this.child=e,this.padding=h}createState(){return new I}}class I extends _{constructor(){super(...arguments);s(this,"paddingTween")}forEachTween(e){this.paddingTween=e({tween:this.paddingTween,targetValue:this.widget.padding,constructor:a=>new B({begin:a,end:a})})}build(){var e;return f({padding:(e=this.paddingTween)==null?void 0:e.evaluate(this.animation),child:this.widget.child})}}const z=w(E);class j extends W{createState(){return new D}}class D extends C{constructor(){super(...arguments);s(this,"shrinked",!1)}build(){return b({child:k({onClick:()=>{this.setState(()=>{this.shrinked=!this.shrinked})},child:z({padding:l.all(this.shrinked?50:0),duration:1e3,child:x({color:"red",alignment:T.center,child:y(this.shrinked?"make it shrink":"restore",{style:new A({fontSize:32,fontWeight:"700"})})})})})})}}const G={widget:new j,code:S`
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
	AnimatedPadding,
	EdgeInsets
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
				child: AnimatedPadding({
					padding: EdgeInsets.all(this.shrinked ? 50 : 0),
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.shrinked ? 'make it shrink' : 'restore', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						})
					})
				})
			})
		});
	}
}
`},O={title:"Widget/AnimatedPadding",component:p,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},n={args:G};var d,r,o;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: BasicStory
}`,...(o=(r=n.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const v=["Basic"],K=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,__namedExportsOrder:v,default:O},Symbol.toStringTag,{value:"Module"}));export{n as B,K as S};
