import { Subscription } from 'rxjs';

import {
  PerspectiveCamera,
  Vector3
} from 'three';

import { Math as TMath } from 'three';

import { AppEventBus } from './app-event-bus';
import {
  AppEventTypeRendererGeometryUpdate,
  AppEventTypeAnimationFrame
} from './app-events';
import { IFirstPersonCameraOptions } from './interfaces';

class FirstPersonCamera {
  private enabled: boolean;
  private movementSpeed: number;
  private lookSpeed: number;

  private mouseX: number;
  private mouseY: number;

  private theta: number;

  private moveForward: boolean = false;
  private moveBackward: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private internalCamera: PerspectiveCamera;
  private targetPosition: Vector3;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(eventBus: AppEventBus, options?: IFirstPersonCameraOptions) {
    this.eventBus = eventBus;
    if (!options) {
      options = {};
    }

    let cameraFieldOfView: number = 45;
    if (options.camera && typeof options.camera.fieldOfView === 'number') {
      if (options.camera.fieldOfView >= 1 && options.camera.fieldOfView <= 359) {
        cameraFieldOfView = options.camera.fieldOfView;
      }
    }

    this.internalCamera = new PerspectiveCamera(cameraFieldOfView, 1);

    if (options.camera) {
      ['x', 'y', 'z'].forEach((axis: string): void => {
        if (typeof options.camera[axis] === 'number') {
          this.internalCamera.position[axis] = options.camera[axis];
        }
      });
    }

    this.internalCamera.up.set(0, 0, 1);
    this.internalCamera.updateProjectionMatrix();

    this.targetPosition = new Vector3(0, 0, 0);

    if (typeof options.movementSpeed === 'number') {
      this.movementSpeed = options.movementSpeed;
    } else {
      this.movementSpeed = 1.0;
    }

    if (typeof options.theta === 'number') {
      this.theta = options.theta;
    } else {
      this.theta = 0;
    }

    if (typeof options.lookSpeed === 'number') {
      this.lookSpeed = options.lookSpeed;
    } else {
      this.lookSpeed = 0.005;
    }

    this.mouseX = 0;
    this.mouseY = 0;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.enabled = true;
    this.update(0);
    this.enabled = false;

    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public get camera(): PerspectiveCamera {
    return this.internalCamera;
  }

  private handleResize(
    appWidth: number, appHeight: number
  ): void {
    this.internalCamera.aspect = appWidth / appHeight;
    this.internalCamera.updateProjectionMatrix();
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.enabled === false) {
      this.enabled = true;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  private initEventSubscriptions(): void {
    this.eventSubscriptions = [];

    let subscription: Subscription = this.eventBus.on(
      AppEventTypeAnimationFrame,
      (event: AppEventTypeAnimationFrame) => {
        this.update(event.payload.delta);
      }
    );
    this.eventSubscriptions.push(subscription);

    subscription = this.eventBus.on(
      AppEventTypeRendererGeometryUpdate,
      (event: AppEventTypeRendererGeometryUpdate) => {
        this.handleResize(event.payload.appWidth, event.payload.appHeight);
      }
    );
    this.eventSubscriptions.push(subscription);
  }

  public update(delta: number): void {
    if (this.enabled === false) {
      return;
    }

    const actualMoveSpeed: number = delta * this.movementSpeed;

    if (this.moveForward) {
      this.internalCamera.translateX(-actualMoveSpeed);
    }
    if (this.moveBackward) {
      this.internalCamera.translateX(actualMoveSpeed);
    }

    if (this.moveLeft) {
      this.internalCamera.translateY(-actualMoveSpeed);
    }
    if (this.moveRight) {
      this.internalCamera.translateY(actualMoveSpeed);
    }

    const actualLookSpeed: number = delta * this.lookSpeed;
    this.theta += this.mouseX * actualLookSpeed;

    console.log('mouseX = ' + this.mouseX + ', actualLookSpeed = ' + actualLookSpeed);
    console.log('theta = ' + this.theta);

    const thetaRad: number = TMath.degToRad(this.theta);

    this.targetPosition.x = this.internalCamera.position.x + Math.sin(thetaRad);
    this.targetPosition.y = this.internalCamera.position.y + Math.cos(thetaRad);
    this.targetPosition.z = 1;

    console.log(
      'pos.x = ' + this.targetPosition.x + ', ' +
      'pos.y = ' + this.targetPosition.y + ', ' +
      'pos.z = ' + this.targetPosition.z + '.'
    );

    this.internalCamera.lookAt(this.targetPosition);
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
  }
}

export {
  FirstPersonCamera
};

// private onKeyUp(event: KeyboardEvent): void {
//   switch (event.code) {
//     case 'ArrowUp': /*up*/
//     case 'KeyW': /*W*/ this.moveForward = false; break;

//     case 'ArrowLeft': /*left*/
//     case 'KeyA': /*A*/ this.moveLeft = false; break;

//     case 'ArrowDown': /*down*/
//     case 'KeyS': /*S*/ this.moveBackward = false; break;

//     case 'ArrowRight': /*right*/
//     case 'KeyD': /*D*/ this.moveRight = false; break;
//   }
// }

// private onKeyDown(event: KeyboardEvent): void {
//   switch (event.code) {
//     case 'ArrowUp': /*up*/
//     case 'KeyW': /*W*/ this.moveForward = true; break;

//     case 'ArrowLeft': /*left*/
//     case 'KeyA': /*A*/ this.moveLeft = true; break;

//     case 'ArrowDown': /*down*/
//     case 'KeyS': /*S*/ this.moveBackward = true; break;

//     case 'ArrowRight': /*right*/
//     case 'KeyD': /*D*/ this.moveRight = true; break;

//     case 'Escape': this.enabled = false; break;
//   }
// }
