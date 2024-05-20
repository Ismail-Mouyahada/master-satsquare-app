"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generates a random numeric room ID of the specified length.
 *
 * @param length - The length of the room ID to generate. Default is 6.
 * @returns A string representing the generated room ID.
 */
var generateRoomId = function (length) {
    if (length === void 0) { length = 6; }
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }
    return result;
};
exports.default = generateRoomId;
