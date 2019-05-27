import Vue from "vue";
import App from "./components/app.vue";

/**
 * Instanciate the main Vue, on the app element
 * @type {Boolean}
 */
export default class VuejsController {

    constructor() {

        Vue.config.productionTip = false;

        // Data binding and vue creation
        this.app = new Vue({
            el: "#app",
            render: h => h(App),
        });
    }

}
