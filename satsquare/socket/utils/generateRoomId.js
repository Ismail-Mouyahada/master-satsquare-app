"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
