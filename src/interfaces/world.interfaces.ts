import {
  Mesh,
  HemisphereLight,
  DirectionalLight,
  Line,
  Scene,

  MeshBasicMaterial,
  LineBasicMaterial,
  ShaderMaterial
} from 'three';

type IWorldObject = Mesh | HemisphereLight | DirectionalLight | Line | Scene;
type IWorldMaterial = MeshBasicMaterial | LineBasicMaterial | ShaderMaterial;

export {
  IWorldObject,
  IWorldMaterial
};
