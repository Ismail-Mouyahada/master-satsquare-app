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
    [key: string]: any;
  }
  
export const GAME_STATE_INIT    = async (): Promise<GameState> => {
    const response = await fetch("https://api.npoint.io/56c0df1861e25efada1a");
    const data = await response.json();
    return data as GameState;
  };