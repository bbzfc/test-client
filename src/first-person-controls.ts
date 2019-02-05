import { Subscription } from 'rxjs';
import * as THREE from 'three';

import { Application } from './application';
import { AppEventBus, AppEventTypes, AppEventTypeAnimationFrame } from './app-event-bus';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

/*
 * Taken from Three.js distribution. Original file:
 *
 *   examples/js/controls/FirstPersonControls.js
 *
 * See https://github.com/mrdoob/three.js .
 *
 * Logic heavily modified. Adapted for TypeScript.
 *
 **/

function contextmenu(event: Event) {
  event.preventDefault();
}

class FirstPersonControlsModule {
  public domElement: HTMLCanvasElement;
  public enabled: boolean;
  public movementSpeed: number;
  public lookSpeed: number;

  public mouseX: number;
  public mouseY: number;
  public lat: number;
  public lon: number;
  public phi: number;
  public theta: number;
  public moveForward = false;
  public moveBackward: boolean;
  public moveLeft: boolean;
  public moveRight: boolean;
  public mouseDragOn: boolean;
  public viewHalfX: number;
  public viewHalfY: number;

  private _onMouseMove: (evt: MouseEvent) => void;
  private _onMouseDown: (evt: MouseEvent) => void;
  private _onMouseUp: (evt: MouseEvent) => void;

  private _onKeyDown: (evt: KeyboardEvent) => void;
  private _onKeyUp: (evt: KeyboardEvent) => void;

  private eventBus: AppEventBus;
  private eventSubscriptions: Subscription[];

  private camera: THREE.PerspectiveCamera;
  private clock: THREE.Clock;
  private targetPosition: THREE.Vector3;

  private isInitialized: boolean;
  private isDestroyed: boolean;

  constructor(app: Application, eventBus: AppEventBus) {
    this.clock = app.clock;
    this.camera = app.camera;
    this.eventBus = eventBus;
    this.targetPosition = new THREE.Vector3(0, 0, 0);
    this.domElement = app.canvasEl;

    this.movementSpeed = 1.0;
    this.lookSpeed = 0.005;

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

    this.viewHalfX = 0;
    this.viewHalfY = 0;

    this.domElement.setAttribute('tabindex', '-1');

    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onKeyUp =  this.onKeyUp.bind(this);

    this.domElement.addEventListener('contextmenu', contextmenu, false);

    this.domElement.addEventListener('mousemove', this._onMouseMove, false);
    this.domElement.addEventListener('mousedown', this._onMouseDown, false);
    this.domElement.addEventListener('mouseup', this._onMouseUp, false);

    this.domElement.addEventListener('keydown', this._onKeyDown, false);
    this.domElement.addEventListener('keyup', this._onKeyUp, false);

    this.handleResize();
    this.enabled = true;
    this.update();
    this.enabled = false;

    this.initEventSubscriptions();

    this.isInitialized = true;
    this.isDestroyed = false;
  }

  public handleResize() {
    this.viewHalfX = this.domElement.offsetWidth * 0.5;
    this.viewHalfY = this.domElement.offsetHeight * 0.5;
  }

  public onMouseDown(event: MouseEvent): void {
    if (this.enabled === false) {
      this.domElement.focus();
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
    this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
    this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;
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

    const subscription = this.eventBus.subscribe((event: AppEventTypes) => {
      if (event instanceof AppEventTypeAnimationFrame) {
        this.update();
      }
    });
    this.eventSubscriptions.push(subscription);
  }

  public update(): void {
    if (this.enabled === false) {
      return;
    }

    let delta = this.clock.getDelta();
    if (delta > 1) {
      delta = this.clock.getDelta();
    }
    const actualMoveSpeed = delta * this.movementSpeed;

    if (this.moveForward) {
      this.camera.translateX(-actualMoveSpeed);
    }
    if (this.moveBackward) {
      this.camera.translateX(actualMoveSpeed);
    }

    if (this.moveLeft) {
      this.camera.translateY(-actualMoveSpeed);
    }
    if (this.moveRight) {
      this.camera.translateY(actualMoveSpeed);
    }

    const actualLookSpeed = delta * this.lookSpeed;

    this.lon += this.mouseX * actualLookSpeed;

    this.lat = Math.max(-85, Math.min(85, this.lat));
    this.phi = THREE.Math.degToRad(90 - this.lat);
    this.theta = THREE.Math.degToRad(this.lon);

    const position = this.camera.position;

    this.targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
    this.targetPosition.y = position.y + 100 * Math.cos(this.phi);
    this.targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

    this.camera.lookAt(this.targetPosition);
  }

  public destroy() {
    if (this.isInitialized !== true || this.isDestroyed === true) {
      return;
    }
    this.isDestroyed = true;

    this.domElement.removeEventListener('contextmenu', contextmenu, false);

    this.domElement.removeEventListener('mousedown', this._onMouseDown, false);
    this.domElement.removeEventListener('mousemove', this._onMouseMove, false);
    this.domElement.removeEventListener('mouseup', this._onMouseUp, false);

    this.domElement.removeEventListener('keydown', this._onKeyDown, false);
    this.domElement.removeEventListener('keyup', this._onKeyUp, false);
  }
}

export {
  FirstPersonControlsModule
};
