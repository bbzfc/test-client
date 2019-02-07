type IApplicationContainer = HTMLDocument | HTMLElement;

interface IApplicationOptions {
  container?: IApplicationContainer;
  threeJsRendererCanvasClass?: string;
}

export {
  IApplicationOptions,
  IApplicationContainer
};
