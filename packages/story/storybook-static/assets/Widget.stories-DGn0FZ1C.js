var T=Object.defineProperty;var W=(o,t,e)=>t in o?T(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var f=(o,t,e)=>(W(o,typeof t!="symbol"?t+"":t,e),e),w=(o,t,e)=>{if(!t.has(o))throw TypeError("Cannot "+e)};var C=(o,t,e)=>(w(o,t,"read from private field"),e?e.call(o):t.get(o)),I=(o,t,e)=>{if(t.has(o))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(o):t.set(o,e)},u=(o,t,e,m)=>(w(o,t,"write to private field"),m?m.call(o,e):t.set(o,e),e);import{W as E}from"./Widget-B6WpeV_a.js";import{d as g}from"./index-DrFu-skq.js";import{u as v,z as F,y as M,S as x,i as c,C as i,t as N,O as q}from"./Widget-Dxvrat1N.js";import{B as p}from"./box-decoration-BcTLV75v.js";import{R as G}from"./Row-Df4bPl7Z.js";class H extends v{constructor({key:e,child:m,zIndex:L}){super({key:e,child:m});f(this,"zIndex");this.zIndex=L}createRenderObject(){return new J({zIndex:this.zIndex})}updateRenderObject(e){e.zIndex=this.zIndex}}var r;class J extends F{constructor({zIndex:e}){super({isPainter:!1});I(this,r,void 0);u(this,r,e)}get zIndex(){return C(this,r)}set zIndex(e){C(this,r)!==e&&(u(this,r,e),this.markNeedsPaint(),this.didChangeDomOrder())}accept(e){e.visitZIndex(this)}}r=new WeakMap;const n=M(H);function K(){return x({children:[c({top:0,left:0,child:i({width:100,height:100,color:"lightblue",child:n({zIndex:9999,child:i({width:100,height:100,decoration:new p({shape:"circle",color:"black"})})})})}),c({top:50,left:0,child:i({width:100,height:100,color:"orange"})})]})}const Q={widget:K(),code:g`
import { Container, Positioned, Stack, ZIndex } from '@meursyphus/flitter';

Stack({
	children: [
		Positioned({
			top: 0,
			left: 0,
			child: Container({
				width: 100,
				height: 100,
				color: 'lightblue',
				child: ZIndex({
					zIndex: 9999,
					child: Container({
						width: 100,
						height: 100,
						decoration: new BoxDecoration({
							shape: 'circle',
							color: 'black'
						})
					})
				})
			})
		}),
		Positioned({
			top: 50,
			left: 0,
			child: Container({
				width: 100,
				height: 100,
				color: 'orange'
			})
		})
	]
});
`};function U(){return x({children:[c({top:0,left:0,child:n({zIndex:0,child:i({width:100,height:100,color:"lightblue",child:n({zIndex:9999,child:i({width:100,height:100,decoration:new p({shape:"circle",color:"black"})})})})})}),c({top:50,left:0,child:i({width:100,height:100,color:"orange"})})]})}const V={widget:U(),code:g`
import {
	BoxDecoration,
	Container,
	Positioned,
	Stack,
	ZIndex
} from '@meursyphus/flitter';

Stack({
	children: [
		Positioned({
			top: 0,
			left: 0,
			child: ZIndex({
				zIndex: 0,
				child: Container({
					width: 100,
					height: 100,
					color: 'lightblue',
					child: ZIndex({
						zIndex: 9999,
						child: Container({
							width: 100,
							height: 100,
							decoration: new BoxDecoration({
								shape: 'circle',
								color: 'black'
							})
						})
					})
				})
			})
		}),
		Positioned({
			top: 50,
			left: 0,
			child: Container({
				width: 100,
				height: 100,
				color: 'orange'
			})
		})
	]
});
`};function X(){return x({children:[c({top:0,left:0,child:n({zIndex:0,child:i({width:100,height:100,color:"lightblue",child:n({zIndex:-1,child:i({width:100,height:100,decoration:new p({shape:"circle",color:"black"})})})})})})]})}const Y={widget:X(),code:g`
import {
	BoxDecoration,
	Container,
	Positioned,
	Stack,
	ZIndex
} from '@meursyphus/flitter';

Stack({
	children: [
		Positioned({
			top: 0,
			left: 0,
			child: ZIndex({
				zIndex: 0,
				child: Container({
					width: 100,
					height: 100,
					color: 'lightblue',
					child: ZIndex({
						zIndex: -1,
						child: Container({
							width: 100,
							height: 100,
							decoration: new BoxDecoration({
								shape: 'circle',
								color: 'black'
							})
						})
					})
				})
			})
		})
	]
});
`};function ee(){return x({children:[c({top:0,left:0,child:i({width:100,height:100,color:"lightblue",child:n({zIndex:-1,child:i({width:100,height:100,decoration:new p({shape:"circle",color:"black"})})})})})]})}const te={widget:ee(),code:g`
import {
	BoxDecoration,
	Container,
	Positioned,
	Stack,
	ZIndex
} from '@meursyphus/flitter';

Stack({
	children: [
		Positioned({
			top: 0,
			left: 0,
			child: Container({
				width: 100,
				height: 100,
				color: 'lightblue',
				child: ZIndex({
					zIndex: -1,
					child: Container({
						width: 100,
						height: 100,
						decoration: new BoxDecoration({
							shape: 'circle',
							color: 'black'
						})
					})
				})
			})
		})
	]
});
`};function oe(){return x({children:[c({top:0,left:0,child:n({zIndex:0,child:i({width:100,height:100,color:"lightblue",child:G({children:[i({width:50,height:50,color:"red"}),N.translate({offset:new q({x:-25,y:0}),child:n({zIndex:-1,child:i({width:50,height:50,decoration:new p({shape:"circle",color:"black"})})})})]})})})})]})}const ie={widget:oe(),code:g`
import {
	BoxDecoration,
	Container,
	Positioned,
	Stack,
	ZIndex
} from '@meursyphus/flitter';

Stack({
	children: [
		Positioned({
			top: 0,
			left: 0,
			child: ZIndex({
				zIndex: 0,
				child: Container({
					width: 100,
					height: 100,
					color: 'lightblue',
					child: Row({
						children: [
							Container({
								width: 50,
								height: 50,
								color: 'red'
							}),
							Transform.translate({
								offset: new Offset({ x: -25, y: 0 }),
								child: ZIndex({
									zIndex: -1,
									child: Container({
										width: 50,
										height: 50,
										decoration: new BoxDecoration({
											shape: 'circle',
											color: 'black'
										})
									})
								})
							})
						]
					})
				})
			})
		})
	]
});
`},ne={title:"Widget/ZIndex",component:E,args:{ssrSize:{width:600,height:300},width:"600px",height:"300px"}},a={args:Q},d={name:"Stacking Context/Case1",args:V},s={name:"Stacking Context/Case2",args:Y},h={name:"Stacking Context/Case3",args:te},l={name:"Stacking Context/Case4",args:ie};var S,k,z;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: Stories.Basic
}`,...(z=(k=a.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var b,Z,B;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  name: 'Stacking Context/Case1',
  args: Stories.StackingContext.Case1
}`,...(B=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:B.source}}};var P,y,D;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`{
  name: 'Stacking Context/Case2',
  args: Stories.StackingContext.Case2
}`,...(D=(y=s.parameters)==null?void 0:y.docs)==null?void 0:D.source}}};var O,R,_;h.parameters={...h.parameters,docs:{...(O=h.parameters)==null?void 0:O.docs,source:{originalSource:`{
  name: 'Stacking Context/Case3',
  args: Stories.StackingContext.Case3
}`,...(_=(R=h.parameters)==null?void 0:R.docs)==null?void 0:_.source}}};var j,$,A;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  name: 'Stacking Context/Case4',
  args: Stories.StackingContext.Case4
}`,...(A=($=l.parameters)==null?void 0:$.docs)==null?void 0:A.source}}};const re=["Basic","Case1","Case2","Case3","Case4"],ge=Object.freeze(Object.defineProperty({__proto__:null,Basic:a,Case1:d,Case2:s,Case3:h,Case4:l,__namedExportsOrder:re,default:ne},Symbol.toStringTag,{value:"Module"}));export{a as B,ge as S};
