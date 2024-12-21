import { Vsync } from './Vsync';

class RenderFrameDispatcher {
  private onFrame?: () => void;
  private vsync: Vsync;

  constructor({ onFrame }: { onFrame?: () => void } = {}) {
    this.onFrame = onFrame;
    this.vsync = Vsync.getInstance();
  }

  setOnFrame(callback: () => void) {
    this.onFrame = () => callback();
  }

  dispatch() {
    if (typeof window === "undefined") return;
    this.vsync.requestCallback(() => {
      this.onFrame?.();
    });
  }
}

export default RenderFrameDispatcher;
