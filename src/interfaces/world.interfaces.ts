import {
  Mesh,
  HemisphereLight,
  DirectionalLight,
  Line,
  Scene
} from 'three';

type IWorldObject = Mesh | HemisphereLight | DirectionalLight | Line | Scene;

export {
  IWorldObject
};
