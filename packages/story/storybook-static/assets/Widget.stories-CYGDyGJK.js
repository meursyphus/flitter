var h=Object.defineProperty;var u=(t,e,i)=>e in t?h(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var s=(t,e,i)=>(u(t,typeof e!="symbol"?e+"":e,i),i);import{W as S}from"./Widget-B6WpeV_a.js";import{d as g}from"./index-DrFu-skq.js";import{m as w,y as p,H as x,I as y,O as r,J as C,C as W,d as T,T as A,j as b}from"./Widget-Dxvrat1N.js";import{C as k}from"./Center-BPlvJyPx.js";import{C as B}from"./CalculableTween-CgTmnWDg.js";import{I as O,A as _}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";class z extends O{constructor({child:i,curve:n,duration:c,key:m,offset:f}){super({key:m,curve:n,duration:c});s(this,"offset");s(this,"child");this.child=i,this.offset=f}createState(){return new j}}class j extends _{constructor(){super(...arguments);s(this,"offset")}forEachTween(i){this.offset=i({tween:this.offset,targetValue:this.widget.offset,constructor:n=>new B({begin:n})})}build(){return w({translation:this.offset.evaluate(this.animation),child:this.widget.child})}}const D=p(z);class G extends x{createState(){return new I}}class I extends y{constructor(){super(...arguments);s(this,"clicked",!1)}build(){return k({child:D({offset:this.clicked?new r({x:1,y:1}):new r({x:0,y:0}),duration:1e3,child:C({onClick:()=>{this.setState(()=>{this.clicked=!this.clicked})},child:W({width:100,height:100,color:"yellow",alignment:T.center,child:A("Tab me",{style:new b({fontSize:16})})})})})})}}const v={widget:new G,code:g`
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
	Offset,
	AnimatedSlide
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	clicked = false;
	build(): Widget {
		return Center({
			child: AnimatedSlide({
				offset: this.clicked ? new Offset({ x: 1, y: 1 }) : new Offset({ x: 0, y: 0 }),
				duration: 1000,
				child: GestureDetector({
					onClick: () => {
						this.setState(() => {
							this.clicked = !this.clicked;
						});
					},
					child: Container({
						width: 100,
						height: 100,
						color: 'yellow',
						alignment: Alignment.center,
						child: Text('Tab me', {
							style: new TextStyle({ fontSize: 16 })
						})
					})
				})
			})
		});
	}
}
`},E={title:"Widget/AnimatedSlide",component:S,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},a={args:v};var o,d,l;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: BasicStory
}`,...(l=(d=a.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};const F=["Basic"],L=Object.freeze(Object.defineProperty({__proto__:null,Basic:a,__namedExportsOrder:F,default:E},Symbol.toStringTag,{value:"Module"}));export{a as B,L as S};
