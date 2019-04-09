<template>
<div id="menu-view"></div>
</template>

<script>
import self from "../../index";

export default {
    name: 'main-menu',
    components: {
        "torus-menu": self.app.modules.torus.view
    },
    methods: {

    }
}

</script>
<style>
    #menu-view{
        float : left;
        width : 100px;
        height : 100%;
    }
</style>
