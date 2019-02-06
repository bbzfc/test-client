import { Subscription } from 'rxjs';
import * as THREE from 'three';

import { Application } from './application';
import {
  AppEventBus,
  AppEventTypeRendererGeometryUpdate,
  AppEventTypeAnimationFrame
} from './app-event-bus';
import { IFirstPersonCameraOptions } from './interfaces/first-person-camera.interfaces';

function contextmenu(event: Event) {
  event.preventDefault();
}

class FirstPersonCamera {
  // public domElement: HTMLCanvasElement;
  private enabled: boolean;
  private movementSpeed: number;
  private lookSpeed: number;

  private mouseX: number;
  private mouseY: number;
  private lat: number;
  private lon: number;
  private phi: number;
  private theta: number;
  private moveForward = false;
  private moveBackward: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;
  private mouseDragOn: boolean;
  private renderElCenterX: number;
  private renderElCenterY: number;

  private _onMouseMove: (evt: MouseEvent) => void;
  private _onMouseDown: (evt: MouseEvent) => void;
  private _onMouseUp: (evt: MouseEvent) => void;

  private _onKeyDown: (evt: KeyboardEvent) => void;
  private _onKeyUp: (evt: KeyboardEvent) => void;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private _camera: THREE.PerspectiveCamera;
  private targetPosition: THREE.Vector3;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, options?: IFirstPersonCameraOptions) {
    this.eventBus = eventBus;
    if (!options) {
      options = {};
    }

    let cameraFieldOfView = 45;
    if (options.camera && typeof options.camera.fieldOfView === 'number') {
      if (options.camera.fieldOfView >= 1 && options.camera.fieldOfView <= 359) {
        cameraFieldOfView = options.camera.fieldOfView;
      }
    }

    this._camera = new THREE.PerspectiveCamera(cameraFieldOfView, 1);

    if (options.camera) {
      const propToMethod = {
        x: 'translateX',
        y: 'translateY',
        z: 'translateZ'
      };

      ['x', 'y', 'z'].forEach((axis): void => {
        if (typeof options.camera[axis] === 'number') {
          this._camera[propToMethod[axis]](options.camera[axis]);
        }
      });
    }

    this._camera.up.set(0, 0, 1);

    // this.domElement = app.canvasEl;

    this.targetPosition = new THREE.Vector3(0, 0, 0);

    if (typeof options.movementSpeed === 'number') {
      this.movementSpeed = options.movementSpeed;
    } else {
      this.movementSpeed = 1.0;
    }

    if (typeof options.lookSpeed === 'number') {
      this.lookSpeed = options.lookSpeed;
    } else {
      this.lookSpeed = 0.005;
    }

    this.mouseX = 0;
    this.mouseY = 0;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseDragOn = false;

    this.renderElCenterX = 0;
    this.renderElCenterY = 0;

    // this.domElement.setAttribute('tabindex', '-1');

    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onKeyUp =  this.onKeyUp.bind(this);

    // this.domElement.addEventListener('contextmenu', contextmenu, false);

    // this.domElement.addEventListener('mousemove', this._onMouseMove, false);
    // this.domElement.addEventListener('mousedown', this._onMouseDown, false);
    // this.domElement.addEventListener('mouseup', this._onMouseUp, false);

    // this.domElement.addEventListener('keydown', this._onKeyDown, false);
    // this.domElement.addEventListener('keyup', this._onKeyUp, false);

    // this.handleResize();
    this.enabled = true;
    this.update(0);
    this.enabled = false;

    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  private handleResize(
    // offsetWidth: number, offsetHeight: number,
    appWidth: number, appHeight: number,
    offsetLeft: number, offsetTop: number
  ) {
    this._camera.aspect = appWidth / appHeight;
    this._camera.updateProjectionMatrix();

    this.renderElCenterX = offsetLeft + appWidth * 0.5;
    this.renderElCenterY = offsetTop + appHeight * 0.5;
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.enabled === false) {
      // this.domElement.focus();
      this.enabled = true;
    }

    event.preventDefault();
    event.stopPropagation();

    // if (this.activeLook) {
    //   switch (event.button) {
    //     case 0: this.moveForward = true; break;
    //     case 2: this.moveBackward = true; break;
    //   }
    // }

    this.mouseDragOn = true;
  }

  public onMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // if (this.activeLook) {
    //   switch (event.button) {
    //     case 0: this.moveForward = false; break;
    //     case 2: this.moveBackward = false; break;
    //   }
    // }

    this.mouseDragOn = false;
  }

  public onMouseMove(event: MouseEvent): void {
    this.mouseX = event.pageX - this.renderElCenterX;
    this.mouseY = event.pageY - this.renderElCenterY;
  }

  public onKeyDown(event: KeyboardEvent) {
    // event.preventDefault();

    switch (event.code) {
      case 'ArrowUp': /*up*/
      case 'KeyW': /*W*/ this.moveForward = true; break;

      case 'ArrowLeft': /*left*/
      case 'KeyA': /*A*/ this.moveLeft = true; break;

      case 'ArrowDown': /*down*/
      case 'KeyS': /*S*/ this.moveBackward = true; break;

      case 'ArrowRight': /*right*/
      case 'KeyD': /*D*/ this.moveRight = true; break;

      case 'Escape': this.enabled = false; break;
    }
  }

  public onKeyUp(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp': /*up*/
      case 'KeyW': /*W*/ this.moveForward = false; break;

      case 'ArrowLeft': /*left*/
      case 'KeyA': /*A*/ this.moveLeft = false; break;

      case 'ArrowDown': /*down*/
      case 'KeyS': /*S*/ this.moveBackward = false; break;

      case 'ArrowRight': /*right*/
      case 'KeyD': /*D*/ this.moveRight = false; break;
    }
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    // const subscription = this.eventBus.subscribe((event: AppEventTypes) => {
    //   if (event instanceof AppEventTypeAnimationFrame) {
    //     this.update(event.payload.delta);
    //   }
    // });

    let subscription = this.eventBus.on(
      AppEventTypeAnimationFrame,
      (event: AppEventTypeAnimationFrame) => {
        this.update(event.payload.delta);
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeRendererGeometryUpdate,
      (event: AppEventTypeRendererGeometryUpdate) => {
        this.handleResize(
          event.payload.appWidth, event.payload.appHeight,
          event.payload.offsetLeft, event.payload.offsetTop
        );
      }
    );
    this.eventSubscriptions.push(subscription);
  }

  public update(delta: number): void {
    if (this.enabled === false) {
      return;
    }

    const actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward) {
      this._camera.translateX(-actualMoveSpeed);
    }
    if (this.moveBackward) {
      this._camera.translateX(actualMoveSpeed);
    }

    if (this.moveLeft) {
      this._camera.translateY(-actualMoveSpeed);
    }
    if (this.moveRight) {
      this._camera.translateY(actualMoveSpeed);
    }

    const actualLookSpeed = delta * this.lookSpeed;

    this.lon += this.mouseY * actualLookSpeed;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);
    this.theta = THREE.Math.degToRad(this.lon);

    const position = this._camera.position;

    this.targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    this.targetPosition.y = position.y + 100 * Math.cos(this.phi);
    this.targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this._camera.lookAt(this.targetPosition);
  }

  public destroy() {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    // this.domElement.removeEventListener('contextmenu', contextmenu, false);

    // this.domElement.removeEventListener('mousedown', this._onMouseDown, false);
    // this.domElement.removeEventListener('mousemove', this._onMouseMove, false);
    // this.domElement.removeEventListener('mouseup', this._onMouseUp, false);

    // this.domElement.removeEventListener('keydown', this._onKeyDown, false);
    // this.domElement.removeEventListener('keyup', this._onKeyUp, false);
  }
}

export {
  FirstPersonCamera
};
