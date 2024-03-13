var H=Object.defineProperty;var J=(e,s,t)=>s in e?H(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var i=(e,s,t)=>(J(e,typeof s!="symbol"?s+"":s,t),t);import{W as q}from"./Widget-B6WpeV_a.js";import{C as o,d as l,J as n,T as r,j as c,H as a,I as h,S as M,i as O,E as P}from"./Widget-Dxvrat1N.js";import{d}from"./index-DrFu-skq.js";import{M as F}from"./Flex-edvBr9RZ.js";import{C as K}from"./Column-BDxz2XB9.js";const L={widget:o({alignment:l.center,color:"lightgreen",child:n({onClick(){alert("clicked!!")},child:o({width:200,height:200,color:"black",alignment:l.center,child:r("click here!!",{style:new c({fontSize:20,fontWeight:"bold",color:"white"})})})})}),code:d`
		import { Container, GestureDetector, Alignment, TextStyle, Text } from '@meursyphus/flitter';
			
		Container({
			alignment: Alignment.center,
			color: 'lightgreen',
			child: GestureDetector({
				onClick() {
					console.log('clicked!!');
				},
				child: Container({
					width: 200,
					height: 200,
					color: 'black',
					child: Text('click here!!', {
						style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'white' })
					})
				})
			})
		})`};let N=class extends a{constructor({colors:t,key:k}){super(k);i(this,"colors");this.colors=t}createState(){return new Q}},Q=class extends h{constructor(){super(...arguments);i(this,"index",0);i(this,"handleClick",()=>{this.index=(this.index+1)%this.widget.colors.length,this.setState()})}build(){return n({onClick:()=>{this.handleClick()},child:o({width:200,height:200,color:this.widget.colors[this.index],alignment:l.center,child:r("click here!!",{style:new c({fontSize:20,fontWeight:"bold",color:"white"})})})})}};const R={widget:o({alignment:l.center,color:"lightgreen",child:new N({colors:["black","red","green"]})}),code:d`
		`};class U extends a{createState(){return new V}}let V=class extends h{constructor(){super(...arguments);i(this,"index",0);i(this,"width",200);i(this,"height",200)}build(){const t=()=>{this.width=this.width+10,this.height=this.height+10,console.log("set state called!"),this.setState()};return n({onClick(){t()},child:o({width:this.width,height:this.height,color:"black",alignment:l.center,child:r("click to size up!",{style:new c({fontSize:20,fontWeight:"bold",color:"white"})})})})}};const X={widget:o({alignment:l.center,child:new U}),code:d`
		`};class Y extends a{constructor({count:t}){super();i(this,"count");this.count=t,console.log("created!",t)}createState(){return new Z}}class Z extends h{constructor(){super(...arguments);i(this,"index",0);i(this,"width",200);i(this,"height",200);i(this,"handleClick",()=>{this.setState(()=>{this.width=this.width+10,this.height=this.height+10})})}build(){return console.log("rebuild!",this.widget.count),n({onClick:()=>{this.handleClick()},child:o({width:this.width,height:this.height,color:"black",alignment:l.center,child:K({mainAxisSize:F.min,children:[r(`count: ${this.widget.count}`,{style:new c({fontSize:20,fontWeight:"bold",color:"yellow"})}),r("click to size up!",{style:new c({fontSize:20,fontWeight:"bold",color:"white"})})]})})})}}class ee extends a{createState(){return new te}}class te extends h{constructor(){super(...arguments);i(this,"count",0)}handleClick(){this.setState(()=>{this.count+=1})}build(){return M({children:[O({right:0,top:-30,child:n({onClick:()=>{this.handleClick()},child:o({color:"white",child:r("increse",{style:new c({fontSize:20})})})})}),new Y({count:this.count})]})}}const ie={widget:o({alignment:l.center,child:new ee}),code:d`
		`};let se=class extends a{createState(){return new oe}};class oe extends h{constructor(){super(...arguments);i(this,"visible",!0)}build(){const t=()=>{console.log("set state called!"),this.setState(()=>{this.visible=!this.visible})};return o({width:300,height:300,child:M({alignment:l.center,children:[O({right:0,top:0,child:n({onClick(){t()},child:o({color:"gray",padding:P.all(10),child:r(this.visible?"hide":"show")})})}),n({onClick(){t()},child:this.visible?o({width:200,height:200,color:"black",alignment:l.center,child:r("click to size up!",{style:new c({fontSize:20,fontWeight:"bold",color:"white"})})}):void 0})]})})}}const le={widget:o({alignment:l.center,child:new se}),code:d`
		`};class ne extends a{constructor({colors:t,key:k}){super(k);i(this,"colors");this.colors=t}createState(){return new re}}class re extends h{constructor(){super(...arguments);i(this,"index",0);i(this,"handleClick",()=>{this.index=(this.index+1)%this.widget.colors.length,this.setState()})}build(){return n({onClick:()=>{this.handleClick()},child:o({width:200,height:200,color:this.widget.colors[this.index],alignment:l.center,child:n({bubble:{click:!0},onClick:()=>{alert("nested click!")},child:o({padding:P.all(10),color:"yellow",child:r("nested click!",{style:new c({fontSize:20,fontWeight:"bold",color:"black"})})})})})})}}const ce={widget:o({alignment:l.center,color:"lightgreen",child:new ne({colors:["black","red","green"]})}),code:d`
class CustomWidget extends StatefulWidget {
	colors: string[];

	constructor({ colors, key }: { colors: string[]; key?: string }) {
		super(key);
		this.colors = colors;
	}

	createState(): State<StatefulWidget> {
		return new CustomState();
	}
}

class CustomState extends State<CustomWidget> {
	index = 0;
	handleClick = () => {
		this.index = (this.index + 1) % this.widget.colors.length;
		this.setState();
	};
	build() {
		return GestureDetector({
			onClick: () => {
				this.handleClick();
			},
			child: Container({
				width: 200,
				height: 200,
				color: this.widget.colors[this.index],
				alignment: Alignment.center,
				child: GestureDetector({
					bubble: {
						click: true
					},
					onClick: () => {
						alert('nested click!');
					},
					child: Container({
						padding: EdgeInsets.all(10),
						color: 'yellow',
						child: Text('nested click!', {
							style: new TextStyle({ fontSize: 20, fontWeight: 'bold', color: 'black' })
						})
					})
				})
			})
		});
	}
}
		`},ae={title:"Widget/GestureDetector",component:q,parameters:{layout:"fullscreen"},args:{width:"400px",height:"400px",ssrSize:{width:400,height:400}}},g={args:L},u={args:R},S={args:X},m={args:ie},C={args:le},w={args:ce};var p,b,x;g.parameters={...g.parameters,docs:{...(p=g.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: BasicStory
}`,...(x=(b=g.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var y,f,W;u.parameters={...u.parameters,docs:{...(y=u.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: ColorChangeStory
}`,...(W=(f=u.parameters)==null?void 0:f.docs)==null?void 0:W.source}}};var z,T,v;S.parameters={...S.parameters,docs:{...(z=S.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: SizeChangeStory
}`,...(v=(T=S.parameters)==null?void 0:T.docs)==null?void 0:v.source}}};var E,D,B;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: TestStatefulWidgetStory
}`,...(B=(D=m.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};var $,_,A;C.parameters={...C.parameters,docs:{...($=C.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: DynamicallyExistsStory
}`,...(A=(_=C.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var G,j,I;w.parameters={...w.parameters,docs:{...(G=w.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: EventBubbleStory
}`,...(I=(j=w.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};const he=["Basic","ColorChange","SizeChange","TestStatefulWidget","DynamicallyExists","EventBubble"],xe=Object.freeze(Object.defineProperty({__proto__:null,Basic:g,ColorChange:u,DynamicallyExists:C,EventBubble:w,SizeChange:S,TestStatefulWidget:m,__namedExportsOrder:he,default:ae},Symbol.toStringTag,{value:"Module"}));export{g as B,xe as S};
