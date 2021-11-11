"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let transform;
    let agent;
    let healthCounter = 100;
    let stop = false;
    let collisionAnimation = true;
    let audioHit = new ƒ.Audio("./sound/hit.mp3");
    let health = document.getElementsByClassName('myBar');
    document.addEventListener("interactiveViewportStarted", start);
    let ctrForward = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */); //Copied from controls.ts
    ctrForward.setDelay(200); //Copied from controls.ts
    let ctrTurn = new ƒ.Control("Forward", 1, 0 /* PROPORTIONAL */); //Copied from controls.ts
    ctrTurn.setDelay(200); //Copied from controls.ts
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update); //gameloop, which refreshes the image (When loop is calles, run the Function update)
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        viewport.camera.mtxPivot.translateZ(-30);
        document.querySelector('.hud').classList.toggle('invisible');
        let graph = viewport.getBranch();
        let laser = graph.getChildrenByName("lasers")[0].getChildrenByName("all_lasers")[0].getChildrenByName("laser")[0];
        transform = laser.getComponent(ƒ.ComponentTransform).mtxLocal;
        agent = graph.getChildrenByName("all_agents")[0].getChildrenByName("agent_y")[0];
    }
    function update(_event) {
        // ƒ.Physics.world.simulate();  // if physics is included and used
        // let speedAgentRotation: number = 360;
        let speedLaserRotate = 180;
        // let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
        //forward / backwards
        let value = (ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN])
            + ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]));
        ctrForward.setInput(value * 0.2);
        agent.mtxLocal.translateY(ctrForward.getOutput());
        //Rotation
        let valueRotate = (ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])
            + ƒ.Keyboard.mapToValue(-1, 0, [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrTurn.setInput(valueRotate * 5);
        agent.mtxLocal.rotateZ(ctrTurn.getOutput());
        //Rotate Laser
        transform.rotateZ(speedLaserRotate * (ƒ.Loop.timeFrameReal / 1000));
        viewport.draw();
        ƒ.AudioManager.default.update();
        let beams = viewport.getBranch().getChildrenByName("lasers")[0].getChildrenByName("all_lasers")[0].getChildrenByName("laser")[0].getChildrenByName("beam");
        beams.forEach(beam => {
            checkCollision(agent, beam);
        });
    }
    function checkCollision(agent, beam) {
        let distance = ƒ.Vector3.TRANSFORMATION(agent.mtxWorld.translation, beam.mtxWorldInverse, true);
        let x = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.x / 2 + agent.radius;
        let y = beam.getComponent(ƒ.ComponentMesh).mtxPivot.scaling.y + agent.radius;
        if (distance.x <= (x) && distance.x >= -(x) && distance.y <= y && distance.y >= 0) {
            if (healthCounter > 0 && stop === false) {
                healthCounter = healthCounter - 0.5;
                health[0].setAttribute("style", "width: " + healthCounter + "%;");
                if (collisionAnimation === true) {
                    stopHAnimation();
                    startCAnimation();
                    collisionAnimation = false; //to stop restarting animation on each LOOP
                }
                if (healthCounter <= 1) { //stop health gowing or declining, when Dead
                    stop = true;
                    stopCAnimation();
                    document.querySelectorAll('.game-over')[0].classList.toggle("invisible");
                    document.querySelectorAll('.win-loose').forEach(elem => elem.classList.toggle("invisible"));
                    ;
                }
            }
        }
        else {
            if (healthCounter < 100 && stop === false) {
                healthCounter = healthCounter + 0.01;
                health[0].setAttribute("style", "width: " + healthCounter + "%;");
                if (collisionAnimation === false) {
                    stopCAnimation();
                    startHAnimation(); //stop all animations.
                    collisionAnimation = true; //to stop restarting animation on each LOOP
                }
                if (healthCounter >= 99) {
                    stopHAnimation(); // stop the health Animation when health is retored
                }
            }
        }
    }
})(Script || (Script = {}));
function startCAnimation() {
    anime({
        targets: '.progressAnimation1',
        translateY: [-2, 2],
        loop: true,
        direction: 'alternate',
        duration: 50,
        easing: 'easeInOutElastic',
    });
}
function stopCAnimation() {
    anime({
        targets: '.progressAnimation1',
        translateY: [0, 0],
        loop: true,
        direction: 'alternate',
        duration: 50,
        easing: 'easeInOutElastic',
    });
}
function startHAnimation() {
    anime({
        targets: '.progressAnimation1',
        scale: 1.03,
        loop: true,
        direction: 'alternate',
        duration: 700,
        easing: 'easeInOutSine',
    });
}
function stopHAnimation() {
    anime({
        targets: '.progressAnimation1',
        scale: 1,
        loop: true,
        direction: 'alternate',
        duration: 700,
        easing: 'easeInOutSine',
    });
}
//# sourceMappingURL=Script.js.map