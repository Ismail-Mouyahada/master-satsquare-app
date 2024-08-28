import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlayerData {
  id: string;
  username: string;
  room: string;
  points: number;
}

interface GameState {
  manager: string | null;
  room: string;
  started: boolean;
  players: PlayerData[];
  questions: any[];
  currentQuestion: number;
  playersAnswer: { id: string; answer: string; points: number }[];
  roundStartTime?: number;
  subject: string;
  password: string;
  [key: string]: any;
}

export const getGameState = async (quizId: number): Promise<GameState> => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    throw new Error(`Quiz with ID ${quizId} not found`);
  }

  const gameState: GameState = {
    room: quiz.room || '',
    manager: quiz.manager || null,
    started: quiz.started,
    players: [],
    subject: quiz.subject,
    password: quiz.password,
    questions: quiz.questions.map((q: { id: any; question: any; answers: any; cooldown: any; time: any; solution: any; image: any; }) => ({
      id: q.id,
      question: q.question,
      answers: q.answers,
      cooldown: q.cooldown,
      time: q.time,
      solution: q.solution,
      image: q.image,
    })),
    playersAnswer: [],
    roundStartTime: quiz.roundStartTime,
    currentQuestion: quiz.currentQuestion,
  };

  return gameState;
};
