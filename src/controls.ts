import { Subscription } from 'rxjs';

import { AppEventBus } from './app-event-bus';
import {
  AppEventTypeMouseDown,
  AppEventTypeMouseUp,
  AppEventTypeMouseMove,

  AppEventTypeKeyDown,
  AppEventTypeKeyUp,

  AppEventTypeCameraLook
} from './app-events';

class Controls {
  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;

    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.freeEventSubscriptions();
    this.destroyProperties();
  }

  private destroyProperties(): void {
    delete this.eventSubscriptions;
    this.eventSubscriptions = null;

    delete this.eventBus;
    this.eventBus = null;
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    let subscription: Subscription = this.eventBus.on(
      AppEventTypeKeyDown,
      (event: AppEventTypeKeyUp) => {
        this.handleKeyDownEvent(event.payload.code);
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeKeyUp,
      (event: AppEventTypeKeyUp) => {
        this.handleKeyUpEvent(event.payload.code);
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseDown,
      () => {
        this.handleMouseDownEvent();
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseUp,
      () => {
        this.handleMouseUpEvent();
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseMove,
      (event: AppEventTypeMouseMove) => {
        this.handleMouseMoveEvent(event.payload.mouseX, event.payload.mouseY);
      }
    );
    this.eventSubscriptions.push(subscription);
  }

  private handleKeyDownEvent(code: string): void {
    // todo
  }

  private handleKeyUpEvent(code: string): void {
    // todo
  }

  private handleMouseDownEvent(): void {
    // todo
  }

  private handleMouseUpEvent(): void {
    // todo
  }

  private handleMouseMoveEvent(mouseX: number, mouseY: number): void {
    if (Math.abs(mouseX) < 0.1) {
      mouseX = 0;
    }
    if (Math.abs(mouseY) < 0.1) {
      mouseY = 0;
    }

    this.eventBus.emit(new AppEventTypeCameraLook({ xPos: mouseX, yPos: mouseY }));
  }

  private freeEventSubscriptions(): void {
    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();

      delete this.eventSubscriptions[idx];
      this.eventSubscriptions[idx] = null;
    });
  }
}

export {
  Controls
};
