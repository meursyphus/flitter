import { type Widget } from "@meursyphus/flitter";
type WidgetComponentProps = {
    widget?: Widget;
    width?: string;
    height?: string;
    renderer?: "canvas" | "svg";
};
declare function WidgetComponent({ width, height, renderer, widget, }: WidgetComponentProps): import("react/jsx-runtime").JSX.Element;
export default WidgetComponent;
