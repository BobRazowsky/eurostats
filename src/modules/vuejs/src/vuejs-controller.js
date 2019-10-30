import Vue from "vue";
import App from "./templates/app.vue";

/**
 * Instanciate the main Vue, on the app element
 * @type {Boolean}
 */
export default class VuejsController {

    constructor() {

        Vue.config.productionTip = false;

        // Data binding and vue creation
        this.data = {
            modules: [],
            games: ["euromillions", "loto"],
            currentGame: 0,
        };

        App.data = () => this.data;
        this.app = new Vue({
            el: "#app",
            render: h => h(App),
        });
    }

    registerComponent(component, divId) {
        const { name } = component;
        App.components[name] = component;
        component._element = divId;
        this.data.modules.push(component);
        this.data.modules.sort((a, b) => a.order - b.order);
    }

}
