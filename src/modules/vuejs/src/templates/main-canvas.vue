<template>
    <div id="canvas-container">
        <canvas id="main-canvas"></canvas>
    </div>
</template>

<script>
    export default {
        name: 'main-canvas',
        data () {
            return {
            }
        }
    }
</script>

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
