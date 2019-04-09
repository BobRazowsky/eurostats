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

    Init() {
        // We must create the torus once the babylonjs engine is ready
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

        // Torus update
        Torus.scene.registerBeforeRender(() => {
            // Color change
            const now = Date.now();
            torus.material.diffuseColor.r = (Math.sin(now * 0.0002)) ** 2;
            torus.material.diffuseColor.g = (Math.cos(now * 0.0007)) ** 2;
            torus.material.diffuseColor.b = (Math.cos(now * 0.0001)) ** 4;

            // Rotation change
            const ratio = Torus.scene.getAnimationRatio();
            torus.rotate(BABYLON.Vector3.Left(), 0.01 * ratio);
            torus.rotate(BABYLON.Vector3.Up(), 0.01 * ratio);
        });

        Torus.mesh = torus;
        torus.rotationQuaternion = BABYLON.Quaternion.Identity();

        // Ready events, listened by the view
        self.app.events.emit("ready");
    },


};
export default Torus;
