import AppEventBus from '../app-event-bus';
import WindowResizer from '../window-resizer';
import Application from '../application';
import Controls from '../controls';
import World from '../world';
import FirstPersonCamera from '../first-person-camera';
import KeyboarInput from '../keyboard-input';
import MouseInput from '../mouse-input';
import FrameRate from '../frame-rate';
import AppEventLogger from '../app-event-logger';

export default interface IAppModule {
  eventBus?: AppEventBus;
  windowResizer?: WindowResizer;
  app?: Application;
  controls?: Controls;
  world?: World;
  fpCamera?: FirstPersonCamera;
  keyboardInput?: KeyboarInput;
  mouseInput?: MouseInput;
  frameRate?: FrameRate;
  appEventLogger?: AppEventLogger;
};
