<template>
	<div id="app">
        <main-menu></main-menu>
        <main-canvas></main-canvas>
    </div>
</template>




<script>
import Vue from 'vue';
import MainMenu from './main-menu.vue';
import MainCanvas from './main-canvas.vue';

//import Button from './components/Button'

export default {
    name: 'app',
    components: {
        "main-menu": MainMenu,
        "main-canvas": MainCanvas
    },
    created: function(){
        console.log("Hey, it's me, the main vue for your Obsidian app", this.meshManager);
    },
  }
</script>

<style src="./app.less"></style>
