"use strict";
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
var quiz_config_js_1 = require("../quiz.config.js");
var generateRoomId_js_1 = require("../utils/generateRoomId.js");
var cooldown_js_1 = require("../utils/cooldown.js");
var deepClone_js_1 = require("../utils/deepClone.js");
var round_js_1 = require("../utils/round.js");
var Manager = {
    createRoom: function (game, io, socket, password) {
        if (game.password !== password) {
            io.to(socket.id).emit("game:errorMessage", "Mauvais mot de passe");
            return;
        }
        if (game.manager || game.room) {
            io.to(socket.id).emit("game:errorMessage", "Déjà gestionnaire");
            return;
        }
        var roomInvite = (0, generateRoomId_js_1.default)();
        game.room = roomInvite;
        game.manager = socket.id;
        socket.join(roomInvite);
        io.to(socket.id).emit("manager:inviteCode", roomInvite);
        console.log("Nouvelle salle créée : " + roomInvite);
    },
    kickPlayer: function (game, io, socket, playerId) {
        if (game.manager !== socket.id) {
            return;
        }
        var player = game.players.find(function (p) { return p.id === playerId; });
        if (player) {
            game.players = game.players.filter(function (p) { return p.id !== playerId; });
            io.in(playerId).socketsLeave(game.room);
            io.to(player.id).emit("game:kick");
            io.to(game.manager).emit("manager:playerKicked", player.id);
        }
    },
    startGame: function (game, io, socket) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (game.started || !game.room) {
                        return [2 /*return*/];
                    }
                    game.started = true;
                    io.to(game.room).emit("game:status", {
                        name: "SHOW_START",
                        data: {
                            time: 3,
                            subject: "Le jeu commence !",
                        },
                    });
                    return [4 /*yield*/, (0, cooldown_js_1.sleep)(3)];
                case 1:
                    _a.sent();
                    io.to(game.room).emit("game:startCooldown");
                    return [4 /*yield*/, (0, cooldown_js_1.cooldown)(3, io, game.room)];
                case 2:
                    _a.sent();
                    (0, round_js_1.startRound)(game, io, socket);
                    return [2 /*return*/];
            }
        });
    }); },
    nextQuestion: function (game, io, socket) {
        if (!game.started || socket.id !== game.manager || !game.questions[game.currentQuestion + 1]) {
            return;
        }
        game.currentQuestion++;
        (0, round_js_1.startRound)(game, io, socket);
    },
    abortQuiz: function (game, io, socket) {
        if (!game.started || socket.id !== game.manager) {
            return;
        }
        (0, cooldown_js_1.abortCooldown)();
    },
    showLeaderboard: function (game, io, socket) {
        if (!game.questions[game.currentQuestion + 1]) {
            socket.emit("game:status", {
                name: "FINISH",
                data: {
                    subject: game.subject,
                    top: game.players
                        .slice(0, 3)
                        .sort(function (a, b) { return b.points - a.points; }),
                },
            });
            Object.assign(game, (0, deepClone_js_1.default)(quiz_config_js_1.GAME_STATE_INIT));
            return;
        }
        socket.emit("game:status", {
            name: "SHOW_LEADERBOARD",
            data: {
                leaderboard: game.players
                    .sort(function (a, b) { return b.points - a.points; })
                    .slice(0, 5),
            },
        });
    },
};
exports.default = Manager;
