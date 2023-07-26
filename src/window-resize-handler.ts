import AppEventBus from './app-event-bus';
import { AppEventTypeWindowResize } from './app-event';

type TResizeListener = () => void;

export default class WindowResizeHandler {
  private eventBus: AppEventBus;

  private resizeListener?: TResizeListener | null;

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

    window.removeEventListener('resize', this.resizeListener as TResizeListener);

    delete this.resizeListener;
    this.resizeListener = null;

    this.isDestroyed = true;
  }

  public emit(): void {
    this.eventBus.emit(new AppEventTypeWindowResize());
  }
}
