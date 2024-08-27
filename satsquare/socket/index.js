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
var socket_io_1 = require("socket.io");
var manager_1 = require("./roles/manager");
var player_1 = require("./roles/player");
var quiz_config_1 = require("./quiz.config");
var client_1 = require("@prisma/client");
var gameState;
var prisma = new client_1.PrismaClient();
var io = new socket_io_1.Server({
    cors: {
        origin: '*',
    },
    path: '/ws/',
});
io.listen(5157);
io.on('connection', function (socket) {
    console.log("User connected ".concat(socket.id));
    socket.on('game:selectQuiz', function (quizId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, quiz_config_1.getGameState)(quizId)];
                case 1:
                    gameState = _a.sent();
                    socket.emit('game:quizSelected', { success: true, gameState: gameState });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    socket.emit('game:errorMessage', error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    io.on('connection', function (socket) {
        console.log("User connected: ".concat(socket.id));
        socket.on('requestQuizzes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quizzes, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.quiz.findMany({
                                select: {
                                    id: true,
                                    subject: true,
                                },
                            })];
                    case 1:
                        quizzes = _a.sent();
                        socket.emit('quizzesList', quizzes);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error fetching quizzes:', error_2);
                        socket.emit('game:errorMessage', 'Failed to load quizzes.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('requestAssociations', function () { return __awaiter(void 0, void 0, void 0, function () {
            var quizzes, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, prisma.association.findMany({
                                select: {
                                    id: true,
                                    valide: true,
                                    logoUrl: true,
                                    adresseEclairage: true,
                                },
                            })];
                    case 1:
                        quizzes = _a.sent();
                        socket.emit('associationsList', quizzes);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error fetching Associations:', error_3);
                        socket.emit('game:errorMessage', 'Failed to load Associations.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        // Other socket event handlers...
    });
    socket.on('player:checkRoom', function (roomId) {
        return player_1.default.checkRoom(gameState, io, socket, roomId);
    });
    socket.on('player:join', function (player) {
        return player_1.default.join(gameState, io, socket, player);
    });
    socket.on('manager:createRoom', function (password) {
        return manager_1.default.createRoom(gameState, io, socket, password);
    });
    socket.on('manager:kickPlayer', function (playerId) {
        return manager_1.default.kickPlayer(gameState, io, socket, playerId);
    });
    socket.on('manager:startGame', function () {
        return manager_1.default.startGame(gameState, io, socket);
    });
    socket.on('player:selectedAnswer', function (answerKey) {
        return player_1.default.selectedAnswer(gameState, io, socket, answerKey);
    });
    socket.on('manager:abortQuiz', function () {
        return manager_1.default.abortQuiz(gameState, io, socket);
    });
    socket.on('manager:nextQuestion', function () {
        return manager_1.default.nextQuestion(gameState, io, socket);
    });
    socket.on('manager:showLeaderboard', function () {
        return manager_1.default.showLeaderboard(gameState, io, socket);
    });
    // socket.on('disconnect', () => {
    //   console.log(`User disconnected ${socket.id}`);
    //   if (gameState.manager === socket.id) {
    //     console.log('Resetting game');
    //     io.to(gameState.room).emit('game:reset');
    //     gameState = null;
    //     abortCooldown();
    //     return;
    //   }
    //   const playerIndex = gameState.players.findIndex((p: { id: any }) => p.id === socket.id);
    //   if (playerIndex !== -1) {
    //     const player = gameState.players.splice(playerIndex, 1)[0];
    //     io.to(gameState.manager).emit('manager:removePlayer', player.id);
    //   }
    // });
});
