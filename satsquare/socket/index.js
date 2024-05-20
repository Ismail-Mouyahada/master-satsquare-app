"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var quiz_config_1 = require("./quiz.config");
var manager_1 = require("./roles/manager");
var player_1 = require("./roles/player");
var cooldown_1 = require("./utils/cooldown");
var deepClone_1 = require("./utils/deepClone");
var gameState = (0, deepClone_1.default)(quiz_config_1.GAME_STATE_INIT);
var io = new socket_io_1.Server({
    cors: {
        origin: "*",
    },
    path: "/ws/",
});
 
io.listen(5157);
io.on("connection", function (socket) {
    console.log("Un utilisateur connect\u00E9 ".concat(socket.id));
    socket.on("player:checkRoom", function (roomId) {
        return player_1.default.checkRoom(gameState, io, socket, roomId);
    });
    socket.on("player:join", function (player) {
        return player_1.default.join(gameState, io, socket, player);
    });
    socket.on("manager:createRoom", function (password) {
        return manager_1.default.createRoom(gameState, io, socket, password);
    });
    socket.on("manager:kickPlayer", function (playerId) {
        return manager_1.default.kickPlayer(gameState, io, socket, playerId);
    });
    socket.on("manager:startGame", function () {
        return manager_1.default.startGame(gameState, io, socket);
    });
    socket.on("player:selectedAnswer", function (answerKey) {
        return player_1.default.selectedAnswer(gameState, io, socket, answerKey);
    });
    socket.on("manager:abortQuiz", function () {
        return manager_1.default.abortQuiz(gameState, io, socket);
    });
    socket.on("manager:nextQuestion", function () {
        return manager_1.default.nextQuestion(gameState, io, socket);
    });
    socket.on("manager:showLeaderboard", function () {
        return manager_1.default.showLeaderboard(gameState, io, socket);
    });
    socket.on("disconnect", function () {
        console.log("Utilisateur d\u00E9connect\u00E9 ".concat(socket.id));
        if (gameState.manager === socket.id) {
            console.log("Réinitialisation du jeu");
            io.to(gameState.room).emit("game:reset");
            gameState.started = false;
            (0, deepClone_1.default)(quiz_config_1.GAME_STATE_INIT);
            (0, cooldown_1.abortCooldown)();
            return;
        }
        var player = gameState.players.find(function (p) { return p.id === socket.id; });
        if (player) {
            gameState.players = gameState.players.filter(function (p) { return p.id !== socket.id; });
            io.to(gameState.manager).emit("manager:removePlayer", player.id);
        }
    });
});
