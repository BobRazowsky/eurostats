<template>
<!-- canvas template -->
    <div id="canvas-container">
        <canvas id="main-canvas"></canvas>
    </div>
</template>


<script>
// We start the BabylonJs engine once the canvas html is builted (=> mounted function)
import self from "../../index";
    export default {
        name: 'main-canvas',
        mounted(){
            self.app.modules.obsidianBabylonEngine.start();
        },
        data () {
            return {
            }
        }
    }
</script>

<!-- Basic style -->
<style lang="less">
    #main-canvas {
        touch-action: none;
        height: 100%;
        width: 100%;
    }
    #canvas-container {
        width: calc(100% - 100px);
        height: 100%;
        position: absolute;
        left: 100px;
    }
</style>
