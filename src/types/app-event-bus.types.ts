import { MOVEMENT_DIRECTION } from './control.types';

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

interface IAppEventTypePlayerStartMovementPayload {
  direction: MOVEMENT_DIRECTION;
}

interface IAppEventTypePlayerStopMovementPayload {
  direction: MOVEMENT_DIRECTION;
}

interface IAppEventTypeCameraLookPayload {
  xPos: number;
  yPos: number;
}

export {
  IAppEventTypeAnimationFramePayload,
  IAppEventTypeRendererGeometryUpdatePayload,
  IAppEventTypeKeyDownPayload,
  IAppEventTypeKeyUpPayload,
  IAppEventTypeMouseMovePayload,
  IAppEventTypePlayerStartMovementPayload,
  IAppEventTypePlayerStopMovementPayload,
  IAppEventTypeCameraLookPayload,
};
