import { Server, Socket } from "socket.io";
import { GAME_STATE_INIT } from "./quiz.config";
import Manager from "./roles/manager";
import Player from "./roles/player";
import { abortCooldown } from "./utils/cooldown";
import deepClone from "./utils/deepClone";

interface GameState {
  manager: string | null;
  room: string;
  started: boolean;
  players: PlayerData[];
}

interface PlayerData {
  id: string;
  username: string;
  room: string;
  points: number;
}

const gameState: any = deepClone(GAME_STATE_INIT);

const io: any = new Server({
  cors: {
    origin: "*",
  },
  path: "/ws/",
});

io.listen(5157);

io.on("connection", (socket: any) => {
  console.log(`Un utilisateur connecté ${socket.id}`);

  socket.on("player:checkRoom", (roomId: string) =>
    Player.checkRoom(gameState, io, socket, roomId)
  );

  socket.on("player:join", (player: { username: string; room: string }) =>
    Player.join(gameState, io, socket, player)
  );

  socket.on("manager:createRoom", (password: string) =>
    Manager.createRoom(gameState, io, socket, password)
  );

  socket.on("manager:kickPlayer", (playerId: string) =>
    Manager.kickPlayer(gameState, io, socket, playerId)
  );

  socket.on("manager:startGame", () =>
    Manager.startGame(gameState, io, socket)
  );

  socket.on("player:selectedAnswer", (answerKey: any) =>
    Player.selectedAnswer(gameState, io, socket, answerKey)
  );

  socket.on("manager:abortQuiz", () =>
    Manager.abortQuiz(gameState, io, socket)
  );

  socket.on("manager:nextQuestion", () =>
    Manager.nextQuestion(gameState, io, socket)
  );

  socket.on("manager:showLeaderboard", () =>
    Manager.showLoaderboard(gameState, io, socket)
  );

  socket.on("disconnect", () => {
    console.log(`Utilisateur déconnecté ${socket.id}`);
    if (gameState.manager === socket.id) {
      console.log("Réinitialisation du jeu");
      io.to(gameState.room).emit("game:reset");
      gameState.started = false;
      deepClone(GAME_STATE_INIT);

      abortCooldown();
      return;
    }

    const player = gameState.players.find((p: { id: any; }) => p.id === socket.id);

    if (player) {
      gameState.players = gameState.players.filter((p: { id: any; }) => p.id !== socket.id);
      io.to(gameState.manager).emit("manager:removePlayer", player.id);
    }
  });
});
