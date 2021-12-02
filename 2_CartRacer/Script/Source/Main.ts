namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!")

  let viewport: ƒ.Viewport;
  let graph: any;
  let cart: ƒ.Node;
  let cartNode: ƒ.Node;
  let mtxTerrain: ƒ.Matrix4x4;
  let meshTerrain: ƒ.MeshTerrain;
  let cmpCamera = new ƒ.ComponentCamera();
  let carSpeed: number = 3;
  let carTurn: number = 2;
  let ctrForward: ƒ.Control = new ƒ.Control("Forward", 10, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrForward.setDelay(500);
  let ctrTurn: ƒ.Control = new ƒ.Control("Turn", 100, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrTurn.setDelay(200);

  window.addEventListener("load", start);

  async function start(_event: Event): Promise<void> {

    await ƒ.Project.loadResourcesFromHTML();
    graph = ƒ.Project.resources["Graph|2021-11-18T14:34:07.958Z|41539"];

    cart = graph.getChildrenByName("CartNode")[0].getChildrenByName("Cart")[0];
    cartNode = graph.getChildrenByName("CartNode")[0];

    cartNode.mtxLocal.translation = new ƒ.Vector3(-16, 3.0000, -34.5);
    cartNode.mtxLocal.rotation = new ƒ.Vector3( 0, -90, 0);

    cmpCamera.mtxPivot.translation = new ƒ.Vector3(0,8,-12);
    cmpCamera.mtxPivot.rotation = new ƒ.Vector3(25,0,0);
    cartNode.addComponent(cmpCamera);

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, cmpCamera, canvas);

    viewport.calculateTransforms();

    ƒ.AudioManager.default.listenTo(graph);
    ƒ.AudioManager.default.listenWith(graph.getComponent(ƒ.ComponentAudioListener));


    let cmpMeshTerrain: ƒ.ComponentMesh = graph.getChildrenByName("Terrain")[0].getComponent(ƒ.ComponentMesh);
    meshTerrain = <ƒ.MeshTerrain>cmpMeshTerrain.mesh;
    mtxTerrain = cmpMeshTerrain.mtxWorld;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    console.log("graph: ", graph);

  }

  function update(_event: Event): void {
    console.log("trans", cartNode.mtxLocal.translation.toString());

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    //controls
    let turn: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    ctrTurn.setInput(turn * carTurn * deltaTime);
    cartNode.mtxLocal.rotateY(ctrTurn.getOutput());

    let forward: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
    ctrForward.setInput(forward * carSpeed * deltaTime);
    cartNode.mtxLocal.translateZ(ctrForward.getOutput());

    let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(cartNode.mtxLocal.translation, mtxTerrain);
    cartNode.mtxLocal.translation = terrainInfo.position;
    cartNode.mtxLocal.showTo(ƒ.Vector3.SUM(terrainInfo.position, cartNode.mtxLocal.getZ()), terrainInfo.normal);

    viewport.draw();

    ƒ.AudioManager.default.update();
  }
}