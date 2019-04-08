<template>
    <canvas id="main-canvas"></canvas>
</template>

<script>
    export default {
        name: 'canvas',
        data () {
            return {
            }
        }
    }
</script>

<style lang="less">
    #main-canvas {
        width: calc(100%-100px);
        height: 100%;
        touch-action: none;
        position: absolute;
        left: 100px;
    }
</style>
