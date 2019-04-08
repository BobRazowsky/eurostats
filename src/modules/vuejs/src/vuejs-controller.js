import Vue from "vue";
import App from "./templates/app.vue";

export default class VuejsController {

    constructor() {

        // Regroup data of different modules
        this.data = {

        };

        Vue.config.productionTip = false;

        // Data binding and vue creation
        App.data = () => this.data;
        this.app = new Vue({
            el: "#app",
            render: h => h(App),
        });


    }

}
