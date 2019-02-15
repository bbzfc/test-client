type IApplicationContainer = HTMLDocument | HTMLElement;

interface IApplicationOptions {
  appContainer?: IApplicationContainer;
  threeJsRendererCanvasClass?: string;
}

export {
  IApplicationOptions,
  IApplicationContainer
};
