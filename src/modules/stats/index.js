import "./style/index.less";

export default {
    name: "stats",
    requires: [],
    load() {
        const StatsController = require("./src/statsController").default;

        return new StatsController();
    },
    unload() {},
};
