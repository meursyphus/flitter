/**
 * Vsync manages requestAnimationFrame calls by queuing callbacks and executing them
 * in a single animation frame to optimize performance.
 */
export class Vsync {
  private callbacks: ((time: number) => void)[];
  private frameRequested: boolean;
  private rafId: number | null;

  private constructor() {
    this.callbacks = [];
    this.frameRequested = false;
    this.rafId = null;
  }

  public static getInstance(): Vsync {
    if (typeof window === 'undefined') {
      throw new Error('Vsync requires window object');
    }
    
    if (!(window as any).__flitter_vsync__) {
      (window as any).__flitter_vsync__ = new Vsync();
    }
    return (window as any).__flitter_vsync__;
  }

  /**
   * Schedules a callback to be executed in the next animation frame.
   * If there's already a frame requested, the callback will be queued
   * to run with other callbacks in that frame.
   */
  public requestCallback(callback: (time: number) => void): void {
    this.callbacks.push(callback);
    
    if (!this.frameRequested) {
      this.frameRequested = true;
      this.rafId = requestAnimationFrame(this.handleFrame);
    }
  }

  /**
   * Removes a previously scheduled callback.
   */
  public cancelCallback(callback: (time: number) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index !== -1) {
      this.callbacks.splice(index, 1);
    }
    
    if (this.callbacks.length === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.frameRequested = false;
      this.rafId = null;
    }
  }

  /**
   * Handles the animation frame by executing all queued callbacks.
   */
  private handleFrame = (time: number): void => {
    this.frameRequested = false;
    this.rafId = null;

    // Get current callbacks and clear the queue
    const callbacksToRun = [...this.callbacks];
    this.callbacks = [];
    
    // Execute all callbacks with the current time
    for (const callback of callbacksToRun) {
      callback(time);
    }

    // If new callbacks were added during execution, request a new frame
    if (this.callbacks.length > 0 && !this.frameRequested) {
      this.frameRequested = true;
      this.rafId = requestAnimationFrame(this.handleFrame);
    }
  };
}
