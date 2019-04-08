import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";

import BabylonEngine from "./modules/babylon-engine";
import Torus from "./modules/torus";
import MainLoop from "./modules/main-loop";

import "./style/index.less";

const app = obsidian("starter-app");
app.use(MainLoop, {
    config: {
        debug: true,
        activeFps: -1,
        idleFps: 0,
    },
});
app.use(BabylonEngine);
app.use(Torus);

app.start();
