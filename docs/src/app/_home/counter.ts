import {
  Center, Column, Container, EdgeInsets, GestureDetector,
  MainAxisSize, State, StatefulWidget, Text, TextStyle,
} from "flitter-ui";

const font = (color: string, fontSize = 15) =>
  new TextStyle({ fontFamily: "sans-serif", fontSize, color });

export class Counter extends StatefulWidget {
  createState() {
    return new CounterState();
  }
}

class CounterState extends State<Counter> {
  count = 0;

  build() {
    return Center({
      child: Column({
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(`${this.count}`, { style: font("#3b82f6", 64) }),
          GestureDetector({
            cursor: "pointer",
            onClick: () => this.setState(() => this.count++),
            child: Container({
              padding: EdgeInsets.all(12),
              color: "#3b82f6",
              child: Text("Count up", { style: font("#ffffff") }),
            }),
          }),
        ],
      }),
    });
  }
}
