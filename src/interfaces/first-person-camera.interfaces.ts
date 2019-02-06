interface IApplicationOptionsCamera {
  fieldOfView?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface IFirstPersonCameraOptions {
  lookSpeed?: number;
  movementSpeed?: number;
  camera?: IApplicationOptionsCamera;
}
