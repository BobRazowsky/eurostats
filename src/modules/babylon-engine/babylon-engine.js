import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import self from "./index";

/**
 * Handle basic BabylonJs engine and scene initialization
 */
export default class BabylonEngine {

    constructor() {
        const config = BabylonEngine.fetchConfig();
        const canvasId = config.get("canvasId");
        const antialias = config.get("antialias") || false;
        const sceneOptions = config.get("sceneOptions") || {};
        const engineOptions = config.get("engineOptions") || {};

        /** @type HTMLCanvasElement */
        this.canvas = document.getElementById(canvasId);

        /** @type BABYLON.Engine */
        this.engine = new BABYLON.Engine(this.canvas, antialias, engineOptions);

        /** @type BABYLON.Scene */
        this.scene = new BABYLON.Scene(this.engine, sceneOptions);

        /** @type BABYLON.Camera */
        this.camera = null;

        /** @type BABYLON.Light */
        this.light = null;

        this.initEngine();

        // creates basic camera and light if asked in config
        if (config.get("exampleCamera")) {
            this.initExampleCamera();
        }

        if (config.get("exampleLight")) {
            this.initExampleLight();
        }

    }

    /**
     * Render loop
     */
    loop() {
        this.scene.render();
    }

    /**
     * Launch the render loop and handle engine resize
     */
    initEngine() {
        this.engine.runRenderLoop(() => this.loop());
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    initExampleCamera() {
        this.camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 5, BABYLON.Vector3.Zero(), this.scene);
        this.camera.lowerRadiusLimit = 2;
        this.camera.attachControl(this.canvas, true);
    }

    initExampleLight() {
        this.light = new BABYLON.HemisphericLight("Light1", new BABYLON.Vector3(1, 1, 0), this.scene);
    }

    static fetchConfig() {
        return self.app.config;
    }

}
