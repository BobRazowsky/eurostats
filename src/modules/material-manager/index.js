export default {
    name: "material-manager",
    requires: ["obsidian-babylon-engine", "http-request"],
    load() {
        const MaterialManager = require("./src/material-manager").default;
        return new MaterialManager();
    },
    unload() {},
};
