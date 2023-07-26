import {
  IAppEventTypeAnimationFramePayload,
  IAppEventTypeRendererGeometryUpdatePayload,
  IAppEventTypeKeyDownPayload,
  IAppEventTypeKeyUpPayload,
  IAppEventTypeMouseMovePayload,
  IAppEventTypePlayerStartMovementPayload,
  IAppEventTypePlayerStopMovementPayload,
  IAppEventTypeCameraLookPayload,
} from './types';

abstract class AppEvent {
  public readonly type: string = '';
}

abstract class AppEventWithPayload<T> extends AppEvent {
  public readonly payload: T;

  constructor(payload: T) {
    super();
    this.payload = payload;
  }
}

export class AppEventTypeAnimationFrame extends
  AppEventWithPayload<IAppEventTypeAnimationFramePayload> {
  static readonly type: string = 'AppEventTypeAnimationFrame';

  public readonly type: string = AppEventTypeAnimationFrame.type;
}

export class AppEventTypeWindowResize extends AppEvent {
  static readonly type: string = 'AppEventTypeWindowResize';

  public readonly type: string = AppEventTypeWindowResize.type;
}

export class AppEventTypeRendererGeometryUpdate extends
  AppEventWithPayload<IAppEventTypeRendererGeometryUpdatePayload> {
  static readonly type: string = 'AppEventTypeRendererGeometryUpdate';

  public readonly type: string = AppEventTypeRendererGeometryUpdate.type;
}

export class AppEventTypeKeyDown extends
  AppEventWithPayload<IAppEventTypeKeyDownPayload> {
  static readonly type: string = 'AppEventTypeKeyDown';

  public readonly type: string = AppEventTypeKeyDown.type;
}

export class AppEventTypeKeyUp extends
  AppEventWithPayload<IAppEventTypeKeyUpPayload> {
  static readonly type: string = 'AppEventTypeKeyUp';

  public readonly type: string = AppEventTypeKeyUp.type;
}

export class AppEventTypeMouseDown extends AppEvent {
  static readonly type: string = 'AppEventTypeMouseDown';

  public readonly type: string = AppEventTypeMouseDown.type;
}

export class AppEventTypeMouseUp extends AppEvent {
  static readonly type: string = 'AppEventTypeMouseUp';

  public readonly type: string = AppEventTypeMouseUp.type;
}

export class AppEventTypeMouseMove extends AppEventWithPayload<IAppEventTypeMouseMovePayload> {
  static readonly type: string = 'AppEventTypeMouseMove';

  public readonly type: string = AppEventTypeMouseMove.type;
}

export class AppEventTypePlayerStartMovement extends AppEventWithPayload<IAppEventTypePlayerStartMovementPayload> {
  static readonly type: string = 'AppEventTypePlayerStartMovement';

  public readonly type: string = AppEventTypePlayerStartMovement.type;
}

export class AppEventTypePlayerStopMovement extends AppEventWithPayload<IAppEventTypePlayerStopMovementPayload> {
  static readonly type: string = 'AppEventTypePlayerStopMovement';

  public readonly type: string = AppEventTypePlayerStopMovement.type;
}

export class AppEventTypeCameraLook extends AppEventWithPayload<IAppEventTypeCameraLookPayload> {
  static readonly type: string = 'AppEventTypeCameraLook';

  public readonly type: string = AppEventTypeCameraLook.type;
}

export type AppEventTypes =
  AppEventTypeAnimationFrame |
  AppEventTypeWindowResize |
  AppEventTypeRendererGeometryUpdate |
  AppEventTypeKeyDown |
  AppEventTypeKeyUp |
  AppEventTypeMouseDown |
  AppEventTypeMouseUp |
  AppEventTypeMouseMove |
  AppEventTypePlayerStartMovement |
  AppEventTypePlayerStopMovement |
  AppEventTypeCameraLook;
