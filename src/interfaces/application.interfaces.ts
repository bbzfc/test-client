type IApplicationContainer = HTMLDocument | HTMLElement;

interface IApplicationOptionsCamera {
  fieldOfView?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface IApplicationOptions {
  camera?: IApplicationOptionsCamera;
  container?: IApplicationContainer;
  threeJsRendererCanvasClass?: string;
}

export {
  IApplicationOptions,
  IApplicationContainer
};
