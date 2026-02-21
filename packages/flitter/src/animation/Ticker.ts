/**
 * Ticker - Singleton requestAnimationFrame manager
 * Prevents multiple RAF calls by batching all animation updates into a single loop.
 * Ported from ssgoi with lag smoothing and FPS throttling optimizations.
 */

type TickerCallback = (deltaTime: number, elapsed: number) => void;

class Ticker {
  private listeners = new Set<TickerCallback>();
  private rafId: number | null = null;
  private isRunning = false;

  // Timing
  private startTime = 0;
  private lastUpdate = 0;
  private elapsed = 0;

  // Lag smoothing (mobile optimization)
  private lagThreshold = 500; // ms - detect tab switches, backgrounding
  private adjustedLag = 33; // ms - max time jump to prevent animation skip
  private maxDeltaTime = 33; // ms - clamp for stability (30fps minimum)

  // FPS throttling
  private gap = 1000 / 240; // max 240fps
  private nextTime = this.gap;

  private tick = () => {
    const now = Date.now();
    const rawFrameElapsed = now - this.lastUpdate;
    let frameElapsed = rawFrameElapsed;

    // Lag smoothing: prevent huge time jumps (e.g., tab switch on mobile)
    if (frameElapsed > this.lagThreshold || frameElapsed < 0) {
      this.startTime += frameElapsed - this.adjustedLag;
      frameElapsed = this.adjustedLag;
    } else if (frameElapsed > this.maxDeltaTime) {
      frameElapsed = this.maxDeltaTime;
    }

    this.lastUpdate = now;
    const totalElapsed = now - this.startTime;
    const overlap = totalElapsed - this.nextTime;

    if (overlap > 0) {
      const deltaTime = frameElapsed / 1000;
      this.elapsed = totalElapsed / 1000;

      this.nextTime +=
        overlap + (overlap >= this.gap ? 4 : this.gap - overlap);

      this.listeners.forEach((callback) => {
        callback(deltaTime, this.elapsed);
      });
    }

    if (this.listeners.size > 0) {
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.isRunning = false;
      this.rafId = null;
    }
  };

  subscribe(callback: TickerCallback): () => void {
    this.listeners.add(callback);

    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now();
      this.lastUpdate = this.startTime;
      this.elapsed = 0;
      this.nextTime = this.gap;
      this.rafId = requestAnimationFrame(this.tick);
    }

    return () => {
      this.unsubscribe(callback);
    };
  }

  unsubscribe(callback: TickerCallback): void {
    this.listeners.delete(callback);

    if (this.listeners.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.isRunning = false;
      this.rafId = null;
    }
  }
}

// Singleton instance
export const ticker = new Ticker();
