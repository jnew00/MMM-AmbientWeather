Module.register("MMM-AmbientWeather", {

    result: {},
    defaults: {
        updateInterval: 30000,
    },

    getStyles: function() {
        return ["MMM-AmbientWeather.css", "custom.css"];
    },

    start: function() {
        this.getTickers();
        this.scheduleUpdate();
    },

    getDom: function() {
        var data = this.result;
        var poolTemp = data[0].lastData.temp2f;
        var tubTemp = data[0].lastData.temp3f;
        var poolBatt = data[0].lastData.batt2;
        var tubBatt = data[0].lastData.batt3;

        var wrapper = document.createElement("table");


        var poolRow = document.createElement("tr");
        var poolIconCell = document.createElement("td");
        var poolTempCell = document.createElement("td");
        var poolBattCell = document.createElement("td");

        var tubRow = document.createElement("tr");
        var tubIconCell = document.createElement("td");
        var tubTempCell = document.createElement("td");
        var tubBattCell = document.createElement("td");

        poolIconCell.className = 'fas fa-swimming-pool';
        tubIconCell.className = 'fas fa-hot-tub';

        if (poolBatt == 1) {
            poolBattCell.className = 'fas fa-battery-full full'
        } else {
            poolBattCell.className = 'fas fa-battery-empty empty'
        }

        if (tubBatt == 1) {
            tubBattCell.className = 'fas fa-battery-full full'
        } else {
            tubBattCell.className = 'fas fa-battery-empty empty'
        }


        if (poolTemp >= 95) {
            poolIconCell.className = poolIconCell.className + " hot";
            poolTempCell.className = poolTempCell.className + " hot";
        } else if (poolTemp <= 80) {
            poolIconCell.className = poolIconCell.className + " cold";
            poolTempCell.className = poolTempCell.className + " cold";
        } else if (poolTemp < 95 && poolTemp > 90) {
            poolIconCell.className = poolIconCell.className + " warm";
            poolTempCell.className = poolTempCell.className + " warm";
        } else {}

        if (tubTemp >= 100) {
            tubIconCell.className = tubIconCell.className + " hot";
            tubTempCell.className = tubTempCell.className + " hot";
        } else if (tubTemp <= 80) {
            tubIconCell.className = tubIconCell.className + " cold";
            tubTempCell.className = tubTempCell.className + " cold";
        } else if (tubTemp < 100 && tubTemp > 92) {
            tubIconCell.className = tubIconCell.className + " warm";
            tubTempCell.className = tubTempCell.className + " warm";
        } else {}

        poolTempCell.innerHTML = poolTemp + "&deg;";
        tubTempCell.innerHTML = tubTemp + "&deg;";

        tubRow.appendChild(tubIconCell);
        tubRow.appendChild(tubTempCell);
        tubRow.appendChild(tubBattCell);
        wrapper.appendChild(tubRow);

        poolRow.appendChild(poolIconCell);
        poolRow.appendChild(poolTempCell);
        poolRow.appendChild(poolBattCell);
        wrapper.appendChild(poolRow);

        return wrapper;
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        setInterval(function() {
            self.getTickers();
        }, nextLoad);
    },

    getTickers: function () {
        var url = 'https://api.ambientweather.net/v1/devices?apiKey=' + this.config.apiKey + '&applicationKey=' + this.config.applicationKey
        console.log("************" + url)
        this.sendSocketNotification('GET_DATA', url);
    },

    socketNotificationReceived: function(notification, payload, payload2) {
        if (notification === "DATA_RESULT") {
            this.result = payload;
            this.updateDom(self.config.fadeSpeed);
        }
    },

});