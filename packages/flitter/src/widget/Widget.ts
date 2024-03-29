import type Element from "../element/Element";

class Widget {
  key?: any;
  constructor(key?: any) {
    this.key = key;
    //
  }
  runtimeType = this.constructor.name;
  createElement(): Element {
    throw { message: "not implemented" };
  }

  static canUpdate(oldWidget: Widget, newWidget: Widget): boolean {
    // TODO key 추
    return (
      oldWidget.runtimeType === newWidget.runtimeType &&
      oldWidget.key === newWidget.key
    );
  }

  toJSON() {
    return {
      key: this.key,
      runtimeType: this.runtimeType,
    };
  }
}

export default Widget;
