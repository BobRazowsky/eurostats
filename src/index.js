import "@babel/polyfill";
import obsidian from "@obsidianjs/obsidian";

import stats from "./modules/stats";
import ui from "./modules/ui";
import vuejs from "./modules/vuejs";

import "./style/index.less";

const app = obsidian("starter-app");

app.use(ui);
app.use(stats);
app.use(vuejs);

app.start();
