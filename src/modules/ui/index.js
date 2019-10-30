import "./style/index.less";

export default {
    name: "ui",
    requires: ["vuejs"],
    exposed: [],
    load() {
        const UIController = require("./src/UIController").default;
        const VueComponent = require("./src/templates/index.vue").default;

        const controller = new UIController();
        this.bind(VueComponent, controller);

        this.app.modules.vuejs.registerComponent(VueComponent, "left-panel");

        return new UIController();
    },
    unload() {},
    bind(vue, controller) {
        vue.methods = vue.methods || {};
        const data = {};

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
