import { Subscription } from 'rxjs';
import {
  Geometry,
  Line,
  LineBasicMaterial,
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
  Vector3,
  GLTF
} from 'three';

import { AppEventBus } from './app-event-bus';
import {
  AppEventTypes, AppEventTypeAnimationFrame
} from './app-events';

class World {
  private internalScene: Scene;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private geometries: Array<BoxGeometry | Geometry | PlaneBufferGeometry>;
  private materials: Array<MeshBasicMaterial | LineBasicMaterial>;
  private objects: Array<Mesh | HemisphereLight | Object3D | Line>;

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
    return this.internalScene;
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

    delete this.eventBus;
    this.eventBus = null;

    this.objects.forEach((object: Mesh | HemisphereLight | Object3D, idx: number) => {
      this.internalScene.remove(object);

      delete this.objects[idx];
      this.objects[idx] = null;
    });
    delete this.objects;
    this.objects = null;

    this.geometries.forEach(
      (geometry: BoxGeometry | Geometry | PlaneBufferGeometry, idx: number) => {

      geometry.dispose();

      delete this.geometries[idx];
      this.geometries[idx] = null;

      }
    );
    delete this.geometries;
    this.geometries = null;

    this.materials.forEach((material: MeshBasicMaterial | LineBasicMaterial, idx: number) => {
      material.dispose();

      delete this.materials[idx];
      this.materials[idx] = null;
    });
    delete this.materials;
    this.materials = null;

    delete this.internalScene;
    this.internalScene = null;
  }

  private initWorldObjects(): void {
    this.internalScene = new Scene();

    this.geometries = [];
    this.materials = [];
    this.objects = [];

    let geo: BoxGeometry | PlaneBufferGeometry | Geometry;
    let mat: MeshBasicMaterial | LineBasicMaterial;
    let obj: Mesh | HemisphereLight | DirectionalLight | Line;

    // ----------------------------------

    geo = new BoxGeometry(3, 3, 3);
    mat = new MeshBasicMaterial({ color: 0xff0000 });
    obj = new Mesh(geo, mat);

    obj.position.x = 10;

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    obj = new HemisphereLight(0xeeeeee, 0x121212, 1);

    this.objects.push(obj);

    // ----------------------------------

    geo = new PlaneBufferGeometry(1000, 1000, 10, 10);
    mat = new MeshBasicMaterial({ color: 0xaaaaaa, side: DoubleSide });
    obj = new Mesh(geo, mat);

    obj.position.z = -7;

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    obj = new DirectionalLight(0xffffff, 1);

    obj.position.x = -20;
    obj.position.y = 20;
    obj.position.z = 5;

    // Set the cube as the light's target.
    obj.target = this.objects[0];

    this.objects.push(obj);

    // ----------------------------------

    geo = new Geometry();
    geo.vertices.push(
      new Vector3(-1000, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3(1000, 0, 0)
    );
    mat = new LineBasicMaterial({
      color: 0xffffff, // white
      linewidth: 3
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    geo = new Geometry();
    geo.vertices.push(
      new Vector3(0, -1000, 0),
      new Vector3(0, 0, 0),
      new Vector3(0, 1000, 0)
    );
    mat = new LineBasicMaterial({
      color: 0x00ff00, // green
      linewidth: 3
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    geo = new Geometry();
    geo.vertices.push(
      new Vector3(0, 0, -1000),
      new Vector3(0, 0, 0),
      new Vector3(0, 0, 1000)
    );
    mat = new LineBasicMaterial({
      color: 0x800080, // purple
      linewidth: 3
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    const loader: GLTFLoader = new GLTFLoader();

    loader.load('assets/tank2-v.0.2.gltf', (gltf: GLTF) => {
      let gltfCamera: Object3D = null;
      let gltfLamp: Object3D = null;

      gltf.scene.traverse((child: Object3D) => {
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
      gltf.scene.position.x = 20;
      gltf.scene.position.y = -5;
      gltf.scene.position.z = -3;

      this.objects.push(gltf.scene);
      this.internalScene.add(gltf.scene);
    }, (progress: ProgressEvent) => {
      console.log('GLTF progress => loaded = ' + progress.loaded + ', total = ' + progress.total);
    }, (e: ErrorEvent) => {
      console.error('GLTF error => ', e);
    });

    // ----------------------------------

    this.objects.forEach((object: Object3D) => {
      this.internalScene.add(object);
    });
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    const subscription: Subscription = this.eventBus.on(
      AppEventTypeAnimationFrame,
      (event: AppEventTypeAnimationFrame) => {
        this.updateWorld(event.payload.delta);
      }
    );

    this.eventSubscriptions.push(subscription);
  }

  private updateWorld(delta: number): void {
    this.objects[0].translateY(2.5 * delta);

    // Uncomment the line below to lower the frame rate.
    // this.stressTest();

    if (this.objects[7]) {
      this.objects[7].position.x -= 2.5 * delta;
    }
  }

  private stressTest(): void {
    const M: number = 0.5 * 1000 * 1000;
    const N: number = Math.floor(Math.random() * M);
    const a: number[] = Array.from(Array(N).keys())
      .map((i: number) => Math.random() * i * (1 / N));
    const b: number = a.reduce((p: number, n: number) => p + n);

    console.log(b);
  }
}

export {
  World
};
