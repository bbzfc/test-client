import { Subscription } from 'rxjs';
import {
  BoxGeometry,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Scene,
  GLTFLoader,
  DirectionalLight,
  Object3D,
  GLTF
} from 'three';

import { AppEventBus, AppEventTypes, AppEventTypeAnimationFrame } from './app-event-bus';

class World {
  private _scene: Scene;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private geometries: Array<BoxGeometry | PlaneBufferGeometry>;
  private materials: MeshBasicMaterial[];
  private objects: Array<Mesh | HemisphereLight | Object3D>;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;

    this.initWorldObjects();
    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public get scene(): Scene {
    return this._scene;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();
      delete this.eventSubscriptions[idx];
      this.eventSubscriptions[idx] = null;
    });
    delete this.eventSubscriptions;
    this.eventSubscriptions = null;

    for (let i: number = this.objects.length - 1; i >= 0; i -= 1) {
      this._scene.remove(this.objects[i]);
      delete this.objects[i];
      this.objects[i] = null;
    }
    delete this.objects;
    this.objects = null;

    this.geometries.forEach((geometry: BoxGeometry | PlaneBufferGeometry, idx: number) => {
      geometry.dispose();
      delete this.geometries[idx];
      this.geometries[idx] = null;
    });
    delete this.geometries;
    this.geometries = null;

    this.materials.forEach((material: MeshBasicMaterial, idx: number) => {
      material.dispose();
      delete this.materials[idx];
      this.materials[idx] = null;
    });
    delete this.materials;
    this.materials = null;
  }

  private initWorldObjects(): void {
    this._scene = new Scene();

    this.geometries = [];
    this.materials = [];
    this.objects = [];

    let geo: BoxGeometry | PlaneBufferGeometry;
    let mat: MeshBasicMaterial;
    let obj: Mesh | HemisphereLight;

    geo = new BoxGeometry(3, 3, 3);
    mat = new MeshBasicMaterial({ color: 0xff0000 });
    obj = new Mesh(geo, mat);

    obj.rotateX(31 * (Math.PI / 180));
    obj.rotateY(51 * (Math.PI / 180));

    // obj.position.y = 0;
    // obj.position.x = 0;
    // obj.position.z = 0;

    obj.translateZ(-2);
    obj.translateX(3);
    obj.translateY(15);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    obj = new HemisphereLight(0xeeeeee, 0x121212, 0.5);

    this.objects.push(obj);

    geo = new PlaneBufferGeometry(2000, 2000, 8, 8);
    mat = new MeshBasicMaterial({ color: 0xaaaaaa, side: DoubleSide });
    obj = new Mesh(geo, mat);

    obj.position.z = -7;

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    const light: DirectionalLight = new DirectionalLight(0xffffff, 1);
    light.position.x = -100;
    light.position.y = 150;
    this._scene.add(light);

    // model
    // const loader: GLTFLoader = new (window as I3Window).THREE.GLTFLoader();
    const loader: GLTFLoader = new GLTFLoader();

    loader.load('assets/tank2-v.0.1.gltf', (gltf: GLTF) => {
      let gltfCamera: Object3D = null;
      let gltfLamp: Object3D = null;

      gltf.scene.traverse((child: Object3D) => {
        // console.log(child);

        if (child.name.toLowerCase() === 'camera') {
          gltfCamera = child;
        } else if (child.name.toLowerCase() === 'lamp') {
          gltfLamp = child;
        }
      });

      if (gltfCamera) {
        gltf.scene.remove(gltfCamera);
      }
      if (gltfLamp) {
        gltf.scene.remove(gltfLamp);
      }

      gltf.scene.rotateX(90 * (Math.PI / 180));
      gltf.scene.rotateY(270 * (Math.PI / 180));
      gltf.scene.translateZ(-20);
      gltf.scene.translateX(-2);
      gltf.scene.translateY(-3);

      this._scene.add(gltf.scene);

      this.objects.push(gltf.scene);

    }, undefined, (e: ErrorEvent) => {
      console.error(e);
    });

    // ----------------------------------

    this.objects.forEach((object: Object3D) => {
      this._scene.add(object);
    });
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.subscribe((event: AppEventTypes) => {
      if (event instanceof AppEventTypeAnimationFrame) {
        // debugger;

        this.updateWorld();
      }
    });
    this.eventSubscriptions.push(subscription);
  }

  private updateWorld(): void {
    // const delta = this.app.clock.getDelta();
    // this.controls.update(delta);

    // debugger;
    this.objects[0].rotation.x += 0.01;

    if (this.objects[3]) {
      this.objects[3].position.x -= 0.05;
    }
  }
}

export {
  World
};
