import {
  Alignment,
  Column,
  Container,
  Expanded,
  GestureDetector,
  GlobalKey,
  MainAxisSize,
  Row,
  SizedBox,
  State,
  StatefulWidget,
  Text,
  TextStyle,
  Widget,
} from "flitter-core";

class SharedCounterCard extends StatefulWidget {
  label: string;

  constructor({ key, label }: { key: GlobalKey; label: string }) {
    super(key);
    this.label = label;
  }

  createState(): State<SharedCounterCard> {
    return new SharedCounterCardState();
  }
}

class SharedCounterCardState extends State<SharedCounterCard> {
  count = 0;

  build(): Widget {
    return GestureDetector({
      onClick: () => {
        this.setState(() => {
          this.count += 1;
        });
      },
      child: Container({
        width: 140,
        height: 140,
        color: "#111827",
        alignment: Alignment.center,
        child: Column({
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(this.widget.label, {
              style: new TextStyle({
                fontSize: 12,
                fontWeight: "600",
                color: "#f9fafb",
              }),
            }),
            SizedBox({ height: 8 }),
            Text(`${this.count}`, {
              style: new TextStyle({
                fontSize: 36,
                fontWeight: "700",
                color: "#34d399",
              }),
            }),
            SizedBox({ height: 8 }),
            Text("Tap card to increment", {
              style: new TextStyle({
                fontSize: 11,
                color: "#cbd5e1",
              }),
            }),
          ],
        }),
      }),
    });
  }
}

class GlobalKeyReparentingDemo extends StatefulWidget {
  createState(): State<GlobalKeyReparentingDemo> {
    return new GlobalKeyReparentingDemoState();
  }
}

class GlobalKeyReparentingDemoState extends State<GlobalKeyReparentingDemo> {
  private sharedKey = new GlobalKey();
  placeOnRight = false;

  build(): Widget {
    return Container({
      color: "#f3f4f6",
      alignment: Alignment.center,
      child: SizedBox({
        width: 720,
        height: 360,
        child: Column({
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("GlobalKey reparenting", {
              style: new TextStyle({
                fontSize: 20,
                fontWeight: "700",
                color: "#111827",
              }),
            }),
            SizedBox({ height: 10 }),
            Text(
              "Increment the card, then move it left and right. The counter should keep its state instead of resetting.",
              {
                style: new TextStyle({
                  fontSize: 13,
                  color: "#4b5563",
                }),
              },
            ),
            SizedBox({ height: 16 }),
            GestureDetector({
              onClick: () => {
                this.setState(() => {
                  this.placeOnRight = !this.placeOnRight;
                });
              },
              child: Container({
                width: 230,
                height: 44,
                color: "#2563eb",
                alignment: Alignment.center,
                child: Text(
                  this.placeOnRight ? "Move card back to left" : "Move card to right",
                  {
                    style: new TextStyle({
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#ffffff",
                    }),
                  },
                ),
              }),
            }),
            SizedBox({ height: 24 }),
            Row({
              children: [
                Expanded({
                  child: SlotPanel({
                    title: "Left Parent",
                    active: !this.placeOnRight,
                    child: !this.placeOnRight
                      ? new SharedCounterCard({
                          key: this.sharedKey,
                          label: "Shared card",
                        })
                      : undefined,
                  }),
                }),
                Expanded({
                  child: SlotPanel({
                    title: "Right Parent",
                    active: this.placeOnRight,
                    child: this.placeOnRight
                      ? new SharedCounterCard({
                          key: this.sharedKey,
                          label: "Shared card",
                        })
                      : undefined,
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
    });
  }
}

function SlotPanel({
  title,
  active,
  child,
}: {
  title: string;
  active: boolean;
  child?: Widget;
}) {
  return Container({
    alignment: Alignment.center,
    child: Column({
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(title, {
          style: new TextStyle({
            fontSize: 14,
            fontWeight: "700",
            color: active ? "#111827" : "#6b7280",
          }),
        }),
        SizedBox({ height: 12 }),
        Container({
          width: 220,
          height: 180,
          color: active ? "#dbeafe" : "#e5e7eb",
          alignment: Alignment.center,
          child:
            child ??
            Text("Empty slot", {
              style: new TextStyle({
                fontSize: 14,
                fontWeight: "600",
                color: "#6b7280",
              }),
            }),
        }),
      ],
    }),
  });
}

const BasicStory = {
  widget: new GlobalKeyReparentingDemo(),
  description:
    "Move the shared card in both directions. Right-to-left exercises active stealing from the old parent before it rebuilds, while left-to-right reclaims the card from the inactive pool.",
};

export default BasicStory;
