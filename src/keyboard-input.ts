import { IApplicationContainer } from './interfaces';
import AppEventBus from './app-event-bus';
import {
  AppEventTypeKeyDown,
  AppEventTypeKeyUp,
} from './app-events';

export default class KeyboardInput {
  private eventBus: AppEventBus;

  private appContainer: IApplicationContainer;

  private onKeyDownCtx: (evt: KeyboardEvent) => void;

  private onKeyUpCtx: (evt: KeyboardEvent) => void;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, appContainer?: IApplicationContainer, disableTabIndex?: boolean) {
    this.eventBus = eventBus;

    if (appContainer) {
      this.appContainer = appContainer;
    } else {
      this.appContainer = document;
    }

    this.onKeyDownCtx = this.onKeyDown.bind(this);
    this.onKeyUpCtx = this.onKeyUp.bind(this);

    if (this.appContainer === document) {
      if (disableTabIndex) {
        document.body.setAttribute('tabindex', '-1');
      }

      document.body.addEventListener('keydown', this.onKeyDownCtx, false);
      document.body.addEventListener('keyup', this.onKeyUpCtx, false);
    } else {
      if (disableTabIndex) {
        (this.appContainer as HTMLElement).setAttribute('tabindex', '-1');
      }

      (this.appContainer as HTMLElement).addEventListener('keydown', this.onKeyDownCtx, false);
      (this.appContainer as HTMLElement).addEventListener('keyup', this.onKeyUpCtx, false);
    }

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    if (this.appContainer === document) {
      document.body.removeEventListener('keydown', this.onKeyDownCtx, false);
      document.body.removeEventListener('keyup', this.onKeyUpCtx, false);
    } else {
      (this.appContainer as HTMLElement).removeEventListener('keydown', this.onKeyDownCtx, false);
      (this.appContainer as HTMLElement).removeEventListener('keyup', this.onKeyUpCtx, false);
    }

    // delete this.onKeyDownCtx;
    // this.onKeyDownCtx = null;

    // delete this.onKeyUpCtx;
    // this.onKeyUpCtx = null;

    // delete this.appContainer;
    // this.appContainer = null;

    // delete this.eventBus;
    // this.eventBus = null;
  }

  private onKeyDown(event: KeyboardEvent): void {
    event.preventDefault();
    this.eventBus.emit(new AppEventTypeKeyDown({ code: event.code }));
  }

  private onKeyUp(event: KeyboardEvent): void {
    event.preventDefault();
    this.eventBus.emit(new AppEventTypeKeyUp({ code: event.code }));
  }
}
