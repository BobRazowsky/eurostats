export default {
    name: "torus",
    requires: ["babylon-engine"],
    load() {
        const Torus = require("./torus").default;
        Torus.Init();
        return Torus;
    },
    unload() {},
};
