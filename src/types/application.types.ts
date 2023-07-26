type IApplicationContainer = Document | HTMLElement;

interface IApplicationOptions {
  appContainer?: IApplicationContainer;
  threeJsRendererCanvasClass?: string;
}

export {
  IApplicationOptions,
  IApplicationContainer,
};
