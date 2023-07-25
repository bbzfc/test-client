// Enable working with `GLTFLoader`. Right now it can't be simply imported
// as a TypeScript module. So we have this hack ;)

import * as THREE from 'three';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import './styles/main.scss';

// import './models/gltf/tank2/tank2.bin';
// import './models/gltf/tank2/tank2.gltf';
// import './models/gltf/tank2/texture1.png';
// import './models/gltf/tank2/texture2.png';
// import './models/gltf/tank2/texture3.png';
// import './models/gltf/tank2/texture4.png';

// import './models/gltf/tank3/tank3-v.1.2.gltf';
// import './models/gltf/tank3/tank3-v.1.2.bin';
// import './models/gltf/tank3/target2_1.png';

import { ITWindow, IAppModule, IApplicationContainer } from './interfaces';

import AppEventBus from './app-event-bus';
import WindowResizeHandler from './window-resize-handler';
import Application from './application';
import Controls from './controls';
import World from './world';
import FirstPersonCamera from './first-person-camera';
import KeyboardInput from './keyboard-input';
import MouseInput from './mouse-input';
import FrameRate from './frame-rate';
import AppEventLogger from './app-event-logger';

(window as ITWindow).THREE = THREE;

const RELOAD_APP_TIMEOUT: number = 3; // seconds
const RELOAD_APP_FOREVER: boolean = false;
const ENABLE_EVENT_CONSOLE_LOG: boolean = false;

function noop() {}

function stop(module: IAppModule): void {
  console.log('Will attempt to destroy all...');

  // Stop the animation loop.
  (module.app) ? module.app.pause() : noop();

  // Call the destructor for each available module instance.
  (module.world) ? module.world.destroy() : noop();
  (module.controls) ? module.controls.destroy() : noop();
  (module.fpCamera) ? module.fpCamera.destroy() : noop();
  (module.app) ? module.app.destroy() : noop();
  (module.frameRate) ? module.frameRate.destroy() : noop();
  (module.keyboardInput) ? module.keyboardInput.destroy() : noop();
  (module.mouseInput) ? module.mouseInput.destroy() : noop();
  (module.windowResizeHandler) ? module.windowResizeHandler.destroy() : noop();
  (module.appEventLogger) ? module.appEventLogger.destroy() : noop();
  (module.eventBus) ? module.eventBus.destroy() : noop();

  // Clear up memory.
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

  delete module.keyboardInput;
  module.keyboardInput = undefined;

  delete module.mouseInput;
  module.mouseInput = undefined;

  delete module.windowResizeHandler;
  module.windowResizeHandler = undefined;

  delete module.appEventLogger;
  module.appEventLogger = undefined;

  delete module.eventBus;
  module.eventBus = undefined;

  // We are done!
  console.log('Done!');
}

function start(_module: IAppModule | null): IAppModule {
  const module: IAppModule = _module || {};
  const appContainer: IApplicationContainer = document.getElementById('app-container') as HTMLElement;

  module.eventBus = new AppEventBus();

  if (ENABLE_EVENT_CONSOLE_LOG) {
    module.appEventLogger = new AppEventLogger(
      module.eventBus,
      {
        animationFrame: false,
      },
    );
  }

  module.windowResizeHandler = new WindowResizeHandler(module.eventBus);
  module.keyboardInput = new KeyboardInput(module.eventBus, appContainer, true);
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
      throw new Error('You should have initialized `module.app` before this line.');
    }
    if (!module.windowResizeHandler) {
      throw new Error('You should have initialized `module.windowResizeHandler` before this line.');
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

    // Simulate a window resize event s oas to resize the app accordingly to latest window size.
    // This is to make sure everything is sane, and the app fits completely inside the window from frame 1.
    module.windowResizeHandler.emit();

    // Start the animation loop.
    module.app.start();
  });

  return module;
}

const module = start(null);

// Useful for testing memory leaks.
// The way you use it:
//   1. set `RELOAD_APP_FOREVER` to `true`
//   2. load application in browser
//   3. open and observe browser memory profile
//   4. over 30-60 minutes the application will restart enough times
//   5. If all is OK, the application memory usage should not grow over time.
if (RELOAD_APP_FOREVER) {
  window.setInterval(() => {
    stop(module);

    start(module);
  }, (RELOAD_APP_TIMEOUT) * 1000);
}
