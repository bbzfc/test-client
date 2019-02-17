import './styles/main.scss';
import './models/gltf/tank2/tank2.gltf';
import './models/gltf/tank2/tank2.bin';
import './models/gltf/tank2/texture1.png';
import './models/gltf/tank2/texture2.png';
import './models/gltf/tank2/texture3.png';
import './models/gltf/tank2/texture4.png';

import { ITWindow, IAppModule, IApplicationContainer } from './interfaces';

import { AppEventBus } from './app-event-bus';
import { WindowResizer } from './window-resizer';
import { Application } from './application';
import { Controls } from './controls';
import { World } from './world';
import { FirstPersonCamera } from './first-person-camera';
import { KeyboarInput } from './keyboard-input';
import { MouseInput } from './mouse-input';
import { FrameRate } from './frame-rate';
import { AppEventLogger } from './app-event-logger';

// Enable working with `GLTFLoader`. Right now it can't be simply imported
// as a TypeScript module. So we have this hack ;)
import * as THREE from 'three';
(window as ITWindow).THREE = THREE;
import('three/examples/js/loaders/GLTFLoader.js');

const RELOAD_APP_TIMEOUT: number = 3; // seconds
const RELOAD_APP_FOREVER: boolean = false;
const ENABLE_EVENT_CONSOLE_LOG: boolean = false;

function stop(module: IAppModule): void {
  console.log('Will attempt to destroy all...');

  // Stop the animation loop.
  module.app.pause();

  module.world.destroy();
  module.controls.destroy();
  module.fpCamera.destroy();
  module.app.destroy();
  module.frameRate.destroy();
  module.keyboardInput.destroy();
  module.mouseInput.destroy();
  module.windowResizer.destroy();

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    module.appEventLogger.destroy();
  }

  module.eventBus.destroy();

  delete module.world;
  module.world = null;

  delete module.controls;
  module.controls = null;

  delete module.fpCamera;
  module.fpCamera = null;

  delete module.app;
  module.app = null;

  delete module.frameRate;
  module.frameRate = null;

  delete module.mouseInput;
  module.mouseInput = null;

  delete module.keyboardInput;
  module.keyboardInput = null;

  delete module.windowResizer;
  module.windowResizer = null;

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    delete module.appEventLogger;
    module.appEventLogger = null;
  }

  delete module.eventBus;
  module.eventBus = null;

  console.log('Done!');
}

function start(): void {
  const module: IAppModule = {};
  const appContainer: IApplicationContainer = document.getElementById('app-container');

  module.eventBus = new AppEventBus();

  if (typeof ENABLE_EVENT_CONSOLE_LOG === 'boolean' && ENABLE_EVENT_CONSOLE_LOG) {
    module.appEventLogger = new AppEventLogger(
      module.eventBus,
      {
        animationFrame: false
      }
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
      threeJsRendererCanvasClass: 'three-js-renderer-canvas'
    }
  );

  module.app.rendererReady().then(() => {
    module.controls = new Controls(module.eventBus);
    module.world = new World(module.eventBus);
    module.fpCamera = new FirstPersonCamera(
      module.eventBus,
      {
        lookSpeed: 50,
        movementSpeed: 1,
        camera: {
          x: -40,
          y: -20,
          z: 1,
          fieldOfView: 40
        },
        theta: 70
      }
    );

    // Set up things for the `animate` loop to work properly.
    module.app.camera = module.fpCamera.camera;
    module.app.scene = module.world.scene;
    module.windowResizer.emit();

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
