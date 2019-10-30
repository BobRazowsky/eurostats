<!-- Main menu (on the left side of the canvas)-->
<!-- Container for other menu elements  -->
<template>
    <div id="chartsContainer"></div>
</template>

<script>
const slf = require("../../index.js").default;
const vue = slf.app.modules.vuejs.app;
const vueData = slf.app.modules.vuejs.data;

export default {
    name: 'stats',
    order: 1,
    data() {
        return {
            selected: "euromillions",
        };
    },
    methods :  {
        displayGame: function (game) {
            this.displayGame();
        }
    },
    mounted: function() {
        vue.$on("select-game", this.displayGame);
    }
}
</script>

<style lang="less">
@import "../../../../definitions.less";

</style>
