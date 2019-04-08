export default {
    name: "vuejs",
    requires: [],
    load() {
        const VuejsController = require("./src/vuejs-controller").default;
        return new VuejsController();
    },
    unload() {},
};
