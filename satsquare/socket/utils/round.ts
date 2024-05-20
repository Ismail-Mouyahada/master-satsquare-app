import { cooldown, sleep } from "./cooldown.js";

interface Question {
  question: string;
  image?: string;
  cooldown: number;
  time: number;
  answers: string[];
  solution: string;
}

interface Player {
  id: string;
  username: string;
  points: number;
}

interface PlayerAnswer {
  id: string;
  answer: string;
  points: number;
}

interface Game {
  started: boolean;
  room?: string;
  manager?: string;
  questions: Question[];
  currentQuestion: number;
  roundStartTime?: number;
  players: Player[];
  playersAnswer: PlayerAnswer[];
}

interface IO {
  to: (room: string) => {
    emit: (event: string, data: any) => void;
  };
}

export const startRound = async (game: Game, io: IO, socket: any): Promise<void> => {
  const question = game.questions[game.currentQuestion];

  if (!game.started) return;

  io.to(game.room!).emit("game:updateQuestion", {
    current: game.currentQuestion + 1,
    total: game.questions.length,
  });

  io.to(game.room!).emit("game:status", {
    name: "SHOW_PREPARED",
    data: {
      totalAnswers: question.answers.length,
      questionNumber: game.currentQuestion + 1,
    },
  });

  await sleep(2);

  if (!game.started) return;

  io.to(game.room!).emit("game:status", {
    name: "SHOW_QUESTION",
    data: {
      question: question.question,
      image: question.image,
      cooldown: question.cooldown,
    },
  });

  await sleep(question.cooldown);

  if (!game.started) return;

  game.roundStartTime = Date.now();

  io.to(game.room!).emit("game:status", {
    name: "SELECT_ANSWER",
    data: {
      question: question.question,
      answers: question.answers,
      image: question.image,
      time: question.time,
      totalPlayer: game.players.length,
    },
  });

  await cooldown(question.time, io, game.room!);

  if (!game.started) return;

  game.players.forEach((player) => {
    const playerAnswer = game.playersAnswer.find((p) => p.id === player.id);
    const isCorrect = playerAnswer ? playerAnswer.answer === question.solution : false;
    const points = isCorrect ? Math.round(playerAnswer!.points) : 0;

    player.points += points;

    const sortedPlayers = [...game.players].sort((a, b) => b.points - a.points);
    const rank = sortedPlayers.findIndex((p) => p.id === player.id) + 1;
    const aheadPlayer = sortedPlayers[rank - 2];

    io.to(player.id).emit("game:status", {
      name: "SHOW_RESULT",
      data: {
        correct: isCorrect,
        message: isCorrect ? "Bien joué !" : "Dommage",
        points: points,
        myPoints: player.points,
        rank,
        aheadOfMe: aheadPlayer ? aheadPlayer.username : null,
      },
    });
  });

  const totalType: { [key: string]: number } = {};
  game.playersAnswer.forEach(({ answer }) => {
    totalType[answer] = (totalType[answer] || 0) + 1;
  });

  // Manager
  io.to(game.manager!).emit("game:status", {
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
};
