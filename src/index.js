import "@babel/polyfill";

import httpRequest from "@obsidianjs/http-request";
import obsidian from "@obsidianjs/obsidian";
import MainLoop from "@obsidianjs/main-loop";
import ObsidianBabylonEngine from "obsidian-babylon-engine";
import ObsidianMaterialManager from "obsidian-material-manager";
import Vuejs from "./modules/vuejs";
import Torus from "./modules/torus";

import "./style/index.less";

const app = obsidian("starter-app");
app.use(httpRequest);
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
app.use(ObsidianMaterialManager, {
    config: {
        texturePath: "/assets/textures/",
    },
});
app.use(Torus);

app.start();
