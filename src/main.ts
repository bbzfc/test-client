import './styles/main.scss';
import './models/gltf/tank2/tank2-v.0.1.gltf';

import { ITWindow } from './interfaces/three-window.interfaces';
import { IAppModule } from './interfaces/app-module.interfaces';

import { AppEventBus } from './app-event-bus';
import { WindowResizer } from './window-resizer';
import { Application } from './application';
import { Controls } from './controls';
import { World } from './world';
import { FirstPersonCamera } from './first-person-camera';

// Enable working with `GLTFLoader`. Right now it can't be simply imported
// as a TypeScript module. So we have this hack ;)
import * as THREE from 'three';
(window as ITWindow).THREE = THREE;
import('three/examples/js/loaders/GLTFLoader.js');

function stop(module: IAppModule) {
  console.log('Will attempt to destroy all...');

  // Stop the animation loop.
  module.app.pause();

  module.world.destroy();
  module.controls.destroy();
  module.fpCamera.destroy();
  module.app.destroy();
  module.windowResizer.destroy();
  module.eventBus.destroy();

  delete module.world;
  module.world = null;

  delete module.controls;
  module.controls = null;

  delete module.fpCamera;
  module.fpCamera = null;

  delete module.app;
  module.app = null;

  delete module.windowResizer;
  module.windowResizer = null;

  delete module.eventBus;
  module.eventBus = null;

  console.log('Done!');
}

function start() {
  const module: IAppModule = {};

  module.eventBus = new AppEventBus();
  module.windowResizer = new WindowResizer(module.eventBus);

  module.app = new Application(
    module.eventBus,
    {
      container: document.getElementById('app-container'),
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
          x: -20,
          y: 10,
          fieldOfView: 45
        }
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
    }, 7 * 1000);
  });
}

start();
window.setInterval(() => {
  start();
}, 10 * 1000);
