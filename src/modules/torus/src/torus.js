import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import self from "../index";


/**
 * Simple Torus with changing color and orientation
 */
const Torus = {

    /**
     * @type BABYLON.Scene
     */
    scene: null,

    /**
     * @type BABYLON.Mesh
     */
    mesh: null,

    test: "test",

    /**
     * @type ObsidianMaterialManager
     */
    materialManager: self.app.modules.obsidianMaterialManager,

    /**
     * @type ObsidianBabylonEngine
     */
    engine: self.app.modules.obsidianBabylonEngine,

    /**
     * Wait for the obsidian engine initialization
     * then launch the torus creation
     */
    Init() {

        Torus.engine.waitForLoading().then(() => {
            Torus.scene = Torus.engine.scene;
            Torus.materialManager.init(Torus.scene);
            Torus.CreateTorus();
        });

    },

    CreateTorus() {

        // The torus mesh
        const torus = BABYLON.MeshBuilder.CreateTorus(
            "torus", {
                thickness: 0.5,
                tessellation: 32,
            },
            Torus.scene
        );
        torus.rotationQuaternion = BABYLON.Quaternion.Identity();
        Torus.mesh = torus;

        // Load material from the json config file
        Torus.materialManager.loadMaterialsFromJSON("assets/modules/material-library/materials.json").then(() => {

            torus.material = Torus.materialManager.getMaterials().inox;

            // Torus color and rotation update
            Torus.scene.registerBeforeRender(() => {
                const now = Date.now();
                torus.material.albedoColor.r = (Math.sin(now * 0.0002)) ** 2;
                torus.material.albedoColor.g = (Math.cos(now * 0.0007)) ** 2;
                torus.material.albedoColor.b = (Math.cos(now * 0.0001)) ** 4;

                const ratio = Torus.scene.getAnimationRatio();
                torus.rotate(BABYLON.Vector3.Left(), 0.01 * ratio);
                torus.rotate(BABYLON.Vector3.Up(), 0.01 * ratio);
            });

            self.app.events.emit("ready");
        });

        // });

        // Ready events, listened by the view
    },


};
export default Torus;
