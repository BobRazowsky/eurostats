import self from "..";
import Chart from 'chart.js';

const vueData = self.app.modules.vuejs.data;

export default class StatsController {

    constructor() {
        this.displayGame(vueData.games[vueData.currentGame]);
    }

    displayGame() {
        let game = vueData.games[vueData.currentGame];

        let results = [];
        let tirageNbOnly = [];

        this.nbResults = null;
        this.starResults = null;

        this.lastTirage = [];
        this.lastStars = [];
        this.allData = null;

        if(game == "euromillions") {
            this.getJSON("assets/data/euromillions.json", (data) => {
                this.allData = data;
                for (let i = 0; i < data.length; i++) {
                    let stars = [];
                    let tirage = data[i];
                    let tirageRes = [];
                    let nbOnly = [];
                    for (let j = 1; j < 6; j++) {
                        tirageRes.push(tirage["boule_" + j]);
                        nbOnly.push(tirage["boule_" + j]);
                    }
                    if(i === 0) {
                        this.lastTirage = nbOnly;
                    }
                    tirageNbOnly.push(nbOnly.sort((a, b) => a - b));
                    for (let k = 1; k < 3; k++) {
                        tirageRes.push(tirage["etoile_" + k]);
                        stars.push(tirage["etoile_" + k]);
                    }
                    if(i === 0) {
                        this.lastStars = stars;
                    }

                    results.push(tirageRes);
                }
                this.nbDraws = results.length;
                //this.results = results;
                //this.buildInfos(results.length);
                this.buildData(results, game);
                //this.buildLastDraw(results[0], this.allData[0]);
            });
        } else if(game == "loto") {
            this.getJSON("assets/data/loto.json", (data) => {
                this.clearCharts();
                this.allData = data;
                for (let i = 0; i < data.length; i++) {
                    let tirage = data[i];
                    if(tirage["boule_6"]) continue;
                    let tirageRes = [];
                    let nbOnly = [];
                    let chanceNumber = null;
                    for (let j = 1; j < 6; j++) {

                        tirageRes.push(tirage["boule_" + j]);
                        nbOnly.push(tirage["boule_" + j]);
                    }
                    if(i === 0) {
                        this.lastTirage = nbOnly;
                    }
                    tirageNbOnly.push(nbOnly.sort((a, b) => a - b));

                    chanceNumber = tirage.numero_chance;
                    tirageRes.push(chanceNumber);
                    if(i === 0) {
                        this.lastChanceNumber = chanceNumber;
                    }

                    results.push(tirageRes);
                }
                this.nbDraws = results.length;
                this.buildData(results, game);
                console.log(data);
            });
        }
    }

    getJSON(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function(){
            if(request.status >= 200 && request.status < 400){
                var data = JSON.parse(request.responseText);
                callback(data);
            }
        };
        request.onerror = function(error) {
            console.log("Error");
        };
        request.send();
    }

    buildData(results, game) {
        if(game == "euromillions") {
            let nbData = {};
            let starData = {};
            for(let i = 0; i < results.length; i++) {
                for(let j = 0; j < 5; j++) {
                    if (results[i][j] in nbData) {
                        nbData[results[i][j]] ++;
                    } else {
                        nbData[results[i][j]] = 1;
                    }
                }

                for(let j = 5; j < 7; j++) {
                    if (results[i][j] in starData) {
                        starData[results[i][j]] ++;
                    } else {
                        starData[results[i][j]] = 1;
                    }
                }
            }

            this.nbResults = nbData;
            this.starResults = starData;
            this.createEuromillionsCharts([nbData, starData]);
        } else if(game == "loto") {
            let nbData = {};
            let chanceData = {};
            for(let i = 0; i < results.length; i++) {
                for(let j = 0; j < 5; j++) {
                    if (results[i][j] in nbData) {
                        nbData[results[i][j]] ++;
                    } else {
                        nbData[results[i][j]] = 1;
                    }
                }
                for(let j = 5; j < 6; j++) {
                    if (results[i][j] in chanceData) {
                        chanceData[results[i][j]] ++;
                    } else {
                        chanceData[results[i][j]] = 1;
                    }
                }
            }

            console.log(nbData);

            this.nbResults = nbData;
            this.createLotoCharts([nbData, chanceData]);
        }


    }

    findSimilarity(data) {
        for (let i = 0; i < data.length; i++) {
            let dat = data[i].join("");
            for(let j = 0; j < data.length; j++) {
                if(j == i) continue;
                if(dat == data[j].join("")) {
                    console.log("SIMILAR", data[i], this.allData[i].date_de_tirage, data[j], this.allData[j].date_de_tirage);
                }
            }
        }
    }

    clearCharts() {
        let container = document.getElementById("chartsContainer");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    createEuromillionsCharts(results) {

        let nbData = results[0];
        let starData = results[1];

        this.clearCharts();
        let container = document.getElementById("chartsContainer");

        let nbChartDom = document.createElement("canvas");
        nbChartDom.id = "nbChart";
        nbChartDom.width = 1000;
        nbChartDom.height = 300;
        container.appendChild(nbChartDom);

        //var nbCtx = document.getElementById('nbChart');
        var nbChart = new Chart(nbChartDom, {
            type: "bar",
            data: {
                labels: Object.keys(nbData),
                datasets: [{
                    label: "Numéros - présence pour " + this.nbDraws + " tirages",
                    data: Object.values(nbData),
                    backgroundColor: this.getColors(nbData, 'numbers'),
                    borderColor: this.getBorderColor(nbData, 'numbers'),
                    borderWidth: this.getBorderWidth(nbData, 'numbers')
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            //fontColor: this.getFontColor(nbData, 'numbers')
                        }
                    }]
                }
            }
        })

