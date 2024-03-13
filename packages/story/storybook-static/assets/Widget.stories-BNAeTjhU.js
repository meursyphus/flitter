var f=Object.defineProperty;var b=(a,s,t)=>s in a?f(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t;var i=(a,s,t)=>(b(a,typeof s!="symbol"?s+"":s,t),t);import{W as C}from"./Widget-B6WpeV_a.js";import{d as x}from"./index-DrFu-skq.js";import{i as W,y as T,H as y,I as A,h as B,S as P,J as k,C as v,d as z,T as _,j as V}from"./Widget-Dxvrat1N.js";import{I,A as O,T as o,C as j}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";import{C as D}from"./Center-BPlvJyPx.js";class G extends I{constructor({child:t,curve:e,duration:n,key:d,width:r,height:l,top:m,left:w,right:S,bottom:p}){super({key:d,curve:e,duration:n});i(this,"width");i(this,"height");i(this,"top");i(this,"left");i(this,"right");i(this,"bottom");i(this,"child");this.child=t,this.width=r,this.height=l,this.top=m,this.left=w,this.right=S,this.bottom=p}createState(){return new E}}class E extends O{constructor(){super(...arguments);i(this,"width");i(this,"height");i(this,"top");i(this,"left");i(this,"bottom");i(this,"right")}forEachTween(t){this.width=t({tween:this.width,targetValue:this.widget.width,constructor:e=>new o({begin:e})}),this.height=t({tween:this.height,targetValue:this.widget.height,constructor:e=>new o({begin:e})}),this.top=t({tween:this.top,targetValue:this.widget.top,constructor:e=>new o({begin:e})}),this.left=t({tween:this.left,targetValue:this.widget.left,constructor:e=>new o({begin:e})}),this.right=t({tween:this.right,targetValue:this.widget.right,constructor:e=>new o({begin:e})}),this.bottom=t({tween:this.bottom,targetValue:this.widget.bottom,constructor:e=>new o({begin:e})})}build(){var t,e,n,d,r,l;return W({width:(t=this.width)==null?void 0:t.evaluate(this.animation),height:(e=this.height)==null?void 0:e.evaluate(this.animation),top:(n=this.top)==null?void 0:n.evaluate(this.animation),left:(d=this.left)==null?void 0:d.evaluate(this.animation),right:(r=this.right)==null?void 0:r.evaluate(this.animation),bottom:(l=this.bottom)==null?void 0:l.evaluate(this.animation),child:this.widget.child})}}const F=T(G);class H extends y{createState(){return new J}}class J extends A{constructor(){super(...arguments);i(this,"selected",!1)}build(){return D({child:B({width:200,height:400,child:P({children:[F({width:this.selected?200:60,height:this.selected?60:200,top:this.selected?50:150,duration:1e3,curve:j.backInOut,child:k({onClick:()=>{this.setState(()=>{this.selected=!this.selected})},child:v({alignment:z.center,color:"lightblue",child:_("Tap me",{style:new V({fontSize:14,fontWeight:"400"})})})})})]})})})}}const M={widget:new H,code:x`
import {
	StatefulWidget,
	State,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	Stack,
	AnimatedPositioned,
	Curves,
	Center,
	SizedBox
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Center({
			child: SizedBox({
				width: 200,
				height: 400,
				child: Stack({
					children: [
						AnimatedPositioned({
							width: this.selected ? 200 : 60,
							height: this.selected ? 60 : 200,
							top: this.selected ? 50 : 150,
							duration: 1000,
							curve: Curves.backInOut,
							child: GestureDetector({
								onClick: () => {
									this.setState(() => {
										this.selected = !this.selected;
									});
								},
								child: Container({
									alignment: Alignment.center,
									color: 'lightblue',
									child: Text('Tap me', {
										style: new TextStyle({ fontSize: 14, fontWeight: '400' })
									})
								})
							})
						})
					]
				})
			})
		});
	}
}
`},q={title:"Widget/AnimatedPositioned",component:C,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},h={args:M};var c,g,u;h.parameters={...h.parameters,docs:{...(c=h.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: BasicStory
}`,...(u=(g=h.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const K=["Basic"],Y=Object.freeze(Object.defineProperty({__proto__:null,Basic:h,__namedExportsOrder:K,default:q},Symbol.toStringTag,{value:"Module"}));export{h as B,Y as S};
