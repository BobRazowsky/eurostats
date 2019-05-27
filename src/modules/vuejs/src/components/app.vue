<!-- Main Vue for the obsidian app -->

<template>
    <!-- HTML template -->
    <div id="app">
        <!-- Contains the main menu (on the left ) -->
        <main-menu />

        <!-- And the canvas, where the BabylonJs Scene is rendered -->
        <main-canvas />
    </div>
</template>


<script>
// Js Part
import self from "../../index";

// Vue components
import MainMenu from "./main-menu.vue";
import MainCanvas from "./main-canvas.vue";

// Minimal export
export default {
    name: "app",
    components: {
        "main-menu": MainMenu,
        "main-canvas": MainCanvas,
    },
    created() {
        self.app.log.info("Hey, it's me, the main vue for your Obsidian app", this.meshManager);
    },
};
</script>

<!-- the style can be in an other file like here, or directely in the .vue file -->
<style src="./app.less"></style>
