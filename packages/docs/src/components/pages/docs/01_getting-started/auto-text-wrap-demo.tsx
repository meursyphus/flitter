import {
  Alignment,
  BuildContext,
  Center,
  Container,
  GestureDetector,
  Positioned,
  Stack,
  State,
  StatefulWidget,
  Text,
  TextAlign,
  TextStyle,

  EdgeInsets,
  BoxDecoration,
  Border,
  BorderSide,
  BorderRadius,
} from "@meursyphus/flitter";
import Widget from '@meursyphus/flitter-react';

class ResizableTextWidget extends StatefulWidget {
  createState(): State<StatefulWidget> {
    return new ResizableTextState();
  }
}

class ResizableTextState extends State<ResizableTextWidget> {
  width = 400;
  height = 200;
  hovered: "left" | "right" | null = null;

  clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  handleSize = (type: "left" | "right") => (e: MouseEvent) => {
    const delta = e.movementX * (type === "right" ? 1 : -1);
    this.setState(() => {
      this.width = this.clamp(this.width + delta, 150, 600);
    });
  };

  getGestureProps = (type: "left" | "right") => {
    return {
      cursor: "ew-resize" as "ew-resize",
      onMouseEnter: () => {
        this.setState(() => {
          this.hovered = type;
        });
      },
      onMouseLeave: () => {
        this.setState(() => {
          this.hovered = null;
        });
      },
      onDragMove: this.handleSize(type),
      child: Container({
        color: this.hovered === type ? "#3B82F6" : "#9CA3AF",
        width: 4,
      }),
    };
  };

  build(_context: BuildContext) {
    return Container({
      padding: EdgeInsets.all(20),
      child: Stack({
        alignment: Alignment.center,
        children: [
          Container({
            width: this.width,
            height: this.height,
            decoration: new BoxDecoration({
              color: "#F3F4F6",
              borderRadius: BorderRadius.circular(8),
              border: new Border({
                top: new BorderSide({ color: "#E5E7EB", width: 2 }),
                right: new BorderSide({ color: "#E5E7EB", width: 2 }),
                bottom: new BorderSide({ color: "#E5E7EB", width: 2 }),
                left: new BorderSide({ color: "#E5E7EB", width: 2 })
              }),
            }),
            padding: EdgeInsets.all(20),
            child: Center({
              child: Text(
                "긴 텍스트가 자동으로 줄바꿈되고 가운데 정렬됩니다. 좌우 테두리를 드래그해서 너비를 조절해보세요!",
                {
                  textAlign: TextAlign.center,
                  style: new TextStyle({
                    color: "#1F2937",
                    fontSize: 18,
                    fontFamily: "Pretendard, sans-serif",
                    height: 1.6,
                  }),
                },
              ),
            }),
          }),
          // 크기 조절 힌트 텍스트
          Positioned({
            bottom: -40,
            child: Text("↔ 좌우 테두리를 드래그해서 크기를 조절해보세요", {
              style: new TextStyle({
                color: "#374151",
                fontSize: 14,
                fontWeight: 'bold',
              }),
            }),
          }),
          // 좌측 리사이즈 핸들
          Positioned({
            top: 0,
            bottom: 0,
            left: -2,
            child: GestureDetector({ ...this.getGestureProps("left") }),
          }),
          // 우측 리사이즈 핸들
          Positioned({
            top: 0,
            bottom: 0,
            right: -2,
            child: GestureDetector({ ...this.getGestureProps("right") }),
          }),
        ],
      }),
    });
  }
}

export default function AutoTextWrapDemo() {
  return (
    <div className="my-8">
      <Widget 
        widget={new ResizableTextWidget()} 
        width="100%" 
        height="300px"
        renderer="canvas" 
      />
    </div>
  );
}