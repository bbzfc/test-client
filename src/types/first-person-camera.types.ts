interface IApplicationOptionsCamera {
  [key: string]: number | undefined;
  fieldOfView?: number;
  x?: number;
  y?: number;
  z?: number;
}

interface IFirstPersonCameraOptions {
  lookSpeed?: number;
  movementSpeed?: number;
  camera?: IApplicationOptionsCamera;
  theta?: number;
}

export {
  IApplicationOptionsCamera,
  IFirstPersonCameraOptions,
};
