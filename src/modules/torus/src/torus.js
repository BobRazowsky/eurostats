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

    mesh: null,

    test: "test",

    Init() {
        if (self.app.modules.obsidianBabylonEngine.isReady) {
            Torus.CreateTorus();
        } else {
            self.app.events.on("@obsidian-babylon-engine.ready", () => {
                Torus.CreateTorus();
            });
        }
    },

    CreateTorus() {
        Torus.scene = self.app.modules.obsidianBabylonEngine.scene;
        // The torus and its material
        const torus = BABYLON.MeshBuilder.CreateTorus(
            "torus", {
                thickness: 0.5,
                tessellation: 32,
            },
            Torus.scene
        );
        const torusMaterial = new BABYLON.StandardMaterial("torusMaterial", Torus.scene);
        torus.material = torusMaterial;

        // // Torus update
        // Torus.scene.registerBeforeRender(() => {
        //     // Color change
        //     const now = Date.now();
        //     torus.material.diffuseColor.r = (Math.sin(now * 0.0002)) ** 2;
        //     torus.material.diffuseColor.g = (Math.cos(now * 0.0007)) ** 2;
        //     torus.material.diffuseColor.b = (Math.cos(now * 0.0001)) ** 4;

        //     // Rotation change
        //     const ratio = Torus.scene.getAnimationRatio();
        //     torus.rotate(BABYLON.Vector3.Left(), 0.01 * ratio);
        //     torus.rotate(BABYLON.Vector3.Up(), 0.01 * ratio);
        // });

        Torus.mesh = torus;
        // self.app.events.on("@material-manager.ready", () => {
        /** @type BABYLON.Scene  */
        torus.material = self.app.modules.materialManager.loadedMaterials.inox;
        // });
    },


};
export default Torus;
