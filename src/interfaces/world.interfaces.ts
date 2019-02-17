import {
  Mesh,
  HemisphereLight,
  SpotLight,
  DirectionalLight,
  Line,
  Scene,

  MeshBasicMaterial,
  LineBasicMaterial,
  ShaderMaterial
} from 'three';

type IWorldObject = Mesh | HemisphereLight | DirectionalLight | SpotLight | Line | Scene;
type IWorldMaterial = MeshBasicMaterial | LineBasicMaterial | ShaderMaterial;

export {
  IWorldObject,
  IWorldMaterial
};
