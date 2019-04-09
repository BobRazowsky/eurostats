export default {
    name: "torus",
    requires: ["babylon-engine"],
    load() {
        const Torus = require("./src/torus").default;
        Torus.Init();
        const TorusVue = require("./src/torus.vue");
        return {
            controller: Torus,
            view: TorusVue,
        };
    },
    unload() {},
};
