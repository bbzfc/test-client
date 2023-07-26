import { Subscription } from 'rxjs';
import {
  Line,
  LineBasicMaterial,
  AnimationMixer,
  BoxGeometry,
  AnimationAction,
  SpotLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  BufferAttribute,
  BufferGeometry,
  Scene,
  DirectionalLight,
  PlaneGeometry,
  Object3D,
  Vector3,
  MeshStandardMaterial,
  TextureLoader,
  SRGBColorSpace,
  Texture,
} from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { ASSETS_BASE_URL } from './env-variables';
import AppEventBus from './app-event-bus';
import { AppEventTypeAnimationFrame } from './app-events';
import { IWorldObject, IWorldMaterial } from './interfaces';

export default class World {
  private internalScene: Scene | undefined;

  private eventBus: AppEventBus;

  private eventSubscriptions: Subscription[] = [];

  private geometries: Array<BoxGeometry | BufferGeometry> = [];

  private materials: IWorldMaterial[] = [];

  private objects: Array<any> = [];

  private textures: Texture[] = [];

  updateTankAnimation: ((delta: number) => void) | null = null;

  private uniforms: { [key: string]: any } = {};

  private isInitialized: boolean;

  private isDestroyed: boolean;

  private playerOneObjPtr: IWorldObject | null = null;

  private playerTwoObjPtr: IWorldObject | null = null;

  xDirection: (1 | -1) = 1;

