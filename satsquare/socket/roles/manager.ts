import { GAME_STATE_INIT } from "../quiz.config.js"
import generateRoomId from "../utils/generateRoomId.js"
import { abortCooldown, cooldown, sleep } from "../utils/cooldown.js"
import deepClone from "../utils/deepClone.js"
import { startRound } from "../utils/round.js"

const Manager = {
  createRoom: (game:any, io: any, socket: any, password: any) => {
    if (game.password !== password) {
      io.to(socket.id).emit("game:errorMessage", "Mauvais mot de passe")
      return
    }

    if (game.manager || game.room) {
      io.to(socket.id).emit("game:errorMessage", "Déjà gestionnaire")
      return
    }

    let roomInvite = generateRoomId()
    game.room = roomInvite
    game.manager = socket.id

    socket.join(roomInvite)
    io.to(socket.id).emit("manager:inviteCode", roomInvite)

    console.log("Nouvelle salle créée : " + roomInvite)
  },

  kickPlayer: (game: any, io: { in: (arg0: any) => { (): any; new(): any; socketsLeave: { (arg0: any): void; new(): any } }; to: (arg0: any) => { (): any; new(): any; emit: any } }, socket: { id: any }, playerId: any) => {
    if (game.manager !== socket.id) {
      return
    }

    const player = game.players.find((p: { id: any }) => p.id === playerId)
    game.players = game.players.filter((p: { id: any }) => p.id !== playerId)

    io.in(playerId).socketsLeave(game.room)
    io.to(player.id).emit("game:kick")
    io.to(game.manager).emit("manager:playerKicked", player.id)
  },

  startGame: async (game: { started: any; room: any; manager?: any; questions?: any; currentQuestion?: any; roundStartTime?: any; players?: any; playersAnswer?: any }, io: { to: any }, socket: any) => {
    if (game.started || !game.room) {
      return
    }

    game.started = true
    io.to(game.room).emit("game:status", {
      name: "SHOW_START",
      data: {
        time: 3,
        subject: "Adobe",
      },
    })

    await sleep(3)
    io.to(game.room).emit("game:startCooldown")

    await cooldown(3, io, game.room)
    startRound(game, io, socket)
  },

  nextQuestion: (game: { started: any; manager: any; questions: any; currentQuestion: any; room?: any; roundStartTime?: any; players?: any; playersAnswer?: any }, io: { to: any }, socket: { id: any }) => {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    if (!game.questions[game.currentQuestion + 1]) {
      return
    }

    game.currentQuestion++
    startRound(game, io, socket)
  },

  abortQuiz: (game: { started: any; manager: any; room: any }, io: any, socket: { id: any }) => {
    if (!game.started) {
      return
    }

    if (socket.id !== game.manager) {
      return
    }

    abortCooldown()
  },

  showLoaderboard: (game: any, io: any, socket: { emit: (arg0: string, arg1: { name: string; data: { subject: any; top: any } | { leaderboard: any } }) => void }) => {
    if (!game.questions[game.currentQuestion + 1]) {
      socket.emit("game:status", {
        name: "FINISH",
        data: {
          subject: game.subject,
          top: game.players.slice(0, 3).sort((a: { points: number }, b: { points: number }) => b.points - a.points),
        },
      })

      game = deepClone(GAME_STATE_INIT)
      return
    }

    socket.emit("game:status", {
      name: "SHOW_LEADERBOARD",
      data: {
        leaderboard: game.players
          .sort((a: { points: number }, b: { points: number }) => b.points - a.points)
          .slice(0, 5),
      },
    })
  },
}

export default Manager
