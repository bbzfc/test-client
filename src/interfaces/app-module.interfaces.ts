import { AppEventBus } from '../app-event-bus';
import { WindowResizer } from '../window-resizer';
import { Application } from '../application';
import { Controls } from '../controls';
import { World } from '../world';
import { FirstPersonCamera } from '../first-person-camera';

interface IAppModule {
  eventBus?: AppEventBus;
  windowResizer?: WindowResizer;
  app?: Application;
  controls?: Controls;
  world?: World;
  fpCamera?: FirstPersonCamera;
}

export {
  IAppModule
};
