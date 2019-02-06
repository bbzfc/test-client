import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Subscription } from 'rxjs';
import { domReady } from './utils';
import {
  AppEventBus,
  AppEventTypes,
  AppEventTypeWindowResize,
  AppEventTypeAnimationFrame
} from './app-event-bus';
import { IApplicationOptions, IApplicationContainer } from './interfaces/application.interfaces';

class Application {
  public clock: Clock = null;
  public scene: Scene = null;
  private _camera: PerspectiveCamera = null;
  public renderer: WebGLRenderer = null;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];
  private rendererReadyP: Promise<void>;
  private appContainer: IApplicationContainer = null;

  private animationStarted: boolean;
  private animationPaused: boolean;
  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, options?: IApplicationOptions) {
    this.eventBus = eventBus;

    if (!options) {
      options = {};
    }

    this.rendererReadyP = new Promise((resolve): void => {
      domReady((): void => {
        this.initAppContainer(options);
        this.initRenderer(options);
        this.initEventSubscriptions();

        this.updateRendererSize();

        this.animationStarted = false;
        this.animationPaused = false;
        this.isInitialized = true;
        this.isDestroyed = false;

        resolve();
      });
    });
  }

  public rendererReady(): Promise<void> {
    return this.rendererReadyP;
  }

  public get canvasEl(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public set camera(newCamera: PerspectiveCamera) {
    this._camera = newCamera;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventSubscriptions.forEach((subscription, idx) => {
      subscription.unsubscribe();
      delete this.eventSubscriptions[idx];
      this.eventSubscriptions[idx] = null;
    });

    delete this.clock;
    delete this.scene;
    delete this._camera;

    this.clock = null;
    this.scene = null;
    this._camera = null;

    if (this.appContainer === document) {
      document.body.removeChild(this.renderer.domElement);
    } else {
      this.appContainer.removeChild(this.renderer.domElement);
    }

    this.renderer.dispose();
    this.renderer = null;
  }

  public start(): void {
    if (
      this.isInitialized !== true ||
      this.isDestroyed === true ||
      this.animationStarted === true
    ) {
      return;
    }

    this.animationStarted = true;

    this.animate();
  }

  public pause(): void {
    this.animationPaused = true;
  }

  public resume(): void {
    this.animationPaused = false;
  }

  private initAppContainer(options: IApplicationOptions): void {
    if (options.container) {
      this.appContainer = options.container;
    } else {
      this.appContainer = document;
    }
  }

  private initRenderer(options: IApplicationOptions): void {
    this.clock = new Clock();
    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (typeof options.threeJsRendererCanvasClass === 'string') {
      this.renderer.domElement.className = options.threeJsRendererCanvasClass;
    }

    if (this.appContainer === document) {
      document.body.appendChild(this.renderer.domElement);
    } else {
      this.appContainer.appendChild(this.renderer.domElement);
    }
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription = this.eventBus.subscribe((event: AppEventTypes) => {
      if (event instanceof AppEventTypeWindowResize) {
        this.updateRendererSize();
      }
    });
    this.eventSubscriptions.push(subscription);
  }

  private updateRendererSize(): void {
    let appWidth = this.appContainerWidth;
    let appHeight = this.appContainerHeight;

    if (appWidth === 0 || appHeight === 0) {
      appWidth = 1;
      appHeight = 1;
    }

    this.renderer.setSize(appWidth, appHeight);
  }

  private get appContainerHeight(): number {
    if (!this.appContainer) {
      return 0;
    }

    if (this.appContainer === document) {
      return window.innerHeight;
    }

    return (this.appContainer as HTMLElement).clientHeight;
  }

  private get appContainerWidth(): number {
    if (!this.appContainer) {
      return 0;
    }

    if (this.appContainer === document) {
      return window.innerWidth;
    }

    return (this.appContainer as HTMLElement).clientWidth;
  }

  private animate(): void {
    if (this.isDestroyed === true || this.animationPaused === true) {
      return;
    }

    // debugger;
    if (this._camera) {
      this.renderer.render(this.scene, this._camera);
    }

    requestAnimationFrame((): void => {
      if (this.isDestroyed === true || this.animationPaused === true) {
        return;
      }

      // debugger;
      this.eventBus.emit(new AppEventTypeAnimationFrame({ delta: this.clock.getDelta() }));

      this.animate();
    });
  }
}

export {
  Application
};
