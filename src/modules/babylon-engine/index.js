export default {

    name: "babylon-engine",

    requires: ["main-loop"],

    load() {
        const BabylonEngine = require("./babylon-engine").default;
        return new BabylonEngine();
    },

    unload() { },

    config: {

        // Id of the canvas to use for the BabylonJS engine
        canvasId: "canvas",

        // Enable antialias (see BABYLON.Engine constructor doc)
        antialias: false,

        // Babylon's engine options (see BABYLON.Engine constructor doc)
        engineOptions: {},

        // Babylon's scene options (see BABYLON.Scene constructor doc)
        sceneOptions: {},

        // Creates an hemispheric light
        exampleLight: true,

        // Creates an arc rotate camera
        exampleCamera: true,
    },
};
