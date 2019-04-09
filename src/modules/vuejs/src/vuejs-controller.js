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
        App.data = () => this.data;
        this.app = new Vue({
            el: "#app",
            render: h => h(App),
        });
    }

}
