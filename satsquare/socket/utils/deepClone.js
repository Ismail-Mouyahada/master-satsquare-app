"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Deeply clones the given object or array.
 *
 * @param obj - The object or array to clone.
 * @returns A deep clone of the input object or array.
 */
var deepClone = function (obj) {
    // Handle null or non-object types (including functions)
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    // Handle Date objects
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    // Handle RegExp objects
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(function (item) { return deepClone(item); });
    }
    // Handle objects
    var clonedObj = {};
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }
    return clonedObj;
};
exports.default = deepClone;
