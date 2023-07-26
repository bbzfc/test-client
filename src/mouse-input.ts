import { Subscription } from 'rxjs';

import { IApplicationContainer } from './interfaces';
import AppEventBus from './app-event-bus';
import {
  AppEventTypeMouseDown,
  AppEventTypeMouseUp,
  AppEventTypeMouseMove,
  AppEventTypeRendererGeometryUpdate,
} from './app-events';

function contextmenu(event: Event): void {
  event.preventDefault();
}

export default class MouseInput {
  private eventBus: AppEventBus;

  private eventSubscriptions: Subscription[] = [];

  private appContainer: IApplicationContainer;

  private onMouseMoveCtx: (evt: MouseEvent) => void;

  private onMouseDownCtx: (evt: MouseEvent) => void;

  private onMouseUpCtx: (evt: MouseEvent) => void;

  private renderElCenterX: number;

  private renderElCenterY: number;

  private halfAppWidth: number;

  private halfAppHeight: number;

  private disableContextMenu: boolean;

  private isInitialized: boolean;

  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, appContainer?: IApplicationContainer, disableContextMenu?: boolean) {
    this.eventBus = eventBus;
    this.disableContextMenu = !!(disableContextMenu);

    if (appContainer) {
      this.appContainer = appContainer;
    } else {
      this.appContainer = document;
    }

    this.renderElCenterX = 0;
    this.renderElCenterY = 0;

    // Set both of these values to 1, so that there is no division by `zero`.
    this.halfAppWidth = 1;
    this.halfAppHeight = 1;

    this.onMouseMoveCtx = this.onMouseMove.bind(this);
    this.onMouseDownCtx = this.onMouseDown.bind(this);
    this.onMouseUpCtx = this.onMouseUp.bind(this);

    this.addEventListeners();
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
    this.removeEventListeners();
    this.destroyProperties();
  }

  private addEventListeners(): void {
    let tempEl: IApplicationContainer | null = null;

    if (this.appContainer === document) {
      tempEl = document.body;
    } else {
      tempEl = (this.appContainer as HTMLElement);
    }

    if (this.disableContextMenu) {
      tempEl.addEventListener('contextmenu', contextmenu, false);
    }

    tempEl.addEventListener('mousemove', this.onMouseMoveCtx, false);
    tempEl.addEventListener('mousedown', this.onMouseDownCtx, false);
    tempEl.addEventListener('mouseup', this.onMouseUpCtx, false);
  }

  private removeEventListeners(): void {
    let tempEl: IApplicationContainer | null = null;

    if (this.appContainer === document) {
      tempEl = document.body;
    } else {
      tempEl = (this.appContainer as HTMLElement);
    }

    if (this.disableContextMenu) {
      tempEl.removeEventListener('contextmenu', contextmenu, false);
    }

    tempEl.removeEventListener('mousemove', this.onMouseMoveCtx, false);
    tempEl.removeEventListener('mousedown', this.onMouseDownCtx, false);
    tempEl.removeEventListener('mouseup', this.onMouseUpCtx, false);
  }

  private destroyProperties(): void {
    // delete this.eventBus;
    // this.eventBus = null;

    // delete this.eventSubscriptions;
    // this.eventSubscriptions = null;

    // delete this.appContainer;
    // this.appContainer = null;

    // delete this.onMouseMoveCtx;
    // this.onMouseMoveCtx = null;

    // delete this.onMouseDownCtx;
    // this.onMouseDownCtx = null;

    // delete this.onMouseUpCtx;
    // this.onMouseUpCtx = null;

    // delete this.renderElCenterX;
    // this.renderElCenterX = null;

    // delete this.renderElCenterY;
    // this.renderElCenterY = null;

    // delete this.halfAppWidth;
    // this.halfAppWidth = null;

    // delete this.halfAppHeight;
    // this.halfAppHeight = null;

    // delete this.disableContextMenu;
    // this.disableContextMenu = null;
  }

  private onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    let tempEl: IApplicationContainer | null = null;

    if (this.appContainer === document) {
      tempEl = document.body;
    } else {
      tempEl = (this.appContainer as HTMLElement);
    }

    tempEl.focus();

    this.eventBus.emit(new AppEventTypeMouseDown());
  }

  private onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.eventBus.emit(new AppEventTypeMouseUp());
  }

  private onMouseMove(event: MouseEvent): void {
    const mouseX: number = (event.pageX - this.renderElCenterX) / this.halfAppWidth;
    const mouseY: number = (this.renderElCenterY - event.pageY) / this.halfAppHeight;

    this.eventBus.emit(new AppEventTypeMouseMove({ mouseX, mouseY }));
  }

  private handleResize(
    appWidth: number,
    appHeight: number,
    offsetLeft: number,
    offsetTop: number,
  ): void {
    this.halfAppWidth = appWidth * 0.5;
    this.halfAppHeight = appHeight * 0.5;

    if (this.halfAppWidth <= 0) {
      this.halfAppWidth = 1;
    }
    if (this.halfAppHeight <= 0) {
      this.halfAppHeight = 1;
    }

    this.renderElCenterX = offsetLeft + this.halfAppWidth;
    this.renderElCenterY = offsetTop + this.halfAppHeight;
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.on(
      AppEventTypeRendererGeometryUpdate,
      (event: AppEventTypeRendererGeometryUpdate) => {
        this.handleResize(
          event.payload.appWidth,
          event.payload.appHeight,
          event.payload.offsetLeft,
          event.payload.offsetTop,
        );
      },
    );
    this.eventSubscriptions.push(subscription);
  }

  private freeEventSubscriptions(): void {
    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();

      delete this.eventSubscriptions[idx];
      // this.eventSubscriptions[idx] = null;
    });
  }
}
