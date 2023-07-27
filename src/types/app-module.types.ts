import AppEventBus from '../app-event-bus';
import WindowResizeHandler from '../window-resize-handler';
import Application from '../application';
import Control from '../control';
import World from '../world';
import FirstPersonCamera from '../first-person-camera';
import KeyboardInput from '../keyboard-input';
import MouseInput from '../mouse-input';
import FrameRate from '../frame-rate';
import AppEventLogger from '../app-event-logger';

export default interface IAppModule {
  eventBus?: AppEventBus;
  windowResizeHandler?: WindowResizeHandler;
  app?: Application;
  control?: Control;
  world?: World;
  fpCamera?: FirstPersonCamera;
  keyboardInput?: KeyboardInput;
  mouseInput?: MouseInput;
  frameRate?: FrameRate;
  appEventLogger?: AppEventLogger;
};
