class RenderFrameDispatcher {
  private onFrame?: () => void;
  constructor({ onFrame }: { onFrame?: () => void } = {}) {
    this.onFrame = onFrame;
  }

  setOnFrame(callback: () => void) {
    this.onFrame = () => callback();
  }

  // Actually we dont need to invoke browser to render because browser automatically render its own state periodically
  // so Here we just call onFrame callback.
  dispatch() {
    if (typeof window === "undefined") {
      setTimeout(() => {
        this.onFrame?.();
      }, 0);
    } else {
      window.requestAnimationFrame(() => {
        this.onFrame?.();
      });
    }
  }
}

export default RenderFrameDispatcher;
