export default interface IAppEventLoggerOptions {
  [key: string]: boolean | undefined;
  animationFrame?: boolean;
  windowResize?: boolean;
  geometryUpdate?: boolean;
  keyDown?: boolean;
  keyUp?: boolean;
  mouseDown?: boolean;
  mouseUp?: boolean;
  mouseMove?: boolean;
  cameraLook?: boolean;
};
