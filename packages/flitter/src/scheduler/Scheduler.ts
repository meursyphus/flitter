import { assert } from "src/utils";
import type RenderFrameDispatcher from "./RenderFrameDispatcher";

enum SchedulerPhase {
  idle,
  persistenceCallbacks,
  postFrameCallbacks,
}

class Scheduler {
  phase: SchedulerPhase;
  private persistenceCallbacks: (() => void)[];
  private postFrameCallbacks: (() => void)[];
  private renderFrameDispatcher: RenderFrameDispatcher;
  constructor({
    renderFrameDispatcher,
  }: {
    renderFrameDispatcher: RenderFrameDispatcher;
  }) {
    this.phase = SchedulerPhase.idle;
    this.persistenceCallbacks = [];
    this.postFrameCallbacks = [];
    this.renderFrameDispatcher = renderFrameDispatcher;

    renderFrameDispatcher.setOnFrame(() => this.handleDrawFrame());
  }

  flushPostCallbacks() {
    this.postFrameCallbacks.forEach(callback => {
      callback();
    });
    this.postFrameCallbacks = [];
  }

  ensureVisualUpdate() {
    switch (this.phase) {
      case SchedulerPhase.idle:
      case SchedulerPhase.postFrameCallbacks:
        this.schedule();
        break;
      case SchedulerPhase.persistenceCallbacks:
        break;
    }
  }

  private hasScheduledFrame = false;
  private schedule() {
    if (this.hasScheduledFrame) return;
    this.renderFrameDispatcher.dispatch();
    this.hasScheduledFrame = true;
  }

  private handleDrawFrame() {
    assert(
      this.phase === SchedulerPhase.idle,
      "Scheduler should be idle on beginning frame",
    );
    this.hasScheduledFrame = false;

    this.phase = SchedulerPhase.persistenceCallbacks;
    this.flushPersistenceCallbacks();
    this.phase = SchedulerPhase.postFrameCallbacks;
    this.flushPostCallbacks();
    this.phase = SchedulerPhase.idle;
  }

  private flushPersistenceCallbacks() {
    this.persistenceCallbacks.forEach(callback => {
      callback();
    });
  }

  addPersistenceCallbacks(callback: () => void) {
    this.persistenceCallbacks.push(() => callback());
  }

  addPostFrameCallbacks(callback: () => void) {
    this.postFrameCallbacks.push(() => callback());
  }
}

export default Scheduler;
