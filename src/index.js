import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";
import httpRequest from "@obsidianjs/http-request";

import ObsidianBabylonEngine from "obsidian-babylon-engine";
import Vuejs from "./modules/vuejs";
import Torus from "./modules/torus";
import MainLoop from "./modules/main-loop";
import MaterialManager from "./modules/material-manager";

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
app.use(MaterialManager, {
    config: {
        texturePath: "/assets/modules/material-library/",
    },
});
app.use(Torus);

app.start();
