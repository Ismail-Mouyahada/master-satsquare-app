"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.cooldown = exports.abortCooldown = void 0;
var cooldownTimeout;
var cooldownResolve;
/**
 * Aborts the current cooldown by resolving the cooldown promise and clearing the interval.
 */
var abortCooldown = function () {
    if (cooldownResolve) {
        cooldownResolve();
        cooldownResolve = undefined; // Reset cooldownResolve after resolving
    }
    if (cooldownTimeout) {
        clearInterval(cooldownTimeout);
        cooldownTimeout = undefined; // Reset cooldownTimeout after clearing
    }
};
exports.abortCooldown = abortCooldown;
/**
 * Initiates a cooldown period, emitting the remaining time to the specified room every second.
 *
 * @param sec - The number of seconds for the cooldown.
 * @param io - The socket.io server instance.
 * @param room - The room to which the cooldown messages will be emitted.
 * @returns A promise that resolves when the cooldown completes.
 */
var cooldown = function (sec, io, room) {
    var count = sec - 1;
    return new Promise(function (resolve) {
        cooldownResolve = resolve;
        cooldownTimeout = setInterval(function () {
            if (count <= 0) {
                if (cooldownResolve) {
                    cooldownResolve();
                    cooldownResolve = undefined; // Reset cooldownResolve after resolving
                }
                clearInterval(cooldownTimeout);
                cooldownTimeout = undefined; // Reset cooldownTimeout after clearing
            }
            else {
                io.to(room).emit("game:cooldown", count);
                count -= 1;
            }
        }, 1000);
    });
};
exports.cooldown = cooldown;
/**
 * Creates a promise that resolves after the specified number of seconds.
 *
 * @param sec - The number of seconds to sleep.
 * @returns A promise that resolves after the specified number of seconds.
 */
var sleep = function (sec) { return new Promise(function (resolve) { return setTimeout(resolve, sec * 1000); }); };
exports.sleep = sleep;
