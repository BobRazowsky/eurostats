<!-- Main menu (on the left side of the canvas)-->
<!-- Container for other menu elements  -->
<template>
    <div id="menu-view">
        <torus-menu />
    </div>
</template>

<script>
import self from "../../index";

export default {
    name: "MainMenu",
    components: { // We display the torus view
        "torus-menu": self.app.modules.torus.view,
    },
    methods: {
    },
};
</script>

<style>
    #menu-view{
        float : left;
        width : 100px;
        height : 100%;
    }
</style>
