interface IAppEventTypeAnimationFramePayload {
  delta: number;
}

interface IAppEventTypeRendererGeometryUpdatePayload {
  appWidth: number;
  appHeight: number;
  offsetLeft: number;
  offsetTop: number;
}

interface IAppEventTypeKeyDownPayload {
  code: string;
}

interface IAppEventTypeKeyUpPayload {
  code: string;
}

interface IAppEventTypeMouseMovePayload {
  mouseX: number;
  mouseY: number;
}

export {
  IAppEventTypeAnimationFramePayload,
  IAppEventTypeRendererGeometryUpdatePayload,
  IAppEventTypeKeyDownPayload,
  IAppEventTypeKeyUpPayload,
  IAppEventTypeMouseMovePayload
};
