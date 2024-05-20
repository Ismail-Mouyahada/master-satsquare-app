import { Server, Socket } from "socket.io";
import { abortCooldown } from "../utils/cooldown";
import { inviteCodeValidator, usernameValidator } from "../validator";
import convertTimeToPoint from "../utils/convertTimeToPoint";

interface PlayerData {
  username: string;
  room: string;
  id: string;
  points: number;
}

interface Game {
  room?: string;
  started?: boolean;
  players: PlayerData[];
  questions: any[];
  currentQuestion: number;
  playersAnswer: { id: string; answer: any; points: number }[];
  roundStartTime: number;
  [key: string]: any;
}

const Player = {
  checkRoom: async (game: Game, _io: Server, socket: Socket, roomId: string): Promise<void> => {
    try {
      await inviteCodeValidator.validate(roomId);
    } catch (error: any) {
      socket.emit("game:errorMessage", error.message);
      return;
    }

    if (!game.room || roomId !== game.room) {
      socket.emit("game:errorMessage", "Salle introuvable");
      return;
    }

    socket.emit("game:successRoom", roomId);
  },

  join: async (game: Game, _io: Server, socket: Socket, player: { username: string; room: string }): Promise<void> => {
    try {
      await usernameValidator.validate(player.username);
    } catch (error: any) {
      socket.emit("game:errorMessage", error.message);
      return;
    }

    if (!game.room || player.room !== game.room) {
      socket.emit("game:errorMessage", "Salle introuvable");
      return;
    }

    if (game.players.find((p: PlayerData) => p.username === player.username)) {
      socket.emit("game:errorMessage", "Nom d'utilisateur déjà pris");
      return;
    }

    if (game.started) {
      socket.emit("game:errorMessage", "Jeu déjà commencé");
      return;
    }

    console.log("Nouveau Joueur", player);

    socket.join(player.room);

    const playerData: PlayerData = {
      username: player.username,
      room: player.room,
      id: socket.id,
      points: 0,
    };
    socket.to(player.room).emit("manager:newPlayer", { ...playerData });

    game.players.push(playerData);

    socket.emit("game:successJoin");
  },

  selectedAnswer: (
    game: Game,
    _io: Server,
    socket: Socket,
    answerKey: any
  ): void => {
    const player = game.players.find((player) => player.id === socket.id);
    const question = game.questions[game.currentQuestion];

    if (!player) {
      return;
    }

    if (game.playersAnswer.find((p) => p.id === socket.id)) {
      return;
    }

    game.playersAnswer.push({
      id: socket.id,
      answer: answerKey,
      points: convertTimeToPoint(game.roundStartTime, question.time),
    });

    socket.emit("game:status", {
      name: "WAIT",
      data: { text: "En attente des réponses des autres joueurs" },
    });
    socket.to(game.room!).emit("game:playerAnswer", game.playersAnswer.length);

    if (game.playersAnswer.length === game.players.length) {
      abortCooldown();
    }
  },
};

export default Player;
