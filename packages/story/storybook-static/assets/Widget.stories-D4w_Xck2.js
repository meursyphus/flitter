var h=Object.defineProperty;var p=(i,e,t)=>e in i?h(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var a=(i,e,t)=>(p(i,typeof e!="symbol"?e+"":e,t),t);import{W as u}from"./Widget-B6WpeV_a.js";import{d as g}from"./index-DrFu-skq.js";import{y as f,H as S,I as y,J as w,C as W,d as x,T as C,j as T}from"./Widget-Dxvrat1N.js";import{C as A}from"./Center-BPlvJyPx.js";import{I as O,A as B,T as b}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";import{O as _}from"./Opacity-CBfHa7_s.js";class k extends O{constructor({child:t,curve:d,duration:c,key:l,opacity:m}){super({key:l,curve:d,duration:c});a(this,"opacity");a(this,"child");this.child=t,this.opacity=m}createState(){return new z}}class z extends B{constructor(){super(...arguments);a(this,"opacityTween")}forEachTween(t){this.opacityTween=t({tween:this.opacityTween,targetValue:this.widget.opacity,constructor:d=>new b({begin:d,end:d})})}build(){var t;return _({opacity:((t=this.opacityTween)==null?void 0:t.evaluate(this.animation))??1,child:this.widget.child})}}const j=f(k);class D extends S{createState(){return new G}}class G extends y{constructor(){super(...arguments);a(this,"faded",!1)}build(){return A({child:w({onClick:()=>{this.setState(()=>{this.faded=!this.faded})},child:j({opacity:this.faded?.2:1,duration:1e3,child:W({color:"red",alignment:x.center,child:C(this.faded?"make it fade":"restore",{style:new T({fontSize:32,fontWeight:"700"})})})})})})}}const I={widget:new D,code:g`
import {
	AnimatedOpacity,
	StatefulWidget,
	State,
	Center,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	faded = false;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.faded = !this.faded;
					});
				},
				child: AnimatedOpacity({
					opacity: this.faded ? 0.2 : 1,
					duration: 1000,
					child: Container({
						color: 'red',
						alignment: Alignment.center,
						child: Text(this.faded ? 'make it fade' : 'restore', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						})
					})
				})
			})
		});
	}
}`},E={title:"Widget/AnimatedOpacity",component:u,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},s={args:I};var r,n,o;s.parameters={...s.parameters,docs:{...(r=s.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: BasicStory
}`,...(o=(n=s.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const v=["Basic"],K=Object.freeze(Object.defineProperty({__proto__:null,Basic:s,__namedExportsOrder:v,default:E},Symbol.toStringTag,{value:"Module"}));export{s as B,K as S};
