import { component$, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik';
import type { Widget as FlitterWidget } from '@meursyphus/flitter';
import { AppRunner, Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';

export interface WidgetProps {
  widget?: FlitterWidget;
  width?: string;
  height?: string;
  renderer?: 'canvas' | 'svg';
  class?: string;
  onClick$?: QRL<() => void>;
}

export const Widget = component$<WidgetProps>(({
  widget,
  width = '100%',
  height = '300px',
  renderer = 'svg',
  class: className,
  onClick$
}) => {
  const containerRef = useSignal<HTMLDivElement>();
  const viewRef = useSignal<SVGSVGElement | HTMLCanvasElement>();
  const runnerRef = useSignal<AppRunner>();

  // Default widget if none provided
  const defaultWidget = Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text('Hello Flitter + Qwik!', {
      style: new TextStyle({
        fontSize: 24,
        fontWeight: 'bold'
      })
    })
  });

  useVisibleTask$(({ track, cleanup }) => {
    // Track widget changes
    track(() => widget);

    if (!containerRef.value || !viewRef.value) return;

    // Clean up previous runner
    if (runnerRef.value) {
      runnerRef.value.dispose();
    }

    // Create new runner
    const runner = new AppRunner({
      view: viewRef.value,
      window: window,
      document: document,
    });

    // Run the app with the widget
    runner.runApp(widget || defaultWidget);
    runner.onMount({ resizeTarget: containerRef.value });

    // Store runner reference
    runnerRef.value = runner;

    // Cleanup on unmount or widget change
    cleanup(() => {
      if (runnerRef.value) {
        runnerRef.value.dispose();
        runnerRef.value = undefined;
      }
    });
  });

  return (
    <div
      ref={containerRef}
      class={className}
      onClick$={onClick$}
      style={{
        position: 'relative',
        width,
        height,
        overflow: 'hidden'
      }}
    >
      {renderer === 'svg' ? (
        <svg
          ref={viewRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      ) : (
        <canvas
          ref={viewRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
});

export default Widget;