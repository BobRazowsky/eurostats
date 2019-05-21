import self from "../index";
import BABYLON from "./babylon-modules";

/**
 * Simple Torus with changing color and orientation
 */
const Torus = {

    /**
     * @type BABYLON.Scene
     */
    scene: null,

    /**
    * @type ObsidianBabylonEngine
    */
    engine: self.app.modules.obsidianBabylonEngine,

    /**
     * @type ObsidianMaterialManager
     */
    materialManager: self.app.modules.obsidianMaterialManager,

    /**
     * Wait for the obsidian engine initialization
     * then launch the torus creation
     */
    Init() {

        Torus.engine.waitForLoading().then(() => {
            Torus.scene = Torus.engine.scene;
            Torus.materialManager.init(Torus.scene, BABYLON);
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

        // Load a material with the obsidian-material-manager
        torus.material = Torus.materialManager.loadMaterial("torus-material", {
            type: "PBRMaterial",
            albedoColor: "#555555",
            reflectivityColor: "#555555",
            microSurface: 0.8,
        },);

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

        // emit an event listened by the vue component
        self.app.events.emit("ready");

    },


};
export default Torus;
