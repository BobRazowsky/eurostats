<template>
    <div>Rouge : {{color.r}}</div>

</template>

<script>

import Torus from "./torus";


export default {
    name: 'torus-infos',
    data : () =>{
        return {
            mesh : Torus.mesh,
            color : Torus.mesh.material.diffuseColor
        }
    },
    components: {},
    methods: {

    }
  }

</script>
