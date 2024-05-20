"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts the elapsed time since the start of the round to points.
 *
 * @param startTime - The start time of the round in milliseconds.
 * @param secondes - The total time allowed for the round in seconds.
 * @returns The calculated points based on the elapsed time.
 */
var convertTimeToPoint = function (startTime, secondes) {
    var points = 1000;
    // Get the current time in milliseconds
    var actualTime = Date.now();
    // Calculate the elapsed time in seconds
    var tempsPasseEnSecondes = (actualTime - startTime) / 1000;
    // Calculate points based on the elapsed time
    points -= (1000 / secondes) * tempsPasseEnSecondes;
    // Ensure points do not go below 0
    points = Math.max(0, points);
    return points;
};
exports.default = convertTimeToPoint;
