import { Subscription } from 'rxjs';

import { IAppEventLoggerOptions } from './interfaces';
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
} from './app-events';

export default class AppEventLogger {
  private eventBus: AppEventBus;

  private eventSubscriptions: Subscription[] = [];

  private options: IAppEventLoggerOptions = {};

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
    this.isDestroyed = true;

    this.freeEventSubscriptions();
    this.destroyProperties();
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
    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();

      delete this.eventSubscriptions[idx];
      // this.eventSubscriptions[idx] = null;
    });
  }

  private destroyProperties(): void {
    // delete this.eventBus;
    // this.eventBus = null;

    // delete this.eventSubscriptions;
    // this.eventSubscriptions = null;

    // delete this.options;
    // this.options = null;
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.subscribe((event: AppEventTypes) => {
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
