import { AppEventBus } from './app-event-bus';
// import { FirstPersonControlsModule } from './first-person-controls';

class Controls {
  // private fpControls: FirstPersonControlsModule = null;

  constructor(eventBus: AppEventBus) {
    // this.fpControls = new FirstPersonControlsModule(app, eventBus);
    // this.fpControls = new FirstPersonControlsModule(app.camera, app.renderer.domElement);

    // this.fpControls.lookSpeed = 0.1;
    // this.fpControls.movementSpeed = 1;
  }

  // public update(delta: number): void {
  //   this.fpControls.update(delta);
  // }

  public destroy(): void {
    // this.fpControls.destroy();

    // delete this.fpControls;
    // this.fpControls = null;
  }
}

export {
  Controls
};
