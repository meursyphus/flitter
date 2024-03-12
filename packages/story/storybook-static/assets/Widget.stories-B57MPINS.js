var g=Object.defineProperty;var S=(i,e,t)=>e in i?g(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var s=(i,e,t)=>(S(i,typeof e!="symbol"?e+"":e,t),t);import{W as f}from"./Widget-B6WpeV_a.js";import{d as p}from"./index-DrFu-skq.js";import{d as c,t as W,y as w,H as x,I as C,J as T,C as y,T as A,j as b}from"./Widget-Dxvrat1N.js";import{C as B}from"./Center-BPlvJyPx.js";import{I as _,A as R,T as z}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";class I extends _{constructor({child:t,curve:a,duration:l,key:u,turns:m,alignment:h=c.center}){super({key:u,curve:a,duration:l});s(this,"turns");s(this,"child");s(this,"alignment");this.child=t,this.turns=m,this.alignment=h}createState(){return new j}}class j extends R{constructor(){super(...arguments);s(this,"turns")}forEachTween(t){this.turns=t({tween:this.turns,targetValue:this.widget.turns,constructor:a=>new z({begin:a})})}build(){var t;return W.rotate({angle:(((t=this.turns)==null?void 0:t.evaluate(this.animation))??0)*Math.PI*2,alignment:this.widget.alignment,child:this.widget.child})}}const D=w(I);class G extends x{createState(){return new O}}class O extends C{constructor(){super(...arguments);s(this,"turns",0)}build(){return B({child:T({onClick:()=>{this.setState(()=>{this.turns+=.25})},child:D({turns:this.turns,duration:1e3,child:y({width:200,height:200,color:"red",alignment:c.center,child:A("Tab me",{style:new b({fontSize:32,fontWeight:"700"})})})})})})}}const k={widget:new G,code:p`
import { dedent } from 'ts-dedent';
import {
	AnimatedRotation,
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
	turns = 0;
	build(): Widget {
		return Center({
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.turns += 0.25;
					});
				},
				child: AnimatedRotation({
					turns: this.turns,
					duration: 1000,
					child: Container({
						width: 200,
						height: 200,
						color: 'red',
						alignment: Alignment.center,
						child: Text('Tab me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						})
					})
				})
			})
		});
	}
}
`},v={title:"Widget/AnimatedRotation",component:f,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},n={args:k};var r,o,d;n.parameters={...n.parameters,docs:{...(r=n.parameters)==null?void 0:r.docs,source:{originalSource:`{
  args: BasicStory
}`,...(d=(o=n.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};const E=["Basic"],q=Object.freeze(Object.defineProperty({__proto__:null,Basic:n,__namedExportsOrder:E,default:v},Symbol.toStringTag,{value:"Module"}));export{n as B,q as S};
