import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

abstract class AppEvent {
  public readonly type: string;
}

abstract class AppEventWithPayload<T> extends AppEvent {
  public readonly payload: T;

  constructor(payload: T) {
    super();
    this.payload = payload;
  }
}

/* -------------------- */

export interface IAppEventTypeAPayload {
  strData: string;
}

export class AppEventTypeA extends AppEventWithPayload<IAppEventTypeAPayload> {
  static readonly type = 'AppEventTypeA';
  public readonly type = AppEventTypeA.type;
}

/* -------------------- */

export interface IAppEventTypeBPayload {
  foo: string;
}

export class AppEventTypeB extends AppEventWithPayload<IAppEventTypeBPayload> {
  static readonly type = 'AppEventTypeB';
  public readonly type = AppEventTypeB.type;
}

/* -------------------- */

export interface IAppEventTypeAnimationFramePayload {
  delta: number;
}

export class AppEventTypeAnimationFrame extends
  AppEventWithPayload<IAppEventTypeAnimationFramePayload> {

  static readonly type = 'AppEventTypeAnimationFrame';
  public readonly type = AppEventTypeAnimationFrame.type;
}

/* -------------------- */

export class AppEventTypeWindowResize extends AppEvent {
  static readonly type = 'AppEventTypeWindowResize';
  public readonly type = AppEventTypeWindowResize.type;
}

/* -------------------- */

export type AppEventTypes =
  AppEventTypeA |
  AppEventTypeB |
  AppEventTypeAnimationFrame |
  AppEventTypeWindowResize;

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

type CallbackFunction<T = any> = (event: T) => void;
type NewableType<T> = new (...args: any[]) => T;

export class AppEventBus {
  private eventStream: Subject<any>;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor() {
    this.eventStream = new Subject();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public emit(event: any): void {
    this.eventStream.next(event);
  }

  public on<T>(
    typeFilter: NewableType<T>,
    callback: CallbackFunction<T>,
    callbackContext: any = null
  ): Subscription {

    const subscription = this.eventStream
      .pipe(
        filter((event: any): boolean => {
            return (event instanceof typeFilter);
          }
        )
      )
      .subscribe((event: T): void => {
        try {
          callback.call(callbackContext, event);
        } catch (error) {
          console.log(error);
        }
      });

    return subscription;
  }

  public subscribe(
    callback: CallbackFunction,
    callbackContext: any = null
  ): Subscription {

    const subscription = this.eventStream.subscribe(
      (event: any): void => {

        try {
          callback.call(callbackContext, event);
        } catch (error) {
          console.log(error);
        }

      }
    );

    return subscription;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventStream.complete();
    delete this.eventStream;
    this.eventStream = null;
  }
}
