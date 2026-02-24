import Widget from '@meursyphus/flitter-react';
import { 
  Container, 
  Column, 
  Row, 
  Text, 
  SizedBox,
  EdgeInsets,
  MainAxisAlignment,
  BorderRadius,
  BoxDecoration,
  Border,
  BorderSide,
  TextStyle,
  CustomPaint,
  Size,
  GestureDetector,
  StatefulWidget,
  State,
  type BuildContext
} from '@meursyphus/flitter';

interface CustomPaintUsageProps {
  title: string;
  description: string;
}

class _CustomPaintUsage extends StatefulWidget {
  createState() {
    return new _CustomPaintUsageState();
  }
}

class _CustomPaintUsageState extends State<_CustomPaintUsage> {
  currentExample = 'basic';
  
  selectExample(example: string) {
    this.setState(() => {
      this.currentExample = example;
    });
  }
  
  getExamplePainter() {
    switch (this.currentExample) {
      case 'basic':
        return {
          dependencies: this.currentExample,
          shouldRepaint: (oldPainter: any) => oldPainter.dependencies !== this.currentExample,
          canvas: {
            paint: (context: any, size: Size) => {
              const ctx = context.canvas;
              ctx.fillStyle = '#3B82F6';
              ctx.beginPath();
              ctx.arc(size.width / 2, size.height / 2, 50, 0, Math.PI * 2);
              ctx.fill();
            }
          },
          svg: {
            createDefaultSvgEl: (context: any) => ({
              circle: context.createSvgEl('circle')
            }),
            paint: (els: any, size: Size) => {
              els.circle.setAttribute('cx', `${size.width / 2}`);
              els.circle.setAttribute('cy', `${size.height / 2}`);
              els.circle.setAttribute('r', '50');
              els.circle.setAttribute('fill', '#3B82F6');
            }
          }
        };
        
      case 'multiple':
        return {
          dependencies: this.currentExample,
          shouldRepaint: (oldPainter: any) => oldPainter.dependencies !== this.currentExample,
          canvas: {
            paint: (context: any, size: Size) => {
              const ctx = context.canvas;
              
              // 사각형
              ctx.fillStyle = '#3B82F6';
              ctx.fillRect(20, 20, 60, 60);
              
              // 원
              ctx.fillStyle = '#10B981';
              ctx.beginPath();
              ctx.arc(size.width / 2, size.height / 2, 30, 0, Math.PI * 2);
              ctx.fill();
              
              // 선
              ctx.strokeStyle = '#F59E0B';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(size.width - 80, 20);
              ctx.lineTo(size.width - 20, 80);
              ctx.stroke();
            }
          },
          svg: {
            createDefaultSvgEl: (context: any) => ({
              rect: context.createSvgEl('rect'),
              circle: context.createSvgEl('circle'),
              line: context.createSvgEl('line')
            }),
            paint: (els: any, size: Size) => {
              els.rect.setAttribute('x', '20');
              els.rect.setAttribute('y', '20');
              els.rect.setAttribute('width', '60');
              els.rect.setAttribute('height', '60');
              els.rect.setAttribute('fill', '#3B82F6');
              
              els.circle.setAttribute('cx', `${size.width / 2}`);
              els.circle.setAttribute('cy', `${size.height / 2}`);
              els.circle.setAttribute('r', '30');
              els.circle.setAttribute('fill', '#10B981');
              
              els.line.setAttribute('x1', `${size.width - 80}`);
              els.line.setAttribute('y1', '20');
              els.line.setAttribute('x2', `${size.width - 20}`);
              els.line.setAttribute('y2', '80');
              els.line.setAttribute('stroke', '#F59E0B');
              els.line.setAttribute('stroke-width', '3');
            }
          }
        };
        
      case 'path':
        return {
          dependencies: this.currentExample,
          shouldRepaint: (oldPainter: any) => oldPainter.dependencies !== this.currentExample,
          canvas: {
            paint: (context: any, size: Size) => {
              const ctx = context.canvas;
              const centerX = size.width / 2;
              const centerY = size.height / 2;
              const radius = 50;
              
              ctx.fillStyle = '#8B5CF6';
              ctx.beginPath();
              
              for (let i = 0; i < 5; i++) {
                const angle = (i * 144 - 90) * Math.PI / 180;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                if (i === 0) {
                  ctx.moveTo(x, y);
                } else {
                  ctx.lineTo(x, y);
                }
              }
              
              ctx.closePath();
              ctx.fill();
            }
          },
          svg: {
            createDefaultSvgEl: (context: any) => ({
              path: context.createSvgEl('path')
            }),
            paint: (els: any, size: Size) => {
              const centerX = size.width / 2;
              const centerY = size.height / 2;
              const radius = 50;
              
              let pathData = '';
              for (let i = 0; i < 5; i++) {
                const angle = (i * 144 - 90) * Math.PI / 180;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                
                if (i === 0) {
                  pathData += `M ${x} ${y}`;
                } else {
                  pathData += ` L ${x} ${y}`;
                }
              }
              pathData += ' Z';
              
              els.path.setAttribute('d', pathData);
              els.path.setAttribute('fill', '#8B5CF6');
            }
          }
        };
        
      default:
        return {
          dependencies: 'empty',
          canvas: { paint: () => {} },
          svg: {
            createDefaultSvgEl: () => ({}),
            paint: () => {}
          }
        };
    }
  }
  
