<template>
    <div id="menu">
        <button class="menuItem" v-bind:class="{ selected: gameSelected == 'euromillions' }" v-on:click="switchGame('euromillions')">Euromillions</button>
        <button class="menuItem" v-bind:class="{ selected: gameSelected == 'loto' }" v-on:click="switchGame('loto')">Loto</button>
    </div>
</template>

<script>
const slf = require("../../index.js").default;
const vue = slf.app.modules.vuejs.app;
const vueData = slf.app.modules.vuejs.data;

export default {
    name: 'navigation',
    order: 1,
    computed: {
        gameSelected() {
            return vueData.games[vueData.currentGame];
        }
    },
    methods :  {
        switchGame: function (game) {
            let index = vueData.games.indexOf(game);
            vueData.currentGame = index;
            vue.$emit("select-game", vueData.games[vueData.currentGame]);
        }
    }
}
</script>

<style lang="less">
@import "../../../../definitions.less";

    #menu {
        width: 200px;
        height: 100%;
        background-color: red;

        display: flex;
        flex-direction: column;

        button {
            &.selected {
                background-color: blue;
            }
        }

    }
</style>
