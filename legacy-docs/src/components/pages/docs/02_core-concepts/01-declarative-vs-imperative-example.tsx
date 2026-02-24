import React from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Center, 
  Container, 
  Text, 
  Column, 
  GestureDetector,
  EdgeInsets,
  TextStyle,
  SizedBox,
  MainAxisAlignment,
  CrossAxisAlignment,
  StatefulWidget,
  State,
  BoxDecoration,
  BorderRadius,
  Border,
  BorderSide,
  type BuildContext,
  type Widget as FlitterWidget
} from '@meursyphus/flitter';

interface DeclarativeVsImperativeExampleProps {
  title: string;
  description: string;
  labels: {
    imperativeTitle: string;
    imperativeDescription: string;
    declarativeTitle: string;
    changeButton: string;
    keyDifferencesTitle: string;
    imperativeDescription2: string;
    declarativeDescription2: string;
  };
}

// Flitter StatefulWidget  
class _FlitterExample extends StatefulWidget {
  constructor(public props: { labels: DeclarativeVsImperativeExampleProps['labels'] }) {
    super();
  }
  
  createState() {
    return new FlitterExampleState();
  }
}

class FlitterExampleState extends State<_FlitterExample> {
  texts = ["Hello, World!", "안녕하세요!", "こんにちは!", "Bonjour!"];
  currentIndex = 0;

  build(context: BuildContext): FlitterWidget {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(this.texts[this.currentIndex], {
          style: new TextStyle({ fontSize: 24, color: '#ffffff' })
        }),
        SizedBox({ height: 20 }),
        GestureDetector({
          onClick: () => {
            this.setState(() => {
              this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            });
          },
          child: Container({
            padding: EdgeInsets.all(12),
            decoration: new BoxDecoration({
              color: '#3b82f6',
              borderRadius: BorderRadius.circular(4),
              border: new Border({
                top: new BorderSide({ color: '#3b82f6', width: 1 }),
                right: new BorderSide({ color: '#3b82f6', width: 1 }),
                bottom: new BorderSide({ color: '#3b82f6', width: 1 }),
                left: new BorderSide({ color: '#3b82f6', width: 1 })
              })
            }),
            child: Text(this.widget.props.labels.changeButton, {
              style: new TextStyle({ color: '#ffffff' })
            })
          })
        })
      ]
    });
  }
}

// Factory function for the widget
function FlitterExample(props: { labels: DeclarativeVsImperativeExampleProps['labels'] }): FlitterWidget {
  return new _FlitterExample(props);
}

export default function DeclarativeVsImperativeExample({ 
  title, 
  description,
  labels
}: DeclarativeVsImperativeExampleProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* D3.js 명령형 예제 - 코드만 표시 */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">{labels.imperativeTitle}</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-4">
              {labels.imperativeDescription}
            </p>
            <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-gray-300">{`// 1. SVG 요소 선택 및 설정
const svg = d3.select("svg");
const width = 400;
const height = 200;

// 2. 텍스트 요소 생성 및 위치 설정
const text = svg.append("text")
  .text("Hello, World!")
  .attr("x", width / 2)
  .attr("y", height / 2)
  .attr("text-anchor", "middle")
  .attr("font-size", "24px");

// 3. 버튼 생성 (여러 단계 필요)
const button = svg.append("g")
  .attr("transform", \`translate(\${width/2}, \${height/2 + 40})\`);

const buttonRect = button.append("rect")
  .attr("x", -60)
  .attr("y", -15)
  .attr("width", 120)
  .attr("height", 30)
  .attr("fill", "#2196F3");

button.append("text")
  .text("텍스트 변경")
  .attr("text-anchor", "middle")
  .attr("fill", "white");

// 4. 이벤트 핸들러 (DOM 직접 조작)
let currentIndex = 0;
const texts = ["Hello!", "안녕!", "こんにちは!", "Bonjour!"];

buttonRect.on("click", () => {
  currentIndex = (currentIndex + 1) % texts.length;
  text.text(texts[currentIndex]);
  // 텍스트가 길어지면 위치 재계산 필요...
});`}</code>
            </pre>
          </div>
        </div>

        {/* Flitter 선언형 예제 */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">{labels.declarativeTitle}</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex justify-center items-center" style={{ height: '200px' }}>
              <Widget
                width="100%"
                height="100%"
                renderer="svg"
                widget={Center({ child: FlitterExample({ labels }) })}
              />
            </div>
          </div>
          <pre className="mt-4 bg-gray-950 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300">{`// UI가 어떻게 보일지만 선언
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State<MyWidget> {
  texts = ["Hello!", "안녕!", "こんにちは!", "Bonjour!"];
  currentIndex = 0;

  build(context) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Center({
          child: Text(this.texts[this.currentIndex])
        }),
        GestureDetector({
          onClick: () => {
            this.setState(() => {
              this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            });
          },
          child: Container({
            padding: EdgeInsets.all(12),
            color: Colors.blue,
            child: Text("텍스트 변경")
          })
        })
      ]
    });
  }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <h4 className="text-lg font-medium mb-3 text-blue-200">💡 {labels.keyDifferencesTitle}</h4>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li><strong className="text-white">{labels.imperativeTitle}</strong>: {labels.imperativeDescription2}</li>
          <li><strong className="text-white">{labels.declarativeTitle}</strong>: {labels.declarativeDescription2}</li>
        </ul>
      </div>
    </div>
  );
}