var u=Object.defineProperty;var f=(n,t,e)=>t in n?u(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var h=(n,t,e)=>(f(n,typeof t!="symbol"?t+"":t,e),e);import{W as C}from"./Widget-B6WpeV_a.js";import{d as g}from"./index-DrFu-skq.js";import{U as w,s as x,V as S,G as k,g as _,R as I,C as a}from"./Widget-Dxvrat1N.js";import{C as R}from"./Center-BPlvJyPx.js";let B=class extends w{constructor({children:e,index:i=0,sizing:r=x.loose,alignment:o,key:d}){super({children:e,fit:r,alignment:o,key:d});h(this,"index");this.index=i}createRenderObject(){return new y({index:this.index,fit:this.fit,alignment:this.alignment})}updateRenderObject(e){e.index=this.index,e.fit=this.fit,e.alignment=this.alignment}};class y extends S{constructor({index:e,fit:i,alignment:r}){super({alignment:r,fit:i});h(this,"_index");this._index=e}get index(){return this._index}set index(e){this._index!==e&&(this._index=e,this.markNeedsPaint())}paintChildren(e,{clipId:i,matrix4:r,opacity:o}){this.children.forEach(m=>m.dispose(e));const d=this.children[this.index];k(d!=null),d.paint(e,i,r,o)}}function W({clipped:n,children:t,alignment:e,sizing:i=x.loose,index:r=0,key:o}){return _({clipped:n,clipper:d=>I.fromLTWH({left:0,top:0,width:d.width,height:d.height}),child:new B({key:o,children:t,alignment:e,sizing:i,index:r})})}const b={title:"Widget/IndexedStack",component:C},O=g`
    Center({
        child: IndexedStack({
            index: 0,
            children: [
                Container({
                    width: 200,
                    height: 200,
                    color: 'green'
                }),
                Container({
                    width: 150,
                    height: 150,
                    color: 'purple'
                }),
                Container({
                    width: 100,
                    height: 100,
                    color: 'red'
                })
            ]
        })
    })
`,s={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",code:g`import { Container, Center, IndexedStack } from '@meursyphus/flitter';'\n\n\n`+O,widget:R({child:W({index:0,children:[a({width:200,height:200,color:"green"}),a({width:150,height:150,color:"purple"}),a({width:100,height:100,color:"red"})]})})}};var c,l,p;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    code: dedent\`import { Container, Center, IndexedStack } from '@meursyphus/flitter';'\\n\\n\\n\` + BasicCode,
    widget: Center({
      child: IndexedStack({
        index: 0,
        children: [Container({
          width: 200,
          height: 200,
          color: 'green'
        }), Container({
          width: 150,
          height: 150,
          color: 'purple'
        }), Container({
          width: 100,
          height: 100,
          color: 'red'
        })]
      })
    })
  }
}`,...(p=(l=s.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const j=["Basic"],H=Object.freeze(Object.defineProperty({__proto__:null,Basic:s,__namedExportsOrder:j,default:b},Symbol.toStringTag,{value:"Module"}));export{s as B,H as S};
