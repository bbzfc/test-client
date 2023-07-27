import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppEventTypes } from './app-event';

type CallbackFunction<T = AppEventTypes> = (event: T) => void;
type NewableType<T> = new (...args: any[]) => T;

export default class AppEventBus {
  private eventStream?: Subject<any> | null = null;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor() {
    this.eventStream = new Subject();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public emit(event: AppEventTypes): void {
    if (!this.eventStream) {
      throw new Error('can not run func emit() : eventStream is not initialized');
    }

    this.eventStream.next(event);
  }

  public on<T>(
    typeFilter: NewableType<T>,
    callback: CallbackFunction<T>,
    callbackContext: any = null,
  ): Subscription {
    if (!this.eventStream) {
      throw new Error('can not run func on() : eventStream is not initialized');
    }

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
    if (!this.eventStream) {
      throw new Error('can not run func subscribe() : eventStream is not initialized');
    }

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

    if (this.eventStream) {
      this.eventStream.complete();

      delete this.eventStream;
      this.eventStream = null;
    }

    this.isDestroyed = true;
  }
}
