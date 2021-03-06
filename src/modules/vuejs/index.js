// VueJs Module : contains the main vue component
// and ui parts not binded to a specific module (ex : main-menu)
export default {
    name: "vuejs",
    requires: [],
    load() {
        const VuejsController = require("./src/vuejs-controller").default;
        return new VuejsController();
    },
    unload() {},
};
