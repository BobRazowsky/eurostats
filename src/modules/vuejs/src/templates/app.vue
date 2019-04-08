<template>
	<div id="app">
        <menu></menu>
        <main-canvas></main-canvas>

    </div>
</template>




<script>
import Vue from 'vue';
import Menu from './menu.vue';
import MainCanvas from './main-canvas.vue';

//import Button from './components/Button'

export default {
    name: 'app',
    components: {
        "menu":Menu, "main-canvas":MainCanvas
    },
    created: function(){
        console.log("COUCOU c'est moi l'app",this.meshManager);
    },
    methods: {
        onClick() {

        }
    }
  }
</script>

<style src="./app.less"></style>
