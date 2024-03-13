var R=Object.defineProperty;var D=(s,n,e)=>n in s?R(s,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[n]=e;var i=(s,n,e)=>(D(s,typeof n!="symbol"?n+"":n,e),e);import{W as z}from"./Widget-B6WpeV_a.js";import{d as G}from"./index-DrFu-skq.js";import{G as j,C as I,b as M,y as E,H as F,I as H,M as p,B as S,k as b,O as x,J,T as P,j as Y,d as q}from"./Widget-Dxvrat1N.js";import{B as u,a as C,c as A}from"./box-decoration-BcTLV75v.js";import{C as K}from"./Center-BPlvJyPx.js";import{I as L,A as N,T as w}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";import{C as r}from"./CalculableTween-CgTmnWDg.js";class Q extends L{constructor({child:e,curve:t,duration:d,key:h,alignment:l,width:c,height:g,constraints:m,color:a,decoration:f,margin:B,padding:k,clipped:V,transform:O,transformAlignment:_}){super({key:h,curve:t,duration:d});i(this,"child");i(this,"padding");i(this,"margin");i(this,"width");i(this,"height");i(this,"color");i(this,"decoration");i(this,"alignment");i(this,"clipped");i(this,"constraints");i(this,"transform");i(this,"transformAlignment");j(!(a!=null&&f!=null),"color must not be null when decoration exists"),this.child=e,this.alignment=l,this.decoration=a!=null?new u({color:a}):f,this.width=c,this.height=g,this.padding=k,this.margin=B,this.clipped=V,this.constraints=m,this.transform=O,this.transformAlignment=_}createState(){return new U}}class U extends N{constructor(){super(...arguments);i(this,"alignment");i(this,"width");i(this,"height");i(this,"padding");i(this,"margin");i(this,"transformAlignment");i(this,"constraints");i(this,"decoration");i(this,"transform")}forEachTween(e){this.alignment=e({tween:this.alignment,targetValue:this.widget.alignment,constructor:t=>new r({begin:t,end:t})}),this.width=e({tween:this.width,targetValue:this.widget.width,constructor:t=>new w({begin:t,end:t})}),this.height=e({tween:this.height,targetValue:this.widget.height,constructor:t=>new w({begin:t,end:t})}),this.padding=e({tween:this.padding,targetValue:this.widget.padding,constructor:t=>new r({begin:t,end:t})}),this.margin=e({tween:this.margin,targetValue:this.widget.margin,constructor:t=>new r({begin:t,end:t})}),this.transformAlignment=e({tween:this.transformAlignment,targetValue:this.widget.transformAlignment,constructor:t=>new r({begin:t,end:t})}),this.decoration=e({tween:this.decoration,targetValue:this.widget.decoration,constructor:t=>new X({begin:t,end:t})}),this.transform=e({tween:this.transform,targetValue:this.widget.transform,constructor:t=>new r({begin:t,end:t})}),this.constraints=e({tween:this.constraints,targetValue:this.widget.constraints,constructor:t=>new Z({begin:t,end:t})})}build(){var e,t,d,h,l,c,g,m,a;return I({child:this.widget.child,alignment:(e=this.alignment)==null?void 0:e.evaluate(this.animation),width:(t=this.width)==null?void 0:t.evaluate(this.animation),height:(d=this.height)==null?void 0:d.evaluate(this.animation),clipped:this.widget.clipped,padding:(h=this.padding)==null?void 0:h.evaluate(this.animation),margin:(l=this.margin)==null?void 0:l.evaluate(this.animation),transformAlignment:(c=this.transformAlignment)==null?void 0:c.evaluate(this.animation),decoration:(g=this.decoration)==null?void 0:g.evaluate(this.animation),transform:(m=this.transform)==null?void 0:m.evaluate(this.animation),constraints:(a=this.constraints)==null?void 0:a.evaluate(this.animation)})}}class X extends w{constructor({begin:n,end:e}){super({begin:n,end:e})}lerp(n){return u.lerp(this.begin,this.end,n)}}class Z extends w{constructor({begin:n,end:e}){super({begin:n,end:e})}lerp(n){return M.lerp(this.begin,this.end,n)}}const $=E(Q);class v extends F{createState(){return new tt}}class tt extends H{constructor(){super(...arguments);i(this,"index",0);i(this,"props",[{width:150,height:200,transform:p.identity(),decoration:new u({color:"yellow",border:C.all({width:5,color:"black"}),borderRadius:S.all(b.circular(0)),boxShadow:[new A({blurRadius:10,color:"blue",offset:new x({x:-10,y:-10})})]})},{height:150,width:200,transform:p.skewY(.2),decoration:new u({color:"red",border:C.all({width:20,color:"white"}),borderRadius:S.all(b.circular(10)),boxShadow:[new A({blurRadius:10,offset:new x({x:20,y:-20})})]})}])}build(){return K({child:J({onClick:()=>{this.setState(()=>{this.index=(this.index+1)%this.props.length})},child:$({duration:1e3,child:P("Tab me",{style:new Y({fontSize:16})}),...this.props[this.index],alignment:q.center})})})}}const et={widget:new v,code:G`
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
`},it={title:"Widget/AnimatedContainer",component:z,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},o={args:et};var y,T,W;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: BasicStory
}`,...(W=(T=o.parameters)==null?void 0:T.docs)==null?void 0:W.source}}};const nt=["Basic"],gt=Object.freeze(Object.defineProperty({__proto__:null,Basic:o,__namedExportsOrder:nt,default:it},Symbol.toStringTag,{value:"Module"}));export{o as B,gt as S};
