import * as Stats from 'stats-js';
import { Subscription } from 'rxjs';

import AppEventBus from './app-event-bus';
import { AppEventTypeAnimationFrame } from './app-events';

export default class FrameRate {
  private eventBus: AppEventBus;

  private eventSubscriptions: Subscription[] = [];

  private stats: Stats;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;

    this.stats = new Stats();

    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();
      delete this.eventSubscriptions[idx];
      // this.eventSubscriptions[idx] = null;
    });
    this.eventSubscriptions = [];
    // this.eventSubscriptions = null;

    // delete this.eventBus;
    // this.eventBus = null;

    document.body.removeChild(this.stats.dom);

    // this.stats = [];
    // this.stats = null;
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.on(
      AppEventTypeAnimationFrame,
      () => {
        this.updateFrameRate();
      },
    );
    this.eventSubscriptions.push(subscription);
  }

  private updateFrameRate(): void {
    // We need to measure the performance between subsequent calls to this function.
    // Therefore, we call `stats.end()` first, and then initiate a new `stats.begin()`.
    this.stats.end();
    this.stats.begin();
  }
}
