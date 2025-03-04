import { Server, Socket } from "socket.io";
import { getGameState } from "../quiz.config.js";
import generateRoomId from "../utils/generateRoomId.js";
import { abortCooldown, cooldown, sleep } from "../utils/cooldown.js";
import deepClone from "../utils/deepClone.js";
import { startRound } from "../utils/round.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlayerData {
  username: string;
  room: string;
  id: string;
  points: number;
}

interface PlayerAnswer {
  id: string;
  answer: any;
  points: number;
}

interface Game {
  password?: string;
  manager?: string;
  room?: string;
  started: boolean;
  questions: any[];
  currentQuestion: number;
  players: PlayerData[];
  playersAnswer: PlayerAnswer[];
  roundStartTime: number;
  subject?: string;
  [key: string]: any;
}

const Manager = {
  createRoom: (game: Game, io: Server, socket: Socket, password: string) => {
    if (game.password !== password) {
      io.to(socket.id).emit("game:errorMessage", "Mauvais mot de passe");
      return;
    }

    if (game.manager || game.room) {
      io.to(socket.id).emit("game:errorMessage", "Déjà gestionnaire");
      return;
    }

    const roomInvite = generateRoomId();
    game.room = roomInvite;
    game.manager = socket.id;

    socket.join(roomInvite);
    io.to(socket.id).emit("manager:inviteCode", roomInvite);

    console.log("Nouvelle salle créée : " + roomInvite);
  },

  kickPlayer: (game: Game, io: Server, socket: Socket, playerId: string) => {
    if (game.manager !== socket.id) {
      return;
    }

    const player = game.players.find((p) => p.id === playerId);
    if (player) {
      game.players = game.players.filter((p) => p.id !== playerId);

      io.in(playerId).socketsLeave(game.room!);
      io.to(player.id).emit("game:kick");
      io.to(game.manager!).emit("manager:playerKicked", player.id);
    }
  },

  startGame: async (game: Game, io: Server, socket: Socket) => {
    if (game.started || !game.room) {
      return;
    }

    game.started = true;
    io.to(game.room).emit("game:status", {
      name: "SHOW_START",
      data: {
        time: 3,
        subject: "Le jeu commence !",
      },
    });

    await sleep(3);
    io.to(game.room).emit("game:startCooldown");

    await cooldown(3, io, game.room);
    startRound(game, io, socket);
  },

  nextQuestion: (game: Game, io: Server, socket: Socket) => {
    if (!game.started || socket.id !== game.manager || !game.questions[game.currentQuestion + 1]) {
      return;
    }

    game.currentQuestion++;
    startRound(game, io, socket);
  },

  abortQuiz: (game: Game, io: Server, socket: Socket) => {
    if (!game.started || socket.id !== game.manager) {
      return;
    }

    abortCooldown();
  },

  showLeaderboard: async (game: Game, io: Server, socket: Socket) => {
    if (!game.questions[game.currentQuestion + 1]) {
      socket.emit("game:status", {
        name: "FINISH",
        data: {
          subject: game.subject,
          top: game.players
            .slice(0, 3)
            .sort((a, b) => b.points - a.points),
        },
      });

      // Save top scores to the database, handling cases with fewer than 3 players
      try {
        const topPlayers = game.players
          .sort((a, b) => b.points - a.points)
          .slice(0, 3);

        if (topPlayers.length > 0) {
          await prisma.topScore.createMany({
            data: topPlayers.map(player => ({
              username: player.username,
              points: player.points,
              room: player.room,
              satsWinner: player.points, // Assuming satsWinner is equal to points
              sujet: game.subject,
            })),
          });
        }
      } catch (error) {
        console.error("Error saving top scores:", error);
      }

      Object.assign(game, deepClone(getGameState));
      return;
    }

    socket.emit("game:status", {
      name: "SHOW_LEADERBOARD",
      data: {
        leaderboard: game.players
          .sort((a, b) => b.points - a.points)
          .slice(0, 5),
      },
    });
  },

};

export default Manager;
