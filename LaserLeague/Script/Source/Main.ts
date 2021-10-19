namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update); //gameloop, which refreshes the image (When loop is calles, run the Function update)
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    viewport.camera.mtxPivot.translateZ(-30);
    
    let graph: ƒ.Node = viewport.getBranch();
    let laser: ƒ.Node = graph.getChildrenByName("lasers")[0].getChildrenByName("all_lasers")[0].getChildrenByName("laser")[0]; //auswählen des Laser Objekts aus JSON
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    agent = graph.getChildrenByName("all_agents")[0].getChildrenByName("agent_y")[0];
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
    let speedAgentTranslation: number = 10; //meters per second
    let speedAgentRotation: number = 360;

    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])){
      agent.mtxLocal.translateY(speedAgentTranslation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])){
      agent.mtxLocal.translateY(-speedAgentTranslation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      agent.mtxLocal.rotateZ(speedAgentRotation * deltaTime);
    }
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      agent.mtxLocal.rotateZ(-speedAgentRotation * deltaTime);
    } // returns "true" if one of the keys are pressed (KEYBOARD_CODE =  welcher Knopf gedrückt wurde)


    let speedLaserRotate: number = 180; //How many Degrees to rotate in one Second
    transform.rotateZ(speedLaserRotate*(ƒ.Loop.timeFrameReal / 1000)); //Den Laser nehmen und ihn um 3° um seine Z-Achse drehen
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}