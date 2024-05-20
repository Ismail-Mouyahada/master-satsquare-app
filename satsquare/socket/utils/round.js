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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startRound = void 0;
var cooldown_js_1 = require("./cooldown.js");
var startRound = function (game, io, socket) { return __awaiter(void 0, void 0, void 0, function () {
    var question, totalType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                question = game.questions[game.currentQuestion];
                if (!game.started)
                    return [2 /*return*/];
                io.to(game.room).emit("game:updateQuestion", {
                    current: game.currentQuestion + 1,
                    total: game.questions.length,
                });
                io.to(game.room).emit("game:status", {
                    name: "SHOW_PREPARED",
                    data: {
                        totalAnswers: question.answers.length,
                        questionNumber: game.currentQuestion + 1,
                    },
                });
                return [4 /*yield*/, (0, cooldown_js_1.sleep)(2)];
            case 1:
                _a.sent();
                if (!game.started)
                    return [2 /*return*/];
                io.to(game.room).emit("game:status", {
                    name: "SHOW_QUESTION",
                    data: {
                        question: question.question,
                        image: question.image,
                        cooldown: question.cooldown,
                    },
                });
                return [4 /*yield*/, (0, cooldown_js_1.sleep)(question.cooldown)];
            case 2:
                _a.sent();
                if (!game.started)
                    return [2 /*return*/];
                game.roundStartTime = Date.now();
                io.to(game.room).emit("game:status", {
                    name: "SELECT_ANSWER",
                    data: {
                        question: question.question,
                        answers: question.answers,
                        image: question.image,
                        time: question.time,
                        totalPlayer: game.players.length,
                    },
                });
                return [4 /*yield*/, (0, cooldown_js_1.cooldown)(question.time, io, game.room)];
            case 3:
                _a.sent();
                if (!game.started)
                    return [2 /*return*/];
                game.players.forEach(function (player) {
                    var playerAnswer = game.playersAnswer.find(function (p) { return p.id === player.id; });
                    var isCorrect = playerAnswer ? playerAnswer.answer === question.solution : false;
                    var points = isCorrect ? Math.round(playerAnswer.points) : 0;
                    player.points += points;
                    var sortedPlayers = __spreadArray([], game.players, true).sort(function (a, b) { return b.points - a.points; });
                    var rank = sortedPlayers.findIndex(function (p) { return p.id === player.id; }) + 1;
                    var aheadPlayer = sortedPlayers[rank - 2];
                    io.to(player.id).emit("game:status", {
                        name: "SHOW_RESULT",
                        data: {
                            correct: isCorrect,
                            message: isCorrect ? "Bien joué !" : "Dommage",
                            points: points,
                            myPoints: player.points,
                            rank: rank,
                            aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
                        },
                    });
                });
                totalType = {};
                game.playersAnswer.forEach(function (_a) {
                    var answer = _a.answer;
                    totalType[answer] = (totalType[answer] || 0) + 1;
                });
                // Manager
                io.to(game.manager).emit("game:status", {
                    name: "SHOW_RESPONSES",
                    data: {
                        question: question.question,
                        responses: totalType,
                        correct: question.solution,
                        answers: question.answers,
                        image: question.image,
                    },
                });
                game.playersAnswer = [];
                return [2 /*return*/];
        }
    });
}); };
exports.startRound = startRound;
