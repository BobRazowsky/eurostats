<template>
<div v-if="color">Rouge : {{color.r}}</div>
</template>

<script>
import Torus from "./torus";


export default {
    name: 'torus-infos',
    watch: {
        material(val) {
            this.color = val.diffuseColor;
        }
    },
    data(){
        return {
            torus: Torus,
            color : null
        }
    },
    computed:{
        material(){
            return Torus.mesh? Torus.mesh.material: null;
        }
    },
    components: {},
    methods: {

    }
}
</script>
