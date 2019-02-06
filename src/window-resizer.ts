import { AppEventBus } from './app-event-bus';
import { AppEventTypeWindowResize } from './app-event-bus';

class WindowResizer {
  private eventBus: AppEventBus;
  private resizeListener: EventListener;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;

    this.resizeListener = (): void => {
      this.eventBus.emit(new AppEventTypeWindowResize());
    };

    window.addEventListener('resize', this.resizeListener);

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    window.removeEventListener('resize', this.resizeListener);
  }
}

export {
  WindowResizer
};