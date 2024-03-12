import { type Widget } from "@meursyphus/flitter";
type WidgetComponentProps = {
    widget?: Widget;
    width?: string;
    height?: string;
};
declare function WidgetComponent({ width, height, widget, }: WidgetComponentProps): import("react/jsx-runtime").JSX.Element;
export default WidgetComponent;
