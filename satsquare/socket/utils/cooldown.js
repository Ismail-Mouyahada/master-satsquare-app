"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.cooldown = exports.abortCooldown = void 0;
var cooldownTimeout;
var cooldownResolve;
var abortCooldown = function () {
    clearInterval(cooldownTimeout);
    cooldownResolve();
};
exports.abortCooldown = abortCooldown;
var cooldown = function (ms, io, room) {
    var count = ms - 1;
    return new Promise(function (resolve) {
        cooldownResolve = resolve;
        cooldownTimeout = setInterval(function () {
            if (!count) {
                clearInterval(cooldownTimeout);
                resolve();
            }
            io.to(room).emit("game:cooldown", count);
            count -= 1;
        }, 1000);
    });
};
exports.cooldown = cooldown;
var sleep = function (sec) { return new Promise(function (r) { return setTimeout(r, sec * 1000); }); };
exports.sleep = sleep;
