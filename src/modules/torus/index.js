export default {
    name: "torus",
    requires: ["obsidian-babylon-engine", "obsidian-material-manager"],
    load() {
        const Torus = require("./src/torus").default;
        Torus.Init();
        const TorusVue = require("./src/torus.vue").default;
        return {
            controller: Torus,
            view: TorusVue,
        };
    },
    unload() {},
};