  getExampleCode() {
    switch (this.currentExample) {
      case 'basic':
        return `CustomPaint({
  size: new Size(300, 200),
  painter: {
    canvas: {
      paint: (context, size) => {
        const ctx = context.canvas;
        ctx.fillStyle = '#3B82F6';
        ctx.beginPath();
        ctx.arc(size.width/2, size.height/2, 50, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
});`;
      case 'multiple':
        return `// 여러 도형 그리기
painter: {
  canvas: {
    paint: (context, size) => {
      const ctx = context.canvas;
      
      // 사각형
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(20, 20, 60, 60);
      
      // 원
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(size.width/2, size.height/2, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // 선
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(size.width - 80, 20);
      ctx.lineTo(size.width - 20, 80);
      ctx.stroke();
    }
  }
}`;
      case 'path':
        return `// Canvas Path로 별 그리기
canvas: {
  paint: (context, size) => {
    const ctx = context.canvas;
    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const radius = 50;
    
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    
    for (let i = 0; i < 5; i++) {
      const angle = (i * 144 - 90) * Math.PI / 180;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
  }
}`;
      default:
        return '';
    }
  }
  
  build(context: BuildContext) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Example selector
        Row({
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            this.createButton('basic', '기본'),
            SizedBox({ width: 10 }),
            this.createButton('multiple', '여러 도형'),
            SizedBox({ width: 10 }),
            this.createButton('path', '경로')
          ]
        }),
        
        SizedBox({ height: 20 }),
        
        // Canvas area
        Container({
          width: 300,
          height: 200,
          decoration: new BoxDecoration({
            color: '#0F172A',
            border: new Border({
              top: new BorderSide({ width: 2, color: '#374151' }),
              right: new BorderSide({ width: 2, color: '#374151' }),
              bottom: new BorderSide({ width: 2, color: '#374151' }),
              left: new BorderSide({ width: 2, color: '#374151' })
            }),
            borderRadius: BorderRadius.circular(8)
          }),
          child: CustomPaint({
            size: new Size({ width: 300, height: 200 }),
            painter: this.getExamplePainter()
          })
        }),
        
        SizedBox({ height: 20 }),
        
        // Code display
        Container({
          width: 350,
          padding: EdgeInsets.all(12),
          decoration: new BoxDecoration({
            color: '#1F2937',
            borderRadius: BorderRadius.circular(8)
          }),
          child: Text(this.getExampleCode(), {
            style: new TextStyle({
              color: '#D1D5DB',
              fontSize: 11
            })
          })
        })
      ]
    });
  }
  
  createButton(value: string, label: string) {
    const isSelected = this.currentExample === value;
    return GestureDetector({
      onClick: () => this.selectExample(value),
      child: Container({
        padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
        decoration: new BoxDecoration({
          color: isSelected ? '#3B82F6' : '#374151',
          borderRadius: BorderRadius.circular(6)
        }),
        child: Text(label, {
          style: new TextStyle({
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: isSelected ? 'bold' : 'normal'
          })
        })
      })
    });
  }
}

export default function CustomPaintUsage({ 
  title, 
  description 
}: CustomPaintUsageProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <Widget
            width="100%"
            height="450px"
            renderer="svg"
            widget={new _CustomPaintUsage()}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">Canvas API 사용법</h4>
            <pre className="text-sm text-gray-300">
              <code>{`canvas: {
  paint: (context, size) => {
    const ctx = context.canvas;
    
    // 색상 설정
    ctx.fillStyle = '#3B82F6';
    ctx.strokeStyle = '#FF0000';
    
    // 선 설정
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';
    
    // 그리기
    ctx.fillRect(x, y, w, h);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-green-400 font-semibold mb-2">최적화 팁</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// shouldRepaint 사용
CustomPaint({
  painter: {
    dependencies: myData,
    shouldRepaint: (oldPainter) => {
      // 데이터가 변경되었을 때만 다시 그림
      return oldPainter.dependencies !== myData;
    },
    canvas: {
      paint: (context, size) => {
        // 그리기 로직
      }
    }
  }
})`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}