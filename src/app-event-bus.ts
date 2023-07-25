import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppEventTypes } from './app-events';

type CallbackFunction<T = AppEventTypes> = (event: T) => void;
type NewableType<T> = new (...args: any[]) => T;

export default class AppEventBus {
  private eventStream: Subject<any>;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor() {
    this.eventStream = new Subject();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public emit(event: AppEventTypes): void {
    this.eventStream.next(event);
  }

  public on<T>(
    typeFilter: NewableType<T>,
    callback: CallbackFunction<T>,
    callbackContext: any = null,
  ): Subscription {
    const subscription: Subscription = this.eventStream
      .pipe(
        filter((event: any): boolean => (event instanceof typeFilter)),
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
    callbackContext: any = null,
  ): Subscription {
    const subscription: Subscription = this.eventStream.subscribe(
      (event: any): void => {
        try {
          callback.call(callbackContext, event);
        } catch (error) {
          console.log(error);
        }
      },
    );

    return subscription;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventStream.complete();

    // delete this.eventStream;
    // this.eventStream = undefined;
  }
}
