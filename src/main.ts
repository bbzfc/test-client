import './styles/main.scss';
import './models/gltf/tank2/tank2-v.0.1.gltf';

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

const timeToLive: number = 20; // seconds

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
  module.appEventLogger.destroy();
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

  delete module.appEventLogger;
  module.appEventLogger = null;

  delete module.eventBus;
  module.eventBus = null;

  console.log('Done!');
}

function start(): void {
  const module: IAppModule = {};
  const appContainer: IApplicationContainer = document.getElementById('app-container');

  module.eventBus = new AppEventBus();
  module.appEventLogger = new AppEventLogger(
    module.eventBus,
    {
      animationFrame: false
    }
  );
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
        lookSpeed: 0.1,
        movementSpeed: 1,
        camera: {
          x: -40,
          y: -10,
          z: 1,
          fieldOfView: 40
        },
        theta: 90
      }
    );

    // Set up things for the `animate` loop to work properly.
    module.app.camera = module.fpCamera.camera;
    module.app.scene = module.world.scene;
    module.windowResizer.emit();

    // Start the animation loop.
    module.app.start();

    window.setTimeout(() => {
      stop(module);
    }, timeToLive * 1000);
  });
}

start();
window.setInterval(() => {
  start();
}, (timeToLive + 1) * 1000);
