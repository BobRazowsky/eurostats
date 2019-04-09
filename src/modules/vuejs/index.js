export default {
    name: "vuejs",
    requires: ["torus", "obsidian-babylon-engine"],
    load() {
        const VuejsController = require("./src/vuejs-controller").default;
        return new VuejsController();
    },
    unload() {},
};
