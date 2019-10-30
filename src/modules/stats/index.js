import "./style/index.less";

export default {
    name: "stats",
    requires: ["vuejs"],
    exposed: ["displayGame"],
    load() {
        const StatsController = require("./src/statsController").default;
        const VueComponent = require("./src/templates/index.vue").default;

        const controller = new StatsController();
        this.bind(VueComponent, controller);

        this.app.modules.vuejs.registerComponent(VueComponent);

        return new StatsController();
    },
    unload() {},
    bind(vue, controller) {
        vue.methods = vue.methods || {};
        const data = vue.data ? vue.data() : {};

        for (let i = 0; i < this.exposed.length; i++) {
            if (controller[this.exposed[i]] instanceof Function) {
                vue.methods[this.exposed[i]] = (...args) => controller[this.exposed[i]](args);
            } else {
                data[this.exposed[i]] = controller[this.exposed[i]];
            }
        }

        vue.data = () => data;
    },
};
