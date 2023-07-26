import { Subscription } from 'rxjs';

import { IAppEventLoggerOptions } from './types';
import AppEventBus from './app-event-bus';
import {
  AppEventTypes,

  AppEventTypeAnimationFrame,
  AppEventTypeWindowResize,
  AppEventTypeRendererGeometryUpdate,
  AppEventTypeKeyDown,
  AppEventTypeKeyUp,
  AppEventTypeMouseDown,
  AppEventTypeMouseUp,
  AppEventTypeMouseMove,
  AppEventTypeCameraLook,
} from './app-event';

export default class AppEventLogger {
  private eventBus?: AppEventBus | null = null;

  private eventSubscriptions?: Array<Subscription | null> | null = null;

  private options?: IAppEventLoggerOptions | null = null;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, options?: IAppEventLoggerOptions) {
    this.eventBus = eventBus;

    if (typeof options === 'undefined') {
      options = {};
    }

    this.setupOptionsObject(options);
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

  private setupOptionsObject(options: IAppEventLoggerOptions): void {
    const availableOptions: string[] = [
      'animationFrame',
      'windowResize',
      'geometryUpdate',
      'keyDown',
      'keyUp',
      'mouseDown',
      'mouseUp',
      'mouseMove',
      'cameraLook',
    ];

    availableOptions.forEach((option: string) => {
      if (typeof options[option] !== 'boolean') {
        options[option] = true;
      }
    });

    this.options = options;
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

  private destroyProperties(): void {
    delete this.eventBus;
    this.eventBus = null;

    delete this.eventSubscriptions;
    this.eventSubscriptions = null;

    delete this.options;
    this.options = null;
  }

  private initEventSubscriptions(): void {
    if (!this.eventBus) {
      throw new Error('can not run func initEventSubscriptions() : eventBus is not initialized');
    }

    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.subscribe((event: AppEventTypes) => {
      if (!this.options) {
        throw new Error('can not run func initEventSubscriptions() : options is not initialized');
      }

      if (
        this.options.animationFrame && event instanceof AppEventTypeAnimationFrame
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeAnimationFrame');
        console.log('payload.delta = ', event.payload.delta);
      } else if (
        this.options.windowResize && event instanceof AppEventTypeWindowResize
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeWindowResize');
      } else if (
        this.options.geometryUpdate && event instanceof AppEventTypeRendererGeometryUpdate
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeRendererGeometryUpdate');
        console.log('payload.appHeight = ', event.payload.appHeight);
        console.log('payload.appWidth = ', event.payload.appWidth);
        console.log('payload.offsetLeft = ', event.payload.offsetLeft);
        console.log('payload.offsetTop = ', event.payload.offsetTop);
      } else if (
        this.options.keyDown && event instanceof AppEventTypeKeyDown
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeKeyDown');
        console.log('payload.code = ', event.payload.code);
      } else if (
        this.options.keyDown && event instanceof AppEventTypeKeyUp
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeKeyUp');
        console.log('payload.code = ', event.payload.code);
      } else if (
        this.options.mouseDown && event instanceof AppEventTypeMouseDown
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeMouseDown');
      } else if (
        this.options.mouseUp && event instanceof AppEventTypeMouseUp
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeMouseUp');
      } else if (
        this.options.mouseMove && event instanceof AppEventTypeMouseMove
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeMouseMove');
        console.log('payload.mouseX = ', event.payload.mouseX);
        console.log('payload.mouseY = ', event.payload.mouseY);
      } else if (
        this.options.cameraLook && event instanceof AppEventTypeCameraLook
      ) {
        console.log('---------- -------- ----- ---- -- -');
        console.log('event :: AppEventTypeCameraLook');
        console.log('payload.xPos = ', event.payload.xPos);
        console.log('payload.yPos = ', event.payload.yPos);
      }
    });

    this.eventSubscriptions.push(subscription);
  }
}
