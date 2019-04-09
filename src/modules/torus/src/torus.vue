<template>
<div>Rouge : {{color.r}}</div>
</template>

<script>
import Torus from "./torus";


export default {
    name: 'torus-infos',
    watch: {
        material(val) {
            this.color = val.material.diffuseColor;
        }
    },
    data(){
        return {
            torus: Torus,
            color : {r :0}
        }
    },
    computed:{
        material(){
            return Torus.mesh? Torus.mesh.material: {diffuseColor : {r :0}};
        }
    },
    components: {},
    methods: {

    }
}
</script>
