class RenderFrameDispatcher {
  private onFrame?: () => void;
  constructor({ onFrame }: { onFrame?: () => void } = {}) {
    this.onFrame = onFrame;
  }

  setOnFrame(callback: () => void) {
    this.onFrame = () => callback();
  }

  dispatch() {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      this.onFrame?.();
    });
  }
}

export default RenderFrameDispatcher;
