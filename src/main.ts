// Enable working with `GLTFLoader`.
// Right now it can't be simply imported as a TypeScript module.
// So we have this hack ;)
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { ITWindow } from './interfaces';
// (window as ITWindow).THREE = THREE;

import {
  RELOAD_APP_FOREVER,
  RELOAD_APP_TIMEOUT,
  ENABLE_EVENT_CONSOLE_LOG,
} from './env-variables';

import './styles/main.scss';

import { IAppModule, IApplicationContainer } from './interfaces';

import World from './world';
import Controls from './controls';
import FirstPersonCamera from './first-person-camera';
import Application from './application';
import FrameRate from './frame-rate';
import KeyboardInput from './keyboard-input';
import MouseInput from './mouse-input';
import WindowResizeHandler from './window-resize-handler';
import AppEventLogger from './app-event-logger';
import AppEventBus from './app-event-bus';

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

function start(_module?: IAppModule): IAppModule {
  const module: IAppModule = _module || {};
  const appContainer: IApplicationContainer = ((): HTMLElement => {
    const el = document.getElementById('app-container');

    if (!el) {
      throw new Error('Please provide element with id `app-container` in index.html file.');
    }

    return el;
  })();

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
    if (!module.eventBus) {
      throw new Error('You should have initialized `module.eventBus` before this line.');
    }

    module.controls = new Controls(module.eventBus);
    module.world = new World(module.eventBus);
    module.fpCamera = new FirstPersonCamera(
      module.eventBus,
      {
        lookSpeed: 20,
        movementSpeed: 0.3,
        camera: {
          x: 50,
          y: -10,
          z: 1,
          fieldOfView: 70,
        },
        theta: 270,
      },
    );

    // Set up things for the `animate` loop to work properly.
    // NOTE: We are invoking setter functions, and not modifying private properties.
    module.app.camera = module.fpCamera.camera;
    module.app.scene = module.world.scene;

    // Simulate a window resize event so as to resize the app accordingly to latest window size.
    // This is to make sure everything is sane, and the app fits completely inside the window from frame 1.
    module.windowResizeHandler.emit();

    // Start the animation loop.
    module.app.start();
  });

  return module;
}

const module = start();

// Useful for testing memory leaks. The way you use it:
//
//   1. set `MY_APP_RELOAD_APP_FOREVER` to `true` in `.env` file.
//   2. Launch `npm run start` so that changes in `.env` file take effect.
//   3. Load application in the browser.
//   4. Open and observe browser memory profiler.
//   5. Over 30-60 minutes the application will restart MANY times.
//   6. If all is OK, the application memory usage should not grow over time.
if (RELOAD_APP_FOREVER) {
  window.setInterval(() => {
    stop(module);

    start(module);
  }, (RELOAD_APP_TIMEOUT) * 1000);
}
