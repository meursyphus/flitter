var F=Object.defineProperty;var f=(a,i,t)=>i in a?F(a,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[i]=t;var n=(a,i,t)=>(f(a,typeof i!="symbol"?i+"":i,t),t);import{W as p}from"./Widget-B6WpeV_a.js";import{d as x}from"./index-DrFu-skq.js";import{d as r,y,H as W,I as C,C as c,J as B,S as b,s as A,T,j as z}from"./Widget-Dxvrat1N.js";import{I as k,A as I,T as d}from"./ImplicitlyAnimatedWidget-DXSt00LP.js";import{C as _}from"./CalculableTween-CgTmnWDg.js";import{F as j}from"./FractionallySizedBox-Bm-UT4Gm.js";class D extends k{constructor({child:t,curve:e,duration:o,key:m,widthFactor:u,heightFactor:S,alignment:w=r.center}){super({key:m,curve:e,duration:o});n(this,"alignment");n(this,"widthFactor");n(this,"heightFactor");n(this,"child");this.child=t,this.widthFactor=u,this.heightFactor=S,this.alignment=w}createState(){return new G}}class G extends I{constructor(){super(...arguments);n(this,"widthFactor");n(this,"heightFactor");n(this,"alignment")}forEachTween(t){this.alignment=t({tween:this.alignment,targetValue:this.widget.alignment,constructor:e=>new _({begin:e,end:e})}),this.heightFactor=t({tween:this.heightFactor,targetValue:this.widget.heightFactor,constructor:e=>new d({begin:e,end:e})}),this.widthFactor=t({tween:this.widthFactor,targetValue:this.widget.widthFactor,constructor:e=>new d({begin:e,end:e})})}build(){var t,e,o;return j({widthFactor:(t=this.widthFactor)==null?void 0:t.evaluate(this.animation),heightFactor:(e=this.heightFactor)==null?void 0:e.evaluate(this.animation),alignment:(o=this.alignment)==null?void 0:o.evaluate(this.animation),child:this.widget.child})}}const O=y(D);class V extends W{createState(){return new E}}class E extends C{constructor(){super(...arguments);n(this,"selected",!1)}build(){return c({color:"red",width:1/0,height:1/0,child:B({onClick:()=>{this.setState(()=>{this.selected=!this.selected})},child:b({fit:A.expand,children:[T("Click me",{style:new z({fontSize:32,fontWeight:"700"})}),O({widthFactor:this.selected?.25:.75,heightFactor:this.selected?.75:.25,alignment:this.selected?r.topLeft:r.bottomRight,duration:1e3,child:c({color:"blue"})})]})})})}}const L={widget:new V,code:x`
import {
	StatefulWidget,
	State,
	GestureDetector,
	Container,
	Widget,
	Alignment,
	Text,
	TextStyle,
	AnimatedFractionallySizedBox,
	Stack,
	StackFit
} from '@meursyphus/flitter';

class CustomWidget extends StatefulWidget {
	createState(): State<StatefulWidget> {
		return new CustomWidgetState();
	}
}

class CustomWidgetState extends State<CustomWidget> {
	selected = false;
	build(): Widget {
		return Container({
			color: 'red',
			width: Infinity,
			height: Infinity,
			child: GestureDetector({
				onClick: () => {
					this.setState(() => {
						this.selected = !this.selected;
					});
				},
				child: Stack({
					fit: StackFit.expand,
					children: [
						Text('Click me', {
							style: new TextStyle({ fontSize: 32, fontWeight: '700' })
						}),
						AnimatedFractionallySizedBox({
							widthFactor: this.selected ? 0.25 : 0.75,
							heightFactor: this.selected ? 0.75 : 0.25,
							alignment: this.selected ? Alignment.topLeft : Alignment.bottomRight,
							duration: 1000,
							child: Container({
								color: 'blue'
							})
						})
					]
				})
			})
		});
	}
}
`},R={title:"Widget/AnimatedFactionallySizedBox",component:p,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},s={args:L};var l,h,g;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: BasicStory
}`,...(g=(h=s.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const H=["Basic"],U=Object.freeze(Object.defineProperty({__proto__:null,Basic:s,__namedExportsOrder:H,default:R},Symbol.toStringTag,{value:"Module"}));export{s as B,U as S};
