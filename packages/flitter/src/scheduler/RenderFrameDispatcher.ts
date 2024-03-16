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
  private idle = true;
  dispatch() {
    if (typeof window === "undefined") {
      setTimeout(() => {
        this.onFrame?.();
      }, 0);
    } else {
      if (!this.idle) return;
      this.idle = false;
      window.requestAnimationFrame(() => {
        this.onFrame?.();
        this.idle = true;
      });
    }
  }
}

export default RenderFrameDispatcher;
