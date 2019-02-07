interface IApplicationOptionsCamera {
  fieldOfView?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface IFirstPersonCameraOptions {
  lookSpeed?: number;
  movementSpeed?: number;
  camera?: IApplicationOptionsCamera;
}

export {
  IApplicationOptionsCamera,
  IFirstPersonCameraOptions
};
