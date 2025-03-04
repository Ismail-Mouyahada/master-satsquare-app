"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cooldown_1 = require("../utils/cooldown");
var validator_1 = require("../validator");
var convertTimeToPoint_1 = require("../utils/convertTimeToPoint");
var Player = {
    checkRoom: function (game, _io, socket, roomId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, validator_1.inviteCodeValidator.validate(roomId)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    socket.emit("game:errorMessage", error_1.message);
                    return [2 /*return*/];
                case 3:
                    if (!game.room || roomId !== game.room) {
                        socket.emit("game:errorMessage", "Salle introuvable");
                        return [2 /*return*/];
                    }
                    socket.emit("game:successRoom", roomId);
                    return [2 /*return*/];
            }
        });
    }); },
    join: function (game, io, socket, player) { return __awaiter(void 0, void 0, void 0, function () {
        var error_2, playerData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, validator_1.usernameValidator.validate(player.username)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    socket.emit("game:errorMessage", error_2.message);
                    return [2 /*return*/];
                case 3:
                    if (!game.room || player.room !== game.room) {
                        socket.emit("game:errorMessage", "Salle introuvable");
                        return [2 /*return*/];
                    }
                    if (game.players.find(function (p) { return p.username === player.username; })) {
                        socket.emit("game:errorMessage", "Nom d'utilisateur déjà pris");
                        return [2 /*return*/];
                    }
                    if (game.started) {
                        socket.emit("game:errorMessage", "Jeu déjà commencé");
                        return [2 /*return*/];
                    }
                    console.log("Nouveau Joueur", player);
                    socket.join(player.room);
                    playerData = {
                        username: player.username,
                        room: player.room,
                        id: socket.id,
                        points: 0,
                    };
                    game.players.push(playerData);
                    // Emit to manager that a new player has joined
                    socket.to(player.room).emit("manager:newPlayer", __assign({}, playerData));
                    // Emit the updated waiting list to all players
                    io.to(player.room).emit("game:updateWaitingList", game.players);
                    socket.emit("game:successJoin");
                    return [2 /*return*/];
            }
        });
    }); },
    selectedAnswer: function (game, _io, socket, answerKey) {
        var player = game.players.find(function (player) { return player.id === socket.id; });
        var question = game.questions[game.currentQuestion];
        if (!player) {
            return;
        }
        if (game.playersAnswer.find(function (p) { return p.id === socket.id; })) {
            return;
        }
        game.playersAnswer.push({
            id: socket.id,
            answer: answerKey,
            points: (0, convertTimeToPoint_1.default)(game.roundStartTime, question.time),
        });
        socket.emit("game:status", {
            name: "WAIT",
            data: { text: "En attente des réponses des autres joueurs" },
        });
        socket.to(game.room).emit("game:playerAnswer", game.playersAnswer.length);
        if (game.playersAnswer.length === game.players.length) {
            (0, cooldown_1.abortCooldown)();
        }
    },
};
exports.default = Player;
