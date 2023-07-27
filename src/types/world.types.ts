import {
  Mesh,
  HemisphereLight,
  SpotLight,
  DirectionalLight,
  Line,
  Group,
  Scene,

  MeshBasicMaterial,
  LineBasicMaterial,
  ShaderMaterial,
} from 'three';

type IWorldObject = Mesh | HemisphereLight | DirectionalLight | SpotLight | Line | Scene | Group;
type IWorldMaterial = MeshBasicMaterial | LineBasicMaterial | ShaderMaterial;

export {
  IWorldObject,
  IWorldMaterial,
};
