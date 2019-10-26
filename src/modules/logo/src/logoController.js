import Chart from 'chart.js';

export default class LogoController {

    constructor() {
        let results = [];
        let tirageNbOnly = [];
        this.getJSON("assets/data/results.json", (data) => {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let tirage = data[i];
                let tirageRes = [];
                let nbOnly = [];
                for (let j = 1; j < 6; j++) {
                    tirageRes.push(tirage["boule_" + j]);
                    nbOnly.push(tirage["boule_" + j]);
                }
                tirageNbOnly.push(nbOnly.sort((a, b) => a - b));
                for (let k = 1; k < 3; k++) {
                    tirageRes.push(tirage["etoile_" + k]);
                }



                results.push(tirageRes);
            }

            console.log(results);
            this.buildInfos(results.length);
            this.buildData(results);
            this.findSimilarity(tirageNbOnly);
        });
    }

    getJSON(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function(){
            if(request.status >= 200 && request.status < 400){
                console.log(JSON.parse(request.responseText));
                var data = JSON.parse(request.responseText);
                callback(data);
            }
        };
        request.onerror = function(error) {
            console.log("Error");
        };
        request.send();
    }

    buildData(results) {
        let nbData = {};
        let starData = {};
        for(let i = 0; i < results.length; i++) {
            /*var found = results[i].find(function(element) {
                return element == 44;
            });
            if(!found) continue;
            var found2 = results[i].find(function(element) {
                return element == 39;
            });
            if(!found2) continue;
            var found3 = results[i].find(function(element) {
                return element == 25;
            });
            if(!found3) continue;*/
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

        console.log(nbData, starData);
        this.findSimilarity(nbData);
        this.buildChart(nbData, starData);
    }

    findSimilarity(data) {
        console.log("DATA", data);
        for (let i = 0; i < data.length; i++) {
            let dat = data[i].join("");
            //console.log(dat);
            for(let j = 0; j < data.length; j++) {
                if(j == i) continue;
                if(dat == data[j].join("")) {
                    console.log("SIMILAR", data[i], i, data[j], j);
                }
            }
        }
    }

    buildChart(nbData, starData) {
        var nbCtx = document.getElementById('nbChart');
        var nbChart = new Chart(nbCtx, {
            type: "bar",
            data: {
                labels: Object.keys(nbData),
                datasets: [{
                    label: "Numéros",
                    data: Object.values(nbData),
                    backgroundColor: this.getColors(Object.values(nbData))
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

        var starCtx = document.getElementById('starChart');
        var starChart = new Chart(starCtx, {
            type: "bar",
            data: {
                labels: Object.keys(starData),
                datasets: [{
                    label: "Etoiles",
                    data: Object.values(starData),
                    backgroundColor: this.getColors(Object.values(starData))
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

    getColors(data) {
        let colors = [];
        console.log(data);
        let max = Math.max(...data);
        console.log(max);

        for (let i = 0; i < data.length; i++) {
            colors.push('rgba(0, ' + ((data[i] * 255) / max) + ', 0, 1)');
        }

        return colors;

    }

}
