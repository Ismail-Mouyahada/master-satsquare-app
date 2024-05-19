"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deepClone = function (obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(function (item) { return deepClone(item); });
    }
    var clonedObj = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
};
exports.default = deepClone;
