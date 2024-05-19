"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var convertTimeToPoint = function (startTime, secondes) {
    var points = 1000;
    var actualTime = Date.now();
    var tempsPasseEnSecondes = (actualTime - startTime) / 1000;
    points -= (1000 / secondes) * tempsPasseEnSecondes;
    points = Math.max(0, points);
    return points;
};
exports.default = convertTimeToPoint;
