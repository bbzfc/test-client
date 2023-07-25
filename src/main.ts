// Enable working with `GLTFLoader`. Right now it can't be simply imported
// as a TypeScript module. So we have this hack ;)

import * as THREE from 'three';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import './styles/main.scss';

import './models/gltf/tank2/tank2.bin';
import './models/gltf/tank2/tank2.gltf';
import './models/gltf/tank2/texture1.png';
import './models/gltf/tank2/texture2.png';
import './models/gltf/tank2/texture3.png';
import './models/gltf/tank2/texture4.png';

import './models/gltf/tank3/tank3-v.1.2.gltf';
import './models/gltf/tank3/tank3-v.1.2.bin';
import './models/gltf/tank3/target2_1.png';

import { ITWindow, IAppModule, IApplicationContainer } from './interfaces';

import AppEventBus from './app-event-bus';
import WindowResizer from './window-resizer';
import Application from './application';
import Controls from './controls';
import World from './world';
import FirstPersonCamera from './first-person-camera';
import KeyboarInput from './keyboard-input';
import MouseInput from './mouse-input';
import FrameRate from './frame-rate';
import AppEventLogger from './app-event-logger';

(window as ITWindow).THREE = THREE;

const RELOAD_APP_TIMEOUT: number = 3; // seconds
const RELOAD_APP_FOREVER: boolean = false;
const ENABLE_EVENT_CONSOLE_LOG: boolean = false;

function stop(module: IAppModule): void {
  console.log('Will attempt to destroy all...');

  if (!module.app) {
    return;
  }

  // Stop the animation loop.
  module.app.pause();

  module.world?.destroy();
  module.controls?.destroy();
  module.fpCamera?.destroy();
  module.app.destroy();
  module.frameRate?.destroy();
  module.keyboardInput?.destroy();
  module.mouseInput?.destroy();
  module.windowResizer?.destroy();

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    module.appEventLogger?.destroy();
  }

  module.eventBus?.destroy();

  delete module.world;
  module.world = undefined;

  delete module.controls;
  module.controls = undefined;

  delete module.fpCamera;
  module.fpCamera = undefined;

  delete module.app;
  module.app = undefined;

  delete module.frameRate;
  module.frameRate = undefined;

  delete module.mouseInput;
  module.mouseInput = undefined;

  delete module.keyboardInput;
  module.keyboardInput = undefined;

  delete module.windowResizer;
  module.windowResizer = undefined;

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    delete module.appEventLogger;
    module.appEventLogger = undefined;
  }

  delete module.eventBus;
  module.eventBus = undefined;

  console.log('Done!');
}

function start(): void {
  const module: IAppModule = {};
  const appContainer: IApplicationContainer = document.getElementById('app-container') as HTMLElement;

  module.eventBus = new AppEventBus();

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    module.appEventLogger = new AppEventLogger(
      module.eventBus,
      {
        animationFrame: false,
      },
    );
  }

  module.windowResizer = new WindowResizer(module.eventBus);
  module.keyboardInput = new KeyboarInput(module.eventBus, appContainer, true);
  module.mouseInput = new MouseInput(module.eventBus, appContainer, true);
  module.frameRate = new FrameRate(module.eventBus);

  module.app = new Application(
    module.eventBus,
    {
      appContainer,
      threeJsRendererCanvasClass: 'three-js-renderer-canvas',
    },
  );

  module.app.rendererReady().then(() => {
    if (!module.app) {
      return;
    }

    module.controls = new Controls(module.eventBus as AppEventBus);
    module.world = new World(module.eventBus as AppEventBus);
    module.fpCamera = new FirstPersonCamera(
      module.eventBus as AppEventBus,
      {
        lookSpeed: 50,
        movementSpeed: 1,
        camera: {
          x: 30,
          y: -10,
          z: 1,
          fieldOfView: 70,
        },
        theta: 270,
      },
    );

    // Set up things for the `animate` loop to work properly.
    module.app.camera = module.fpCamera.camera;
    module.app.scene = module.world.scene;
    module.windowResizer?.emit();

    // Start the animation loop.
    module.app.start();

    if (typeof RELOAD_APP_FOREVER === 'boolean' && RELOAD_APP_FOREVER) {
      window.setTimeout(() => {
        stop(module);
      }, RELOAD_APP_TIMEOUT * 1000);
    }
  });
}

start();

if (typeof RELOAD_APP_FOREVER === 'boolean' && RELOAD_APP_FOREVER) {
  window.setInterval(() => {
    start();
  }, (RELOAD_APP_TIMEOUT + 1) * 1000);
}
