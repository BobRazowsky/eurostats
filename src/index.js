import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";
import MainLoop from "@obsidianjs/main-loop";
import ObsidianBabylonEngine from "obsidian-babylon-engine";
import Vuejs from "./modules/vuejs";
import Torus from "./modules/torus";


import "./style/index.less";

const app = obsidian("starter-app");
app.use(Vuejs);
app.use(MainLoop, {
    config: {
        debug: false,
    },
});
app.use(ObsidianBabylonEngine, {
    config: {
        canvasId: "main-canvas",
        autostart: false,
    },
});
app.use(Torus);

app.start();
