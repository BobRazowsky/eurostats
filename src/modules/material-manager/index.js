export default {
    name: "material-manager",
    requires: [],
    load() {
        const MaterialManager = require("./src/material-manager").default;
        return new MaterialManager();
    },
    unload() { },
};
