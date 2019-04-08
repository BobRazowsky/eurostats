import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";


import BabylonEngine from "obsidian-babylon-engine";
import Vuejs from "./modules/vuejs";
import Torus from "./modules/torus";
import MainLoop from "./modules/main-loop";


import "./style/index.less";

const app = obsidian("starter-app");
app.use(Vuejs);
app.use(MainLoop, {
    config: {
        debug: true,
    },
});
app.use(BabylonEngine, {
    canvasId: "main-canvas",
});
app.use(Torus);

app.start();