  constructor(eventBus: AppEventBus) {
    this.eventBus = eventBus;

    this.initWorldObjects();
    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public get scene(): Scene {
    return this.internalScene as Scene;
  }

  public destroy(): void {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.eventSubscriptions.forEach((subscription: Subscription, idx: number) => {
      subscription.unsubscribe();

      delete this.eventSubscriptions[idx];
      // this.eventSubscriptions[idx] = undefined;
    });
    this.eventSubscriptions = [];
    // this.eventSubscriptions = null;

    // delete this.eventBus;
    // this.eventBus = null;

    this.objects.forEach((object: IWorldObject, idx: number) => {
      this.internalScene?.remove(object);

      delete this.objects[idx];
      // this.objects[idx] = null;
    });
    this.objects = [];
    // this.objects = null;

    this.geometries.forEach(
      (geometry: BoxGeometry | BufferGeometry, idx: number) => {
        geometry.dispose();

        delete this.geometries[idx];
        // this.geometries[idx] = null;
      },
    );
    this.geometries = [];
    // this.geometries = null;

    this.textures.forEach((texture: Texture, idx: number) => {
      texture.dispose();

      delete this.textures[idx];
      // this.textures[idx] = null;
    });
    this.textures = [];
    // this.textures = null;

    this.materials.forEach((material: IWorldMaterial, idx: number) => {
      material.dispose();

      delete this.materials[idx];
      // this.materials[idx] = null;
    });
    this.materials = [];
    // this.materials = null;

    delete this.internalScene;
    // this.internalScene = null;

    this.uniforms = [];
    // this.uniforms = null;
  }

  private initWorldObjects(): void {
    this.internalScene = new Scene();

    this.geometries = [];
    this.materials = [];
    this.objects = [];
    this.textures = [];

    let geo: BoxGeometry | BufferGeometry;
    let mat: IWorldMaterial;
    let vertices: Float32Array;

    let obj: IWorldObject;

    let groundObjPtr: IWorldObject | null = null;

    this.uniforms = {
      scale: { type: 'f', value: 1.0 },
    };

    // ----------------------------------
    // Create a lot of random boxes - floating high in the sky.

    for (let i: number = 0; i <= 500; i += 1) {
      geo = new BoxGeometry(3, 3, 3);
      mat = new MeshBasicMaterial({ color: Math.random() * 0xffffff });
      // mat = new ShaderMaterial({
      //   uniforms: this.uniforms,
      //   vertexShader: (document.getElementById('vertexShader') as HTMLElement).textContent as string,
      //   fragmentShader: (document.getElementById('fragmentShader') as HTMLElement).textContent as string,
      // });
      obj = new Mesh(geo, mat);

      obj.position.x = Math.floor(Math.random() * 500) - 250;
      obj.position.y = Math.floor(Math.random() * 500) - 250;
      obj.position.z = Math.floor(Math.random() * 10) + 7;

      this.geometries.push(geo);
      this.materials.push(mat);
      this.objects.push(obj);
    }

    // ----------------------------------
    // Create a Hemisphere Light - general lighting.

    // obj = new HemisphereLight(0xeeeeee, 0x121212, 1);
    // this.objects.push(obj);

    // ----------------------------------
    // Create a platform - ground - for tanks to drive on.

    // geo = new PlaneGeometry(1000, 1000, 10, 10);
    geo = new BoxGeometry(5000, 5000, 5000);
    mat = new MeshBasicMaterial({ color: 0xaaaaaa, side: DoubleSide });
    // mat = new ShaderMaterial({
    //   uniforms: this.uniforms,
    //   vertexShader: (document.getElementById('vertexShader') as HTMLElement).textContent as string,
    //   fragmentShader: (document.getElementById('fragmentShader') as HTMLElement).textContent as string,
    // });
    obj = new Mesh(geo, mat);

    obj.position.z = -2505;

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    groundObjPtr = this.objects[this.objects.length - 1];

    // ----------------------------------
    // Create a sky.

    // geo = new PlaneGeometry(1000, 1000, 10, 10);
    geo = new BoxGeometry(5000, 5000, 5000);
    mat = new MeshBasicMaterial({ color: 0x23aaaa, side: DoubleSide });
    // mat = new ShaderMaterial({
    //   uniforms: this.uniforms,
    //   vertexShader: (document.getElementById('vertexShader') as HTMLElement).textContent as string,
    //   fragmentShader: (document.getElementById('fragmentShader') as HTMLElement).textContent as string,
    // });
    obj = new Mesh(geo, mat);

    obj.position.z = 2600;

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------
    // Create a Directional Light.

    obj = new DirectionalLight(0xffffff, 1);

    obj.position.x = 50;
    obj.position.y = -10;
    obj.position.z = 1;

    // Set the ground plane as the light's target.
    obj.target = groundObjPtr as IWorldObject;

    this.objects.push(obj);

    // ----------------------------------
    // Create a Spot Light.

    /*
    obj = new SpotLight(0xffffff, 1, 10);

    obj.position.x = 50;
    obj.position.y = -10;
    obj.position.z = 1;

    obj.shadow.mapSize.width = 1024;
    obj.shadow.mapSize.height = 1024;

    // Set the plane as the light's target.
    obj.target = groundObjPtr as IWorldObject;

    this.objects.push(obj);
    */

    // ----------------------------------
    // Create the white `X` axis.

    geo = new BufferGeometry();
    vertices = new Float32Array([
      -1000, 0, -4.5,
      0, 0, -4.5,
      1000, 0, -4.5,
    ]);

    // specify triangles, as triplets of indexes into the vertex list.
    geo.setIndex([0, 1, 2]);

    // specify vertex positions
    geo.setAttribute(
      'position',
      new BufferAttribute(vertices, 3),
    );

    mat = new LineBasicMaterial({
      color: 0xffffff, // white
      linewidth: 3,
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------
    // Create the green `Y` axis.

    geo = new BufferGeometry();
    vertices = new Float32Array([
      0, -1000, -4.5,
      0, 0, -4.5,
      0, 1000, -4.5,
    ]);

    // specify triangles, as triplets of indexes into the vertex list.
    geo.setIndex([0, 1, 2]);

    // specify vertex positions
    geo.setAttribute(
      'position',
      new BufferAttribute(vertices, 3),
    );

    mat = new LineBasicMaterial({
      color: 0x00ff00, // green
      linewidth: 3,
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------
    // Create the purple `Z` axis.

    geo = new BufferGeometry();
    vertices = new Float32Array([
      0, 0, -1000,
      0, 0, 0,
      0, 0, 1000,
    ]);

    // specify triangles, as triplets of indexes into the vertex list.
    geo.setIndex([0, 1, 2]);

    // specify vertex positions
    geo.setAttribute(
      'position',
      new BufferAttribute(vertices, 3),
    );

    mat = new LineBasicMaterial({
      color: 0x800080, // purple
      linewidth: 3,
    });
    obj = new Line(geo, mat);

    this.geometries.push(geo);
    this.materials.push(mat);
    this.objects.push(obj);

    // ----------------------------------

    this.loadModelCustomTexture(
      `${ASSETS_BASE_URL}/tank2/tank2.gltf`,
      `${ASSETS_BASE_URL}/tank2/texture4.png`,
      new Vector3(20, -5, -3),
      (_obj: IWorldObject) => {
        this.playerOneObjPtr = _obj;
      },
    );
    this.loadModel(
      `${ASSETS_BASE_URL}/tank3/tank3-v.1.2.gltf`,
      new Vector3(15, -30, -3),
      (_obj: IWorldObject) => {
        this.playerTwoObjPtr = _obj;
      },
    );

    // ----------------------------------

    this.objects.forEach((object: IWorldObject) => {
      this.internalScene?.add(object);
    });
  }

  private loadModelCustomTexture(
    tankModel: string,
    tankTexture: string,
    startingPosition: Vector3,
    cb: (obj: IWorldObject) => void,
  ): void {
    const loader: GLTFLoader = new GLTFLoader();

    loader.load(tankModel, (gltf: GLTF) => {
      let notNeededChildren: Object3D[] = [];

      const textureLoader: TextureLoader = new TextureLoader();
      textureLoader.load(
        tankTexture,
        (texture: Texture) => {
          texture.colorSpace = SRGBColorSpace;
          texture.flipY = false;
          texture.needsUpdate = true;

          gltf.scene.traverse((child: Mesh | Object3D) => {
            if (
              child.name.toLowerCase().includes('camera')
              || child.name.toLowerCase().includes('scene')
              || child.name.toLowerCase().includes('light')
            ) {
              notNeededChildren.push(child);
              return;
            }

            if (
              child instanceof Mesh
              && child.material instanceof MeshStandardMaterial
            ) {
              const childMaterial: MeshStandardMaterial = child.material;
              childMaterial.map = texture;

              childMaterial.map.colorSpace = SRGBColorSpace;
              childMaterial.map.needsUpdate = true;
              childMaterial.needsUpdate = true;
            }
          });

          notNeededChildren.forEach((child: Object3D, idx: number) => {
            gltf.scene.remove(child);

            delete notNeededChildren[idx];
            // notNeededChildren[idx] = null;
          });
          notNeededChildren = [];

          gltf.scene.rotateX(90 * (Math.PI / 180));
          gltf.scene.rotateY(270 * (Math.PI / 180));
          gltf.scene.position.x = startingPosition.x;
          gltf.scene.position.y = startingPosition.y;
          gltf.scene.position.z = startingPosition.z;

          this.textures.push(texture);
          this.objects.push(gltf.scene);

          cb(this.objects[this.objects.length - 1]);

          this.internalScene?.add(gltf.scene);
        },
        (progress: ProgressEvent) => {
          console.log(
            `texture progress => loaded = ${progress.loaded}, total = ${progress.total}`,
          );
        },
        (e: ErrorEvent) => {
          console.error('texture error => ', e);
        },
      );
    }, (progress: ProgressEvent) => {
      console.log(`GLTF progress => loaded = ${progress.loaded}, total = ${progress.total}`);
    }, (e: ErrorEvent) => {
      console.error('GLTF error => ', e);
    });
  }

  private loadModel(
    tankModel: string,
    startingPosition: Vector3,
    cb: (obj: IWorldObject) => void,
  ): void {
    const loader: GLTFLoader = new GLTFLoader();

    loader.load(tankModel, (gltf) => {
      let notNeededChildren: Object3D[] = [];

      gltf.scene.traverse((child: Mesh | Object3D) => {
        if (
          child.name.toLowerCase().includes('camera')
          || child.name.toLowerCase().includes('scene')
          || child.name.toLowerCase().includes('light')
        ) {
          notNeededChildren.push(child);
        }
      });

      notNeededChildren.forEach((child: Object3D, idx: number) => {
        gltf.scene.remove(child);

        delete notNeededChildren[idx];
        // notNeededChildren[idx] = null;
      });
      notNeededChildren = [];

      gltf.scene.rotateX(90 * (Math.PI / 180));
      gltf.scene.rotateY(180 * (Math.PI / 180));
      gltf.scene.position.x = startingPosition.x;
      gltf.scene.position.y = startingPosition.y;
      gltf.scene.position.z = startingPosition.z;

      this.updateTankAnimation = ((): (delta: number) => void => {
        const { animations } = gltf;
        const mixer: AnimationMixer = new AnimationMixer(gltf.scene);
        mixer.timeScale = 1.0;
        const firstAction: AnimationAction = mixer.clipAction(animations[0]);
        firstAction.play();

        console.log(firstAction);

        return (delta: number): void => {
          mixer.update(delta);
        };
      })();

      this.objects.push(gltf.scene);

      cb(this.objects[this.objects.length - 1]);

      this.internalScene?.add(gltf.scene);
    }, (progress: ProgressEvent) => {
      console.log(`GLTF progress => loaded = ${progress.loaded}, total = ${progress.total}`);
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
      },
    );

    this.eventSubscriptions.push(subscription);
  }

  private updateWorld(delta: number): void {
    for (let i: number = 0; i <= 500; i += 1) {
      this.objects[i].position.y += 0.5 * delta;
    }

    // this.uniforms.scale.value += 0.6 * delta;

    // Uncomment the line below to lower the frame rate.
    // this.stressTest();

    if (this.updateTankAnimation) {
      this.updateTankAnimation(delta);
    }

    if (this.playerOneObjPtr) {
      const tank1: IWorldObject = this.playerOneObjPtr;

      const centerX: number = 0; // Adjust this value to change the center along the x-axis
      const centerY: number = -15; // Adjust this value to change the center along the y-axis

      // Define the radius of the circular path
      const radius: number = 15; // Adjust this value to change the radius of the circle

      // Calculate the current angle of the tank in radians
      let angle: number = Math.atan2(tank1.position.y - centerY, tank1.position.x - centerX);

      // Increment the angle to make the tank move around the circle
      angle += 1 * (Math.PI / 180);

      // Calculate the new x and y positions based on the updated angle and radius
      const newX: number = centerX + radius * Math.cos(angle);
      const newY: number = centerY + radius * Math.sin(angle);

      // Update the tank's position
      tank1.position.x = newX;
      tank1.position.y = newY;

      tank1.rotateY(1 * (Math.PI / 180));
    }

    if (this.playerTwoObjPtr) {
      const tank2: IWorldObject = this.playerTwoObjPtr;

      if (tank2.position.x < -20) {
        this.xDirection = -1;
        tank2.rotateY(Math.PI);
      }

      if (tank2.position.x > 20) {
        this.xDirection = 1;
        tank2.rotateY(Math.PI);
      }

      tank2.position.x -= this.xDirection * 8 * delta;
    }

    // if (this.objects[508]) {
    //   this.objects[508].position.x -= 2.0 * delta;
    // }
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
