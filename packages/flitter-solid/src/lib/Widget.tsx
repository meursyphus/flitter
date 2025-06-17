import { Component, createEffect, onCleanup, JSX } from 'solid-js';
import { AppRunner, type Widget } from '@meursyphus/flitter';

type WidgetComponentProps = {
  widget?: Widget;
  width?: string;
  height?: string;
  renderer?: 'canvas' | 'svg';
};

const WidgetComponent: Component<WidgetComponentProps> = (props) => {
  let containerRef: HTMLDivElement | undefined;
  let elementRef: HTMLCanvasElement | SVGSVGElement | undefined;
  let appRunner: AppRunner | undefined;

  createEffect(() => {
    if (!props.widget || !containerRef || !elementRef) return;

    // Clean up previous instance if it exists
    if (appRunner) {
      appRunner.dispose();
    }

    // Create new AppRunner instance
    appRunner = new AppRunner({
      view: elementRef as HTMLCanvasElement | SVGSVGElement,
    });

    // Mount the widget
    appRunner.runApp(props.widget);

    // Cleanup on unmount or when widget changes
    onCleanup(() => {
      if (appRunner) {
        appRunner.dispose();
        appRunner = undefined;
      }
    });
  });

  const containerStyle: JSX.CSSProperties = {
    width: props.width || '100%',
    height: props.height || '300px',
    position: 'relative',
  };

  const elementStyle: JSX.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      {props.renderer === 'canvas' ? (
        <canvas ref={elementRef as HTMLCanvasElement} style={elementStyle} />
      ) : (
        <svg ref={elementRef as SVGSVGElement} style={elementStyle} />
      )}
    </div>
  );
};

export default WidgetComponent;