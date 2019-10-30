<!-- Main Vue for the obsidian app -->

<template>
<!-- HTML template -->
	<div id="app">
        <!-- Injected components -->
        <div id="left-panel">
            <component v-for="comp in modules" v-if="comp._element === 'left-panel'" v-bind:is="comp" v-bind:key="comp.name" style="pointer-events: all">
            </component>
        </div>
        <component v-for="comp in modules" v-if="!comp._element" v-bind:is="comp" v-bind:key="comp.name">
        </component>
        
    </div>
</template>

<script>
// Js Part

// Vue components


// Minimal export
export default {
    name: 'app',
    components: {},
    created: function(){
        console.log("Hey, it's me, the main vue for your Obsidian app");
    },
  }
</script>

<!-- the style can be in an other file like here, or directely in the .vue file -->
<style src="./app.less"></style>
