var r=Object.defineProperty;var a=(e,i,t)=>i in e?r(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var s=(e,i,t)=>(a(e,typeof i!="symbol"?i+"":i,t),t);import{u as p,z as n,G as y,y as h}from"./Widget-Dxvrat1N.js";let d=class extends p{constructor({child:t,opacity:c,key:o}){super({child:t,key:o});s(this,"opacity");this.opacity=c}createRenderObject(){return new l({opacity:this.opacity})}updateRenderObject(t){t.opacityProp=this.opacity}};class l extends n{constructor({opacity:t}){super({isPainter:!1});s(this,"_opacityProp");this._opacityProp=t}get opacityProp(){return this._opacityProp}set opacityProp(t){y(t>=0&&t<=1),this._opacityProp=t,this.markNeedsPaint()}preformLayout(){this.child!=null&&(this.child.layout(this.constraints),this.size=this.child.size)}getChildOpacity(t){return t*this.opacityProp}}const g=h(d);export{g as O};