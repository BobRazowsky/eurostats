<!-- Torus Vue -->
<!-- Display the red ratio of the torus material -->
<!-- And its rotation parameters -->
<template>
    <div id="torus">
        <div v-if="color">Rouge : {{color.r}}</div>
        <br>
        <div v-if="rotation" >
            Rotation :
                <br>x: {{round3(rotationEuler.x)}}
                <br>y: {{round3(rotationEuler.y)}}
                <br>z: {{round3(rotationEuler.z)}}
        </div>
    </div>
</template>

<script>
import Torus from "./torus";
import self from "../index";


export default {
    name: 'torus-infos',
    mounted(){
        // We bind the torus data once it's ready
        self.app.events.on("ready",()=>{
            this.color = Torus.mesh.material.diffuseColor;
            this.rotation = Torus.mesh.rotationQuaternion;
        })
    },
    data(){
        return {
            color : null,
            rotation : null
        }
    },
    computed:{
        rotationEuler(){
            return this.rotation ? this.rotation.toEulerAngles() : null;
        }
    },
    components: {},
    methods: {
        round3(num){
            return Math.round(num*1000)/1000;
        }
    }
}
</script>
