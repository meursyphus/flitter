var o=Object.defineProperty;var l=(t,i,e)=>i in t?o(t,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[i]=e;var n=(t,i,e)=>(l(t,typeof i!="symbol"?i+"":i,e),e);import{W as f}from"./Widget-B6WpeV_a.js";import{d as g}from"./index-DrFu-skq.js";import{u as z,x as h,z as S,y as m}from"./Widget-Dxvrat1N.js";import{C as b}from"./Center-BPlvJyPx.js";class C extends z{constructor({child:e,size:r=h.zero,painter:a,key:p}){super({child:e,key:p});n(this,"painter");n(this,"size");this.painter=a,this.size=r}createRenderObject(){return new _({painter:this.painter,preferredSize:this.size})}updateRenderObject(e){e.painter=this.painter,e.preferredSize=this.size}}class _ extends S{constructor({preferredSize:e=h.zero,painter:r}){super({isPainter:!0});n(this,"_painter");n(this,"_preferredSize");this._painter=r,this._preferredSize=e}get painter(){return this._painter}set painter(e){if(this._painter===e)return;const r=this._painter;this._painter=e,this.didUpdatePainter(this._painter,r)}didUpdatePainter(e,r){const{shouldRepaint:a}=e;a!=null&&a(r)&&this.markNeedsPaint()}get preferredSize(){return this._preferredSize}set preferredSize(e){e.equal(this.preferredSize)||(this.preferredSize=e,this.markNeedsLayout())}computeSizeForNoChild(e){return e.constrain(this.preferredSize)}performPaint(e,r){this.painter.paint(e,this.size)}createDefaultSvgEl(e){return this.painter.createDefaultSvgEl(e)}getIntrinsicWidth(e){return this.child==null?Number.isFinite(this.preferredSize.width)?this.preferredSize.width:0:super.getIntrinsicWidth(e)}getIntrinsicHeight(e){return this.child==null?Number.isFinite(this.preferredSize.height)?this.preferredSize.height:0:super.getIntrinsicHeight(e)}}const w=m(C),P={title:"Widget/CustomPaint",component:f},s={args:{ssrSize:{width:400,height:400},width:"400px",height:"400px",widget:b({child:w({size:h.infinite,painter:{createDefaultSvgEl({createSvgEl:t}){return{rect:t("rect")}},paint({rect:t},i){t.setAttribute("fill","red"),t.setAttribute("width",`${i.width}`),t.setAttribute("height",`${i.height}`)}}})}),code:g`
        import { Center, CustomPaint, Size } from '@meursyphus/flitter';

        Center({
            child: CustomPaint({
                size: Size.infinite,
                painter: {
                    paint({ rect }, size) {
                        rect.setAttribute('fill', 'red');
                        rect.setAttribute('width', \`\${size.width}\`);
                        rect.setAttribute('height', \`\${size.height}\`);
                    },

                    createDefaultSvgEl({ createSvgEl }) {
                        const rect = createSvgEl('rect');

                        return {
                            rect
                        };
                    },
                }
            })
        })
        `}};var c,d,u;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    ssrSize: {
      width: 400,
      height: 400
    },
    width: '400px',
    height: '400px',
    widget: Center({
      child: CustomPaint({
        size: Size.infinite,
        painter: {
          createDefaultSvgEl({
            createSvgEl
          }) {
            const rect = createSvgEl('rect');
            return {
              rect
            };
          },
          paint({
            rect
          }, size) {
            rect.setAttribute('fill', 'red');
            rect.setAttribute('width', \`\${size.width}\`);
            rect.setAttribute('height', \`\${size.height}\`);
          }
        }
      })
    }),
    code: dedent\`
        import { Center, CustomPaint, Size } from '@meursyphus/flitter';

        Center({
            child: CustomPaint({
                size: Size.infinite,
                painter: {
                    paint({ rect }, size) {
                        rect.setAttribute('fill', 'red');
                        rect.setAttribute('width', \\\`\\\${size.width}\\\`);
                        rect.setAttribute('height', \\\`\\\${size.height}\\\`);
                    },

                    createDefaultSvgEl({ createSvgEl }) {
                        const rect = createSvgEl('rect');

                        return {
                            rect
                        };
                    },
                }
            })
        })
        \`
  }
}`,...(u=(d=s.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const E=["Basic"],D=Object.freeze(Object.defineProperty({__proto__:null,Basic:s,__namedExportsOrder:E,default:P},Symbol.toStringTag,{value:"Module"}));export{s as B,D as S};
