import { Vsync } from './Vsync';

class RenderFrameDispatcher {
  private onFrame?: () => void;
  #vsync: Vsync | null = null;
  get vsync() {
    if (!this.#vsync) {
      this.#vsync = Vsync.getInstance();
    }
    return this.#vsync;
  }

  constructor({ onFrame }: { onFrame?: () => void } = {}) {
    this.onFrame = onFrame;
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
