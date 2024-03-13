import{W as T}from"./Widget-B6WpeV_a.js";import{d as p}from"./index-DrFu-skq.js";import{X as h,T as r,C as t,E as i,B as g,k as m,j as u,d as x}from"./Widget-Dxvrat1N.js";import{B as w}from"./box-decoration-BcTLV75v.js";import{C as S}from"./Center-BPlvJyPx.js";const y={widget:S({child:h({child:r("hover me"),tooltip:t({child:t({padding:i.all(4),decoration:new w({color:"black",borderRadius:g.all(m.circular(4))}),child:r("tooltip",{style:new u({color:"white"})})})})})}),code:p`
	Center({
		child: Tooltip({
			child: Text('hover me'),
			tooltip: Container({
				child: Container({
					padding: EdgeInsets.all(4),
					decoration: new BoxDecoration({
						color: 'black',
						borderRadius: BorderRadius.all(Radius.circular(4))
					}),
					child: Text('tooltip', { style: new TextStyle({ color: 'white' }) })
				})
			})
		})
	}),
	`},B={widget:S({child:h({position:"centerRight",child:t({width:200,height:200,color:"orange",alignment:x.center,child:r("orange box")}),tooltip:t({child:t({padding:i.all(4),margin:i.only({left:5}),decoration:new w({color:"black",borderRadius:g.all(m.circular(4))}),child:r("tooltip",{style:new u({color:"white"})})})})})}),code:p``},b={title:"Widget/Tooltip",component:T,args:{ssrSize:{width:400,height:400},width:"400px",height:"400px"}},o={args:y},e={args:B};var a,s,c;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: BasicStory
}`,...(c=(s=o.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};var l,d,n;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: ConstrainedTightStory
}`,...(n=(d=e.parameters)==null?void 0:d.docs)==null?void 0:n.source}}};const C=["Basic","ConstrainedTight"],j=Object.freeze(Object.defineProperty({__proto__:null,Basic:o,ConstrainedTight:e,__namedExportsOrder:C,default:b},Symbol.toStringTag,{value:"Module"}));export{o as B,j as S};