        let starChartDom = document.createElement("canvas");
        starChartDom.id = "starChart";
        starChartDom.width = 300;
        starChartDom.height = 300;
        container.appendChild(starChartDom);

        //var starCtx = document.getElementById('starChart');
        var starChart = new Chart(starChartDom, {
            type: "bar",
            data: {
                labels: Object.keys(starData),
                datasets: [{
                    label: "Etoiles - présence pour " + this.nbDraws + " tirages",
                    data: Object.values(starData),
                    backgroundColor: this.getColors(starData, "stars"),
                    borderColor: this.getBorderColor(starData, 'stars'),
                    borderWidth: this.getBorderWidth(starData, 'stars')
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    }

    createLotoCharts(results) {

        let nbData = results[0];
        let chanceData = results[1];

        this.clearCharts();
        let container = document.getElementById("chartsContainer");

        let nbChartDom = document.createElement("canvas");
        nbChartDom.id = "nbChart";
        nbChartDom.width = 1000;
        nbChartDom.height = 300;
        container.appendChild(nbChartDom);

        //var nbCtx = document.getElementById('nbChart');
        var nbChart = new Chart(nbChartDom, {
            type: "bar",
            data: {
                labels: Object.keys(nbData),
                datasets: [{
                    label: "Numéros - présence pour " + this.nbDraws + " tirages",
                    data: Object.values(nbData),
                    backgroundColor: this.getColors(nbData, 'numbers'),
                    borderColor: this.getBorderColor(nbData, 'numbers'),
                    borderWidth: this.getBorderWidth(nbData, 'numbers')
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            //fontColor: this.getFontColor(nbData, 'numbers')
                        }
                    }]
                }
            }
        })

        let chanceChartDom = document.createElement("canvas");
        chanceChartDom.id = "chanceChart";
        chanceChartDom.width = 300;
        chanceChartDom.height = 300;
        container.appendChild(chanceChartDom);

        //var starCtx = document.getElementById('starChart');
        var starChart = new Chart(chanceChartDom, {
            type: "bar",
            data: {
                labels: Object.keys(chanceData),
                datasets: [{
                    label: "Numéro chance - présence pour " + this.nbDraws + " tirages",
                    data: Object.values(chanceData),
                    backgroundColor: this.getColors(chanceData, "chance"),
                    borderColor: this.getBorderColor(chanceData, 'chance'),
                    borderWidth: this.getBorderWidth(chanceData, 'chance')
                }]
            },
            options: {
                responsive: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        })
    }

    buildInfos(length) {
        let infoContainer = document.getElementById("tirages");
        infoContainer.innerHTML = length;
    }

    buildLastDraw(lastDraw, data) {

        console.log("DATAAAA", data)

        let label = document.getElementById("lastDrawLabel");
        label.innerHTML = label.innerHTML + " - " + data.jour_de_tirage + " " + data.date_de_tirage;

        let container = document.getElementById("draw");
        console.log(lastDraw);

        for(let i = 0; i < 5; i++) {
            let nb = document.createElement("div");
            nb.innerHTML = lastDraw[i];
            nb.classList.add("number");
            container.appendChild(nb);
        }

        for(let j = 5; j < 7; j++) {
            let star = document.createElement("div");
            star.innerHTML = lastDraw[j];
            star.classList.add("star");
            container.appendChild(star);
        }
    }

    getColors(data, type) {
        let colors = [];

        for(var nb in data) {
            if(type == "numbers") {
                let color = 'rgba(86, 105, 154, 1)';
                // for (let j = 0; j < this.lastTirage.length; j++) {
                //     if(nb == this.lastTirage[j]) {
                //         console.log(this.lastTirage);
                //         color = 'rgba(0, 50, 155, 1)';
                //     }
                // }
                colors.push(color);
            } else if(type == "stars" || type == "chance") {
                let color = 'rgba(253, 209, 116, 1)';
                // for (let j = 0; j < this.lastStars.length; j++) {
                //     if(nb == this.lastStars[j]) {
                //         console.log(this.lastStars);
                //         color = 'rgba(246, 178, 32, 1)';
                //     }
                // }
                colors.push(color);
            }
        }

        return colors;
    }

    getBorderColor(data, type) {
        let borderColors = [];

        for(var nb in data) {
            if(type == "numbers") {
                let color = undefined;
                for (let j = 0; j < this.lastTirage.length; j++) {
                    if(nb == this.lastTirage[j]) {
                        color = 'rgba(246, 141, 32, 1)';
                    }
                }
                borderColors.push(color);
            } else if(type == "stars") {
                let color = undefined;
                for (let j = 0; j < this.lastStars.length; j++) {
                    if(nb == this.lastStars[j]) {
                        color = 'rgba(86, 105, 154, 1)';
                    }
                }
                borderColors.push(color);
            } else if(type == "chance") {
                let color = undefined;
                if(nb == this.lastChanceNumber) {
                    color = 'rgba(86, 105, 154, 1)';
                }

                borderColors.push(color);
            }
        }

        return borderColors;
    }

    getBorderWidth(data, type) {
        let borderWidths = [];

        for(var nb in data) {
            if(type == "numbers") {
                let width = undefined;
                for (let j = 0; j < this.lastTirage.length; j++) {
                    if(nb == this.lastTirage[j]) {
                        width = 2;
                    }
                }
                borderWidths.push(width);
            } else if(type == "stars") {
                let width = undefined;
                for (let j = 0; j < this.lastStars.length; j++) {
                    if(nb == this.lastStars[j]) {
                        width = 2;
                    }
                }
                borderWidths.push(width);
            } else if(type == "chance") {
                let width = undefined;
                if(nb == this.lastChanceNumber) {
                    width = 2;
                }

                borderWidths.push(width);
            }
        }

        return borderWidths;
    }

}
