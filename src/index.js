import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";

import BabylonEngine from "./modules/babylon-engine";
import Torus from "./modules/torus";

import "./style/index.less";

const app = obsidian("starter-app");
app.use(BabylonEngine);
app.use(Torus);

app.start();
