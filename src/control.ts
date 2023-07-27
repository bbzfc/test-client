import { Subscription } from 'rxjs';

import { MOVEMENT_DIRECTION } from './types';
import AppEventBus from './app-event-bus';
import {
  AppEventTypeMouseDown,
  AppEventTypeMouseUp,
  AppEventTypeMouseMove,

  AppEventTypeKeyDown,
  AppEventTypeKeyUp,

  AppEventTypePlayerStartMovement,
  AppEventTypePlayerStopMovement,

  AppEventTypeCameraLook,
} from './app-event';

export default class Control {
  private eventBus?: AppEventBus | null = null;

  private eventSubscriptions?: Array<Subscription | null> | null = null;

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

    this.freeEventSubscriptions();
    this.destroyProperties();

    this.isDestroyed = true;
  }

  private destroyProperties(): void {
    delete this.eventSubscriptions;
    this.eventSubscriptions = null;

    delete this.eventBus;
    this.eventBus = null;
  }

  private initEventSubscriptions(): void {
    if (!this.eventBus) {
      throw new Error('can not run func initEventSubscriptions() : eventBus is not initialized');
    }

    this.eventSubscriptions = [];

    let subscription: Subscription = this.eventBus.on(
      AppEventTypeKeyDown,
      (event: AppEventTypeKeyUp) => {
        this.handleKeyDownEvent(event.payload.code);
      },
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeKeyUp,
      (event: AppEventTypeKeyUp) => {
        this.handleKeyUpEvent(event.payload.code);
      },
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseDown,
      () => {
        this.handleMouseDownEvent();
      },
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseUp,
      () => {
        this.handleMouseUpEvent();
      },
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeMouseMove,
      (event: AppEventTypeMouseMove) => {
        this.handleMouseMoveEvent(event.payload.mouseX, event.payload.mouseY);
      },
    );
    this.eventSubscriptions.push(subscription);
  }

  private handleKeyDownEvent(code: string): void {
    if (!this.eventBus) {
      throw new Error('can not run func handleMouseMoveEvent() : eventBus is not initialized');
    }

    let movementOp = false;
    let direction: MOVEMENT_DIRECTION | null = null;

    switch (code) {
      case 'KeyA':
        direction = MOVEMENT_DIRECTION.left;
        movementOp = true;
        break;

      case 'KeyD':
        direction = MOVEMENT_DIRECTION.right;
        movementOp = true;
        break;

      case 'KeyW':
        direction = MOVEMENT_DIRECTION.forward;
        movementOp = true;
        break;

      case 'KeyS':
        direction = MOVEMENT_DIRECTION.backward;
        movementOp = true;
        break;

      default:
        break;
    }

    if (movementOp === true && direction !== null) {
      this.eventBus.emit(new AppEventTypePlayerStartMovement({ direction }));
    }
  }

  private handleKeyUpEvent(code: string): void {
    if (!this.eventBus) {
      throw new Error('can not run func handleMouseMoveEvent() : eventBus is not initialized');
    }

    let movementOp = false;
    let direction: MOVEMENT_DIRECTION | null = null;

    switch (code) {
      case 'KeyA':
        direction = MOVEMENT_DIRECTION.left;
        movementOp = true;
        break;

      case 'KeyD':
        direction = MOVEMENT_DIRECTION.right;
        movementOp = true;
        break;

      case 'KeyW':
        direction = MOVEMENT_DIRECTION.forward;
        movementOp = true;
        break;

      case 'KeyS':
        direction = MOVEMENT_DIRECTION.backward;
        movementOp = true;
        break;

      default:
        break;
    }

    if (movementOp === true && direction !== null) {
      this.eventBus.emit(new AppEventTypePlayerStopMovement({ direction }));
    }
  }

  private handleMouseDownEvent(): void {
    // todo
  }

  private handleMouseUpEvent(): void {
    // todo
  }

  private handleMouseMoveEvent(mouseX: number, mouseY: number): void {
    if (!this.eventBus) {
      throw new Error('can not run func handleMouseMoveEvent() : eventBus is not initialized');
    }

    if (Math.abs(mouseX) < 0.1) {
      mouseX = 0;
    }
    if (Math.abs(mouseY) < 0.1) {
      mouseY = 0;
    }

    this.eventBus.emit(new AppEventTypeCameraLook({ xPos: mouseX, yPos: mouseY }));
  }

  private freeEventSubscriptions(): void {
    if (!this.eventSubscriptions) {
      return;
    }

    this.eventSubscriptions.forEach((subscription: Subscription | null, idx: number) => {
      if (subscription) {
        subscription.unsubscribe();
      }

      if (this.eventSubscriptions) {
        delete this.eventSubscriptions[idx];
        this.eventSubscriptions[idx] = null;
      }
    });
  }
}
