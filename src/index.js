import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";

import BabylonEngine from "./modules/babylon-engine";
import Torus from "./modules/torus";
import MainLoop from "./modules/main-loop";

import "./style/index.less";

const app = obsidian("starter-app");
app.use(MainLoop);
app.use(BabylonEngine);
app.use(Torus);

app.start();
