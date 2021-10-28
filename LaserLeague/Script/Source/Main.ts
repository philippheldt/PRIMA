namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let transform: ƒ.Matrix4x4;
  let agent: ƒ.Node;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);


  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL); //Copied from controls.ts
  ctrForward.setDelay(200); //Copied from controls.ts

  let ctrTurn: ƒ.Control = new ƒ.Control("Forward", 1, ƒ.CONTROL_TYPE.PROPORTIONAL); //Copied from controls.ts
  ctrTurn.setDelay(200); //Copied from controls.ts

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update); //gameloop, which refreshes the image (When loop is calles, run the Function update)
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    
    viewport.camera.mtxPivot.translateZ(-30);


    let graph: ƒ.Node = viewport.getBranch();
    let laser: ƒ.Node = graph.getChildrenByName("lasers")[0].getChildrenByName("all_lasers")[0].getChildrenByName("laser")[0];
    transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
    agent = graph.getChildrenByName("all_agents")[0].getChildrenByName("agent_y")[0];
  }

  function update(_event: Event): void {
    // ƒ.Physics.world.simulate();  // if physics is included and used

  // let speedAgentRotation: number = 360;
   let speedLaserRotate: number = 0;
  // let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
   
//forward / backwards
   let value: number = (
      ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
      + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP])
    );

    ctrForward.setInput(value * 0.2);
    agent.mtxLocal.translateY(ctrForward.getOutput());

//Rotation
    let valueRotate: number = (
      ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
      + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])
    );

    ctrTurn.setInput(valueRotate * 5);
    agent.mtxLocal.rotateZ(ctrTurn.getOutput());

//Rotate Laser
    transform.rotateZ(speedLaserRotate*(ƒ.Loop.timeFrameReal / 1000)); 
    viewport.draw();




    ƒ.AudioManager.default.update();

    let beams: ƒ.Node[] = viewport.getBranch().getChildrenByName("lasers")[0].getChildrenByName("all_lasers")[0].getChildrenByName("laser")[0].getChildrenByName("beam");
    beams.forEach(beam =>{
      checkCollision(agent, beam);
    })
    
  
  }


  function checkCollision(agent: ƒ.Node, beam:ƒ.Node): void {
  
    let distance: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
  
    let x = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x/2 + agent.radius;
    let y = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + agent.radius;
  
      if(distance.x <= (x) && distance.x >= -(x) && distance.y <= y && distance.y >= 0) {
        console.log('collision!');
      }
   
  
  
    
  }
}

