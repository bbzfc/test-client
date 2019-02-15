import { AppEventBus } from './app-event-bus';

class Controls {
  private eventBus: AppEventBus;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;
  }

  public destroy(): void {
    delete this.eventBus;
    this.eventBus = null;
  }
}

export {
  Controls
};
