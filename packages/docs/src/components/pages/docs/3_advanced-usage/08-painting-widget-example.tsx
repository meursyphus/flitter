import Widget from '@meursyphus/flitter-react';
import { 
  Container, 
  Column, 
  Row, 
  Text, 
  Center,
  SizedBox,
  EdgeInsets,
  MainAxisAlignment,
  CrossAxisAlignment,
  BorderRadius,
  BoxDecoration,
  Border,
  BorderSide,
  TextStyle,
  CustomPaint,
  Canvas,
  Paint,
  PaintingStyle,
  Offset,
  Size,
  Path,
  GestureDetector,
  StatefulWidget,
  State,
  type BuildContext
} from '@meursyphus/flitter';

interface PaintingWidgetExampleProps {
  title: string;
  description: string;
}

class _PaintingWidgetExample extends StatefulWidget {
  createState() {
    return new _PaintingWidgetExampleState();
  }
}

class _PaintingWidgetExampleState extends State<_PaintingWidgetExample> {
  selectedRenderer = 'svg';
  showCode = false;
  
  toggleRenderer() {
    this.setState(() => {
      this.selectedRenderer = this.selectedRenderer === 'svg' ? 'canvas' : 'svg';
    });
  }
  
  toggleCode() {
    this.setState(() => {
      this.showCode = !this.showCode;
    });
  }
  
  build(context: BuildContext) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Renderer selector
        Container({
          margin: EdgeInsets.only({ bottom: 20 }),
          child: Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Current Renderer: ', {
                style: new TextStyle({
                  color: '#9CA3AF',
                  fontSize: 14
                })
              }),
              GestureDetector({
                onClick: () => this.toggleRenderer(),
                child: Container({
                  padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
                  decoration: new BoxDecoration({
                    color: this.selectedRenderer === 'svg' ? '#3B82F6' : '#10B981',
                    borderRadius: BorderRadius.circular(6)
                  }),
                  child: Text(this.selectedRenderer.toUpperCase(), {
                    style: new TextStyle({
                      color: '#FFFFFF',
                      fontSize: 13,
                      fontWeight: 'bold'
                    })
                  })
                })
              })
            ]
          })
        }),
        
        // Custom paint widget
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
            size: new Size(300, 200),
            painter: (canvas: Canvas, size: Size) => {
              // 배경 그리드
              const gridPaint = new Paint();
              gridPaint.color = '#1F2937';
              gridPaint.strokeWidth = 1;
              gridPaint.style = PaintingStyle.stroke;
              
              for (let x = 0; x <= size.width; x += 20) {
                canvas.drawLine(
                  new Offset(x, 0),
                  new Offset(x, size.height),
                  gridPaint
                );
              }
              
              for (let y = 0; y <= size.height; y += 20) {
                canvas.drawLine(
                  new Offset(0, y),
                  new Offset(size.width, y),
                  gridPaint
                );
              }
              
              // 원 그리기
              const circlePaint = new Paint();
              circlePaint.color = '#3B82F6';
              circlePaint.style = PaintingStyle.fill;
              canvas.drawCircle(
                new Offset(80, 100),
                30,
                circlePaint
              );
              
              // 사각형 그리기
              const rectPaint = new Paint();
              rectPaint.color = '#10B981';
              rectPaint.style = PaintingStyle.fill;
              canvas.drawRect(
                new Offset(150, 70),
                new Size(60, 60),
                rectPaint
              );
              
              // 경로 그리기
              const pathPaint = new Paint();
              pathPaint.color = '#F59E0B';
              pathPaint.strokeWidth = 3;
              pathPaint.style = PaintingStyle.stroke;
              
              const path = new Path();
              path.moveTo(220, 120);
              path.lineTo(250, 80);
              path.lineTo(280, 100);
              path.lineTo(260, 130);
              path.close();
              
              canvas.drawPath(path, pathPaint);
              
              // 텍스트 (주석으로 표시 - 실제로는 TextPainter 사용)
              // canvas.drawText("Custom Paint", offset, textPaint);
            }
          })
        }),
        
        SizedBox({ height: 20 }),
        
        // Code toggle button
        GestureDetector({
          onClick: () => this.toggleCode(),
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
            decoration: new BoxDecoration({
              color: '#374151',
              borderRadius: BorderRadius.circular(8)
            }),
            child: Text(this.showCode ? '렌더러 비교 숨기기' : '렌더러 비교 보기', {
              style: new TextStyle({
                color: '#FFFFFF',
                fontSize: 14
              })
            })
          })
        }),
        
        // Renderer comparison
        this.showCode ? Container({
          margin: EdgeInsets.only({ top: 20 }),
          padding: EdgeInsets.all(12),
          decoration: new BoxDecoration({
            color: '#1F2937',
            borderRadius: BorderRadius.circular(8)
          }),
          child: Column({
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('SVG vs Canvas 렌더러:', {
                style: new TextStyle({
                  color: '#60A5FA',
                  fontSize: 13,
                  fontWeight: 'bold'
                })
              }),
              SizedBox({ height: 8 }),
              Text('• SVG: DOM 기반, 확대해도 선명, 이벤트 처리 쉬움', {
                style: new TextStyle({
                  color: '#D1D5DB',
                  fontSize: 12
                })
              }),
              Text('• Canvas: 픽셀 기반, 성능 우수, 복잡한 애니메이션', {
                style: new TextStyle({
                  color: '#D1D5DB',
                  fontSize: 12
                })
              }),
              SizedBox({ height: 8 }),
              Text('Flitter는 동일한 API로 두 렌더러 모두 지원!', {
                style: new TextStyle({
                  color: '#34D399',
                  fontSize: 12,
                  fontWeight: 'bold'
                })
              })
            ]
          })
        }) : Container({})
      ]
    });
  }
}

export default function PaintingWidgetExample({ 
  title, 
  description 
}: PaintingWidgetExampleProps) {
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
            widget={new _PaintingWidgetExample()}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-purple-400 font-semibold mb-2">페인팅 위젯 구현</h4>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`class CustomPaintWidget extends SingleChildRenderObjectWidget {
  painter: (canvas: Canvas, size: Size) => void;
  
  createRenderObject() {
    return new RenderCustomPaint(this.painter);
  }
}

class RenderCustomPaint extends RenderBox {
  painter: (canvas: Canvas, size: Size) => void;
  
  paint(context: PaintingContext, offset: Offset) {
    const canvas = context.canvas;
    
    // 변환 적용
    canvas.save();
    canvas.translate(offset.x, offset.y);
    
    // 커스텀 페인팅 실행
    this.painter(canvas, this.size);
    
    // 변환 복원
    canvas.restore();
    
    // 자식 그리기
    super.paint(context, offset);
  }
}`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-orange-400 font-semibold mb-2">Canvas API 예제</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// 기본 도형
canvas.drawRect(rect, paint);
canvas.drawCircle(center, radius, paint);
canvas.drawLine(p1, p2, paint);

// 경로 그리기
const path = new Path();
path.moveTo(x, y);
path.lineTo(x2, y2);
path.quadraticBezierTo(cx, cy, x3, y3);
canvas.drawPath(path, paint);

// Paint 설정
const paint = new Paint();
paint.color = '#3B82F6';
paint.strokeWidth = 2;
paint.style = PaintingStyle.stroke; // or .fill`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}