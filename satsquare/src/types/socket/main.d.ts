export interface GameState {
    room: string;
    manager: string | null;
    started: boolean;
    players: Player[];
    subject: string;
    password: string;
    questions: Question[];
    currentQuestion: number;
    roundStartTime: number;
  }
  
  export interface Player {
    id: string;
    username: string;
    room: string;
    points: number;
  }
  
  export interface Question {
    id: number;
    question: string;
    answers: string[];
    cooldown: number;
    time: number;
    solution: number;
    image?: string | null;
  }
  
  export interface Quiz {
    id: number;
    subject: string;
    questions: Question[];
  }
  