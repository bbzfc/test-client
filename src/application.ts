import {
  Clock, PerspectiveCamera, Scene, WebGLRenderer, PCFSoftShadowMap,
} from 'three';
import { Subscription } from 'rxjs';

import { IApplicationOptions, IApplicationContainer } from './types';

import domReady from './utils';
import AppEventBus from './app-event-bus';
import {
  AppEventTypeWindowResize,
  AppEventTypeAnimationFrame,
  AppEventTypeRendererGeometryUpdate,
} from './app-event';

export default class Application {
  private clock?: Clock | null = null;

  private internalScene?: Scene | null = null;

  private internalCamera?: PerspectiveCamera | null = null;

  public renderer?: WebGLRenderer | null = null;

  private eventBus?: AppEventBus | null = null;

  private eventSubscriptions?: Array<Subscription | null> | null = null;

  private rendererReadyP?: Promise<void> | null = null;

  private appContainer?: IApplicationContainer | null = null;

  private animationStarted: boolean = false;

  private animationPaused: boolean = false;

  private isInitialized: boolean = false;

  private isDestroyed: boolean = false;

  constructor(eventBus: AppEventBus, customOptions?: IApplicationOptions) {
    this.eventBus = eventBus;

    const options: IApplicationOptions = customOptions || {};

    this.rendererReadyP = new Promise(
      (resolve: (value?: void | PromiseLike<void> | undefined) => void): void => {
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
      },
    );
  }

  public rendererReady(): Promise<void> {
    if (!this.rendererReadyP) {
      throw new Error('can not run func rendererReady() : rendererReadyP is not initialized');
    }

    return this.rendererReadyP;
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

    if (this.eventSubscriptions) {
      this.eventSubscriptions.forEach((subscription: Subscription | null, idx: number) => {
        if (subscription) {
          subscription.unsubscribe();
        }

        if (this.eventSubscriptions) {
          delete this.eventSubscriptions[idx];
          this.eventSubscriptions[idx] = null;
        }
      });
    }
    delete this.eventSubscriptions;
    this.eventSubscriptions = null;

    delete this.clock;
    this.clock = null;

    delete this.internalScene;
    this.internalScene = null;

    delete this.internalCamera;
    this.internalCamera = null;

    if (this.renderer) {
      if (this.renderer.domElement) {
        if (this.appContainer === window.document) {
          window.document.body.removeChild(this.renderer.domElement);
        } else if (this.appContainer) {
          this.appContainer.removeChild(this.renderer.domElement);
        }
      }

      this.renderer.dispose();
    }
    delete this.renderer;
    this.renderer = null;

    delete this.eventBus;
    this.eventBus = null;

    delete this.rendererReadyP;
    this.rendererReadyP = null;

    delete this.appContainer;
    this.appContainer = null;

    this.isDestroyed = true;
  }

  public start(): void {
    if (this.isInitialized !== true || this.isDestroyed === true || this.animationStarted === true) {
      return;
    }

    this.animationStarted = true;
    this.animationPaused = false;

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
      this.appContainer = window.document;
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

    if (this.appContainer === window.document) {
      window.document.body.appendChild(this.renderer.domElement);
    } else if (this.appContainer) {
      this.appContainer.appendChild(this.renderer.domElement);
    }
  }

  private initEventSubscriptions(): void {
    if (!this.eventBus) {
      throw new Error('can not run func initEventSubscriptions() : eventBus is not initialized');
    }

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
    if (!this.eventBus) {
      throw new Error('can not run func updateRendererSize() : eventBus is not initialized');
    }

    if (!this.renderer) {
      throw new Error('can not run func updateRendererSize() : renderer is not initialized');
    }

    let appWidth: number = this.appContainerWidth;
    let appHeight: number = this.appContainerHeight;

    if (appWidth === 0 || appHeight === 0) {
      appWidth = 1;
      appHeight = 1;
    }

    this.renderer.setSize(appWidth, appHeight);

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
      throw new Error('can not run func appContainerHeight() : appContainer is not initialized');
    }

    if (this.appContainer === window.document) {
      return window.innerHeight;
    }

    return (this.appContainer as HTMLElement).clientHeight;
  }

  private get appContainerWidth(): number {
    if (!this.appContainer) {
      throw new Error('can not run func appContainerWidth() : appContainer is not initialized');
    }

    if (this.appContainer === window.document) {
      return window.innerWidth;
    }

    return (this.appContainer as HTMLElement).clientWidth;
  }

  private get appContainerOffsetLeft(): number {
    if (!this.appContainer) {
      throw new Error('can not run func appContainerOffsetLeft() : appContainer is not initialized');
    }

    if (this.appContainer === window.document) {
      return 0;
    }

    return (this.appContainer as HTMLElement).offsetLeft;
  }

  private get appContainerOffsetTop(): number {
    if (!this.appContainer) {
      throw new Error('can not run func appContainerOffsetTop() : appContainer is not initialized');
    }

    if (this.appContainer === window.document) {
      return 0;
    }

    return (this.appContainer as HTMLElement).offsetTop;
  }

  private animate(): void {
    if (this.isInitialized === false || this.isDestroyed === true || this.animationPaused === true) {
      return;
    }

    if (!this.renderer) {
      throw new Error('can not run func animate() : renderer is not initialized');
    }

    if (!this.internalScene) {
      throw new Error('can not run func animate() : internalScene is not initialized');
    }

    if (!this.internalCamera) {
      throw new Error('can not run func animate() : internalCamera is not initialized');
    }

    this.renderer.render(this.internalScene, this.internalCamera);

    requestAnimationFrame((): void => {
      if (this.isInitialized === false || this.isDestroyed === true || this.animationPaused === true) {
        return;
      }

      if (!this.eventBus) {
        throw new Error('can not run func animate() : eventBus is not initialized');
      }

      if (!this.clock) {
        throw new Error('can not run func animate() : clock is not initialized');
      }

      this.eventBus.emit(new AppEventTypeAnimationFrame({ delta: this.clock.getDelta() }));

      this.animate();
    });
  }
}
