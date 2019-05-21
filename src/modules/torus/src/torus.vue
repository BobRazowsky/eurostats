<!-- Torus Vue with basic data binding -->
<!-- Display the color ratios of the torus material -->
<!-- And its rotation parameters -->
<template>
    <div id="torus">
		<div v-if="color">
			<span class = "torus-title">Couleurs</span>
        	<br>r : {{round3(color.r)}}
        	<br>g : {{round3(color.g)}}
        	<br>b : {{round3(color.b)}}
        </div>
		<br>
        <div v-if="rotation" >
            <span class = "torus-title">Rotation </span>
             <br>x : {{round3(rotationEuler.x)}}
             <br>y : {{round3(rotationEuler.y)}}
             <br>z : {{round3(rotationEuler.z)}}
        </div>
    </div>
</template>

<script>
import Torus from "./torus";
import self from "../index";


export default {
    name: 'torus-infos',
    watch: {
        material(val) {
        }
    },
    mounted(){
        // We bind the torus data once it's ready
        self.app.events.on("ready",()=>{
            this.color = Torus.mesh.material.albedoColor;
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
    // method to display only the 3 first decimals
    methods: {
        round3(num){
            return num.toFixed(3);
        }
    }
}
</script>

<style>
    .torus-title{
        color : #34005B;
		font-weight: bold;
    }


</style>
