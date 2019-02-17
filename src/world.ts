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
  ShaderMaterial,
  PlaneBufferGeometry,
  Scene,
  GLTFLoader,
  DirectionalLight,
  Object3D,
  Vector3,
  GLTF,
  MeshStandardMaterial,
  TextureLoader,
  sRGBEncoding,
  Texture
} from 'three';

import { AppEventBus } from './app-event-bus';
import { AppEventTypeAnimationFrame } from './app-events';
import { IWorldObject, IWorldMaterial } from './interfaces';

class World {
  private internalScene: Scene;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private geometries: Array<BoxGeometry | Geometry | PlaneBufferGeometry>;
  private materials: IWorldMaterial[];
  private objects: IWorldObject[];
  private textures: Texture[];

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

    this.objects.forEach((object: IWorldObject, idx: number) => {
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

    this.textures.forEach((texture: Texture, idx: number) => {
      texture.dispose();

      delete this.textures[idx];
      this.textures[idx] = null;
    });
    delete this.textures;
    this.textures = null;

    this.materials.forEach((material: IWorldMaterial, idx: number) => {
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
    this.textures = [];

    let geo: BoxGeometry | PlaneBufferGeometry | Geometry;
    let mat: IWorldMaterial;
    let obj: IWorldObject;

    // ----------------------------------

    geo = new BoxGeometry(3, 3, 3);
    // mat = new MeshBasicMaterial({ color: 0xff0000 });
    mat = new ShaderMaterial({
      uniforms: {
        scale: { type: 'f', value: 10.0 }
      },
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentShader' ).textContent
    });
    obj = new Mesh(geo, mat);

    obj.position.x = 5;
    obj.position.y = -30;
    obj.position.z = 4;

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

    obj.shadow.mapSize.width = 1024;
    obj.shadow.mapSize.height = 1024;

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

    this.loadModelCustomTexture(
      'assets/tank2.gltf',
      'assets/texture4.png',
      new Vector3(20, -5, -3)
    );
    this.loadModel(
      'assets/tank3-v.1.1.gltf',
      new Vector3(20, -15, -3)
    );

    // ----------------------------------

    this.objects.forEach((object: IWorldObject) => {
      this.internalScene.add(object);
    });
  }

  private loadModelCustomTexture(
    tankModel: string,
    tankTexture: string,
    startingPosition: Vector3
  ): void {
    const loader: GLTFLoader = new GLTFLoader();

    loader.load(tankModel, (gltf: GLTF) => {
      let notNeededChildren: Object3D[] = [];

      const textureLoader: TextureLoader = new TextureLoader();
      textureLoader.load(
        tankTexture,
        (texture: Texture) => {
          texture.encoding = sRGBEncoding;
          texture.flipY = false;
          texture.needsUpdate = true;

          gltf.scene.traverse((child: Mesh | Object3D) => {
            if (
              child.name.toLowerCase().includes('camera') ||
              child.name.toLowerCase().includes('scene') ||
              child.name.toLowerCase().includes('light')
            ) {
              notNeededChildren.push(child);
              return;
            }

            if (
              child instanceof Mesh &&
              child.material instanceof MeshStandardMaterial
            ) {
              const childMaterial: MeshStandardMaterial = child.material;
              childMaterial.map = texture;

              childMaterial.map.encoding = sRGBEncoding;
              childMaterial.map.needsUpdate = true;
              childMaterial.needsUpdate = true;
            }
          });

          notNeededChildren.forEach((child: Object3D, idx: number) => {
            gltf.scene.remove(child);

            delete notNeededChildren[idx];
            notNeededChildren[idx] = null;
          });
          notNeededChildren = [];

          gltf.scene.rotateX(90 * (Math.PI / 180));
          gltf.scene.rotateY(270 * (Math.PI / 180));
          gltf.scene.position.x = startingPosition.x;
          gltf.scene.position.y = startingPosition.y;
          gltf.scene.position.z = startingPosition.z;

          this.textures.push(texture);
          this.objects.push(gltf.scene);

          this.internalScene.add(gltf.scene);
        }, (progress: ProgressEvent) => {
          console.log(
            'texture progress => loaded = ' + progress.loaded + ', total = ' + progress.total
          );
        }, (e: ErrorEvent) => {
          console.error('texture error => ', e);
        }
      );
    }, (progress: ProgressEvent) => {
      console.log('GLTF progress => loaded = ' + progress.loaded + ', total = ' + progress.total);
    }, (e: ErrorEvent) => {
      console.error('GLTF error => ', e);
    });
  }

  private loadModel(
    tankModel: string,
    startingPosition: Vector3
  ): void {
    const loader: GLTFLoader = new GLTFLoader();

    loader.load(tankModel, (gltf: GLTF) => {
      let notNeededChildren: Object3D[] = [];

      gltf.scene.traverse((child: Mesh | Object3D) => {
        if (
          child.name.toLowerCase().includes('camera') ||
          child.name.toLowerCase().includes('scene') ||
          child.name.toLowerCase().includes('light')
        ) {
          notNeededChildren.push(child);
        }
      });

      notNeededChildren.forEach((child: Object3D, idx: number) => {
        gltf.scene.remove(child);

        delete notNeededChildren[idx];
        notNeededChildren[idx] = null;
      });
      notNeededChildren = [];

      gltf.scene.rotateX(90 * (Math.PI / 180));
      gltf.scene.rotateY(270 * (Math.PI / 180));
      gltf.scene.position.x = startingPosition.x;
      gltf.scene.position.y = startingPosition.y;
      gltf.scene.position.z = startingPosition.z;

      this.objects.push(gltf.scene);

      this.internalScene.add(gltf.scene);
    }, (progress: ProgressEvent) => {
      console.log('GLTF progress => loaded = ' + progress.loaded + ', total = ' + progress.total);
    }, (e: ErrorEvent) => {
      console.error('GLTF error => ', e);
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
    if (this.objects[8]) {
      this.objects[8].position.x -= 2.0 * delta;
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
