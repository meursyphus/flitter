var p=Object.defineProperty;var S=(a,n,t)=>n in a?p(a,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[n]=t;var i=(a,n,t)=>(S(a,typeof n!="symbol"?n+"":n,t),t);import{W as x}from"./Widget-B6WpeV_a.js";import{d as A}from"./index-DrFu-skq.js";import{A as f,y as F,H as b,I as W,d as o,S as _,C as d,i as y,J as C,E as B,T as L,j as R}from"./Widget-Dxvrat1N.js";import{I as k,A as E,T as l}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";import{C as I}from"./CalculableTween-CgTmnWDg.js";class z extends k{constructor({child:t,curve:e,duration:r,key:m,alignment:w,widthFactor:u,heightFactor:T}){super({key:m,curve:e,duration:r});i(this,"alignment");i(this,"child");i(this,"widthFactor");i(this,"heightFactor");this.alignment=w,this.child=t,this.widthFactor=u,this.heightFactor=T}createState(){return new P}}class P extends E{constructor(){super(...arguments);i(this,"alignmentTween");i(this,"widthFactorTween");i(this,"heightFactorTween")}forEachTween(t){this.alignmentTween=t({tween:this.alignmentTween,targetValue:this.widget.alignment,constructor:e=>new I({begin:e,end:e})}),this.widthFactorTween=t({tween:this.widthFactorTween,targetValue:this.widget.widthFactor,constructor:e=>new l({begin:e,end:e})}),this.heightFactorTween=t({tween:this.heightFactorTween,targetValue:this.widget.heightFactor,constructor:e=>new l({begin:e,end:e})})}build(){var t,e,r;return f({alignment:(t=this.alignmentTween)==null?void 0:t.evaluate(this.animation),widthFactor:(e=this.widthFactorTween)==null?void 0:e.evaluate(this.animation),heightFactor:(r=this.heightFactorTween)==null?void 0:r.evaluate(this.animation),child:this.widget.child})}}const j=F(z);class D extends b{createState(){return new G}}class G extends W{constructor(){super(...arguments);i(this,"alignements",[o.topLeft,o.topRight,o.bottomRight,o.bottomLeft]);i(this,"name",["To Top_Right","To Bottom_Right","To Bottom_Left","To Top_Left"]);i(this,"index",0)}build(){return _({alignment:o.center,children:[j({alignment:this.alignements[this.index],duration:300,child:d({width:50,height:50,color:"green"})}),y({child:C({child:d({color:"yellow",padding:B.all(10),child:L(this.name[this.index],{style:new R({fontSize:32,color:"black"})})}),onClick:()=>{this.setState(()=>{this.index=(this.index+1)%this.alignements.length})}})})]})}}const O={widget:new D,code:A`
import {
	Container,
	AnimatedAlign,
	StatefulWidget,
	Alignment,
	State,
	Widget,
	GestureDetector,
	Text,
	Stack,
	Positioned,
	TextStyle,
	EdgeInsets
} from '@meursyphus/flitter';

class CustomWidgetState extends State<CustomWidget> {
	alignements = [
		Alignment.topLeft,
		Alignment.topRight,
		Alignment.bottomRight,
		Alignment.bottomLeft
	];
	name = ['To Top_Right', 'To Bottom_Right', 'To Bottom_Left', 'To Top_Left'];
	index = 0;
	build(): Widget {
		return Stack({
			alignment: Alignment.center,
			children: [
				AnimatedAlign({
					alignment: this.alignements[this.index],
					duration: 300,
					child: Container({
						width: 50,
						height: 50,
						color: 'green'
					})
				}),
				Positioned({
					child: GestureDetector({
						child: Container({
							color: 'yellow',
							padding: EdgeInsets.all(10),
							child: Text(this.name[this.index], {
								style: new TextStyle({ fontSize: 32, color: 'black' })
							})
						}),
						onClick: () => {
							this.setState(() => {
								this.index = (this.index + 1) % this.alignements.length;
							});
						}
					})
				}),
			]
		});
	}
}`},V={title:"Widget/AnimatedAlign",component:x,args:{ssrSize:{width:600,height:300},width:"600px",height:"300px"}},s={args:O};var h,g,c;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: BasicStory
}`,...(c=(g=s.parameters)==null?void 0:g.docs)==null?void 0:c.source}}};const H=["Basic"],U=Object.freeze(Object.defineProperty({__proto__:null,Basic:s,__namedExportsOrder:H,default:V},Symbol.toStringTag,{value:"Module"}));export{s as B,U as S};
