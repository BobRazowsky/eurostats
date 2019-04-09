export default {
    name: "vuejs",
    requires: ["torus"],
    load() {
        const VuejsController = require("./src/vuejs-controller").default;
        return new VuejsController();
    },
    unload() {},
};
