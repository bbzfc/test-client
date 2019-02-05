import './styles/main.scss';
import './models/gltf/tank2/tank2-v.0.1.gltf';

import { AppEventBus } from './app-event-bus';
import { WindowResizer } from './window-resizer';
import { Application } from './application';
import { Controls } from './controls';
import { Game } from './game';

import * as THREE from 'three';

interface I3Window extends Window {
  THREE: any;
}
(window as I3Window).THREE = THREE;
import('three/examples/js/loaders/GLTFLoader.js');

interface IAppModule {
  eventBus?: AppEventBus;
  windowResizer?: WindowResizer;
  app?: Application;
  controls?: Controls;
  game?: Game;
}

function x() {
  const module: IAppModule = {};

  module.eventBus = new AppEventBus();
  module.windowResizer = new WindowResizer(module.eventBus);

  module.app = new Application(module.eventBus, {
    camera: {
      x: -20,
      y: 10,
      fieldOfView: 45
    },
    container: document.getElementById('app-container'),
    threeJsRendererCanvasClass: 'three-js-renderer-canvas'
  });

  module.app.rendererReady().then(() => {
    module.controls = new Controls(module.app, module.eventBus);
    module.game = new Game(module.eventBus, module.app);

    module.app.start();

    // window.setTimeout(() => {
    //   console.log('Will attempt to destroy all...');

    //   module.app.pause();

    //   module.game.destroy();
    //   module.controls.destroy();
    //   module.app.destroy();
    //   module.windowResizer.destroy();
    //   module.eventBus.destroy();

    //   delete module.game;
    //   module.game = null;

    //   delete module.controls;
    //   module.controls = null;

    //   delete module.app;
    //   module.app = null;

    //   delete module.windowResizer;
    //   module.windowResizer = null;

    //   delete module.eventBus;
    //   module.eventBus = null;
    // }, 7 * 1000);
  });
}

x();
// window.setInterval(() => {
//   x();
// }, 10 * 1000);
