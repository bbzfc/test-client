import {
  Clock, PerspectiveCamera, Scene, WebGLRenderer, PCFSoftShadowMap,
} from 'three';
import { Subscription } from 'rxjs';

import { IApplicationOptions, IApplicationContainer } from './interfaces';

import domReady from './utils';
import AppEventBus from './app-event-bus';
import {
  AppEventTypeWindowResize,
  AppEventTypeAnimationFrame,
  AppEventTypeRendererGeometryUpdate,
} from './app-events';

export default class Application {
  private clock: Clock | null = null;

  private internalScene: Scene | null = null;

  private internalCamera: PerspectiveCamera | null = null;

  public renderer: WebGLRenderer | null = null;

  private eventBus: AppEventBus;

  private eventSubscriptions: Subscription[] = [];

  private rendererReadyP: Promise<void>;

  private appContainer: IApplicationContainer | null = null;

  private animationStarted: boolean = false;

  private animationPaused: boolean = false;

  private isInitialized: boolean = false;

  private isDestroyed: boolean = false;

  constructor(eventBus: AppEventBus, options?: IApplicationOptions) {
    this.eventBus = eventBus;

    if (!options) {
      options = {};
    }

    this.rendererReadyP = new Promise(
      (resolve: (value?: void | PromiseLike<void>) => void): void => {
        domReady((): void => {
          this.initAppContainer(options as IApplicationOptions);
          this.initRenderer(options as IApplicationOptions);
          this.initEventSubscriptions();

          this.updateRendererSize();

          this.animationStarted = false;
          this.animationPaused = false;
          this.isInitialized = true;
          this.isDestroyed = false;

          resolve();
        });
      },
    );
  }

  public rendererReady(): Promise<void> {
    return this.rendererReadyP;
  }

  public get canvasEl(): HTMLCanvasElement {
    return this.renderer?.domElement as HTMLCanvasElement;
  }

  public set camera(newCamera: PerspectiveCamera) {
    this.internalCamera = newCamera;
  }

  public set scene(newScene: Scene) {
    this.internalScene = newScene;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();
      delete this.eventSubscriptions[idx];
      // this.eventSubscriptions[idx] = null;
    });
    this.eventSubscriptions = [];
    // this.eventSubscriptions = null;

    this.clock = null;
    this.internalScene = null;
    this.internalCamera = null;

    this.clock = null;
    this.internalScene = null;
    this.internalCamera = null;

    if (this.appContainer === document) {
      document.body.removeChild(this.renderer?.domElement as HTMLCanvasElement);
    } else {
      this.appContainer?.removeChild(this.renderer?.domElement as HTMLCanvasElement);
    }

    this.renderer?.dispose();
    this.renderer = null;
  }

  public start(): void {
    if (
      this.isInitialized !== true
      || this.isDestroyed === true
      || this.animationStarted === true
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
    if (options.appContainer) {
      this.appContainer = options.appContainer;
    } else {
      this.appContainer = document;
    }
  }

  private initRenderer(options: IApplicationOptions): void {
    this.clock = new Clock();

    this.renderer = new WebGLRenderer({ antialias: true });

    // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    if (typeof options.threeJsRendererCanvasClass === 'string') {
      this.renderer.domElement.className = options.threeJsRendererCanvasClass;
    }

    if (this.appContainer === document) {
      document.body.appendChild(this.renderer.domElement);
    } else {
      this.appContainer?.appendChild(this.renderer.domElement);
    }
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.on(
      AppEventTypeWindowResize,
      () => {
        this.updateRendererSize();
      },
    );
    this.eventSubscriptions.push(subscription);
  }

  private updateRendererSize(): void {
    let appWidth: number = this.appContainerWidth;
    let appHeight: number = this.appContainerHeight;

    if (appWidth === 0 || appHeight === 0) {
      appWidth = 1;
      appHeight = 1;
    }

    this.renderer?.setSize(appWidth, appHeight);

    this.eventBus.emit(new AppEventTypeRendererGeometryUpdate(
      {
        appWidth,
        appHeight,
        offsetLeft: this.appContainerOffsetLeft,
        offsetTop: this.appContainerOffsetTop,
      },
    ));
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

  private get appContainerOffsetLeft(): number {
    if (!this.appContainer) {
      return 0;
    }

    if (this.appContainer === document) {
      return 0;
    }

    return (this.appContainer as HTMLElement).offsetLeft;
  }

  private get appContainerOffsetTop(): number {
    if (!this.appContainer) {
      return 0;
    }

    if (this.appContainer === document) {
      return 0;
    }

    return (this.appContainer as HTMLElement).offsetTop;
  }

  private animate(): void {
    if (this.isDestroyed === true || this.animationPaused === true) {
      return;
    }

    this.renderer?.render(this.internalScene as Scene, this.internalCamera as PerspectiveCamera);

    requestAnimationFrame((): void => {
      if (this.isDestroyed === true || this.animationPaused === true) {
        return;
      }

      this.eventBus.emit(new AppEventTypeAnimationFrame({ delta: this.clock?.getDelta() as number }));

      this.animate();
    });
  }
}
