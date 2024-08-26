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
  
// export const GAME_STATE_INIT    = async (): Promise<GameState> => {
//     const response = await fetch("http://localhost:3000/api/quizzes/1");
//     const data = await response.json();
//     return data as GameState;
//   };
  
  
  export const GAME_STATE_INIT    = {
    room: null,
    manager: null,
    players: [],
    started: false,
    subject: "Programmation et Bitcoin",
    password: "PASSWORD", // for testing only
    questions: [
        {
            time: 15,
            answers: [
                "Vitalik Buterin",
                "Satoshi Nakamoto",
                "Gavin Andresen",
                "Charlie Lee"
            ],
            cooldown: 5,
            question: "Qui a inventé Bitcoin ?",
            solution: 1
        },
        {
            time: 15,
            image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=500&auto=webp",
            answers: [
                "Swift",
                "Kotlin",
                "Python",
                "JavaScript"
            ],
            cooldown: 5,
            question: "Quel langage de programmation est principalement utilisé pour le développement d'applications Android ?",
            solution: 1
        },
        {
            time: 15,
            answers: [
                "2005",
                "2008",
                "2010",
                "2012"
            ],
            cooldown: 5,
            question: "Quand le livre blanc de Bitcoin a-t-il été publié ?",
            solution: 1
        },
        {
            time: 15,
            answers: [
                "Centralisation",
                "Vitesse des transactions",
                "Décentralisation",
                "Faible consommation d'électricité"
            ],
            cooldown: 5,
            question: "Quel est le principal avantage de l'utilisation de la technologie blockchain ?",
            solution: 2
        },
        {
            time: 15,
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=webp",
            answers: [
                "Django",
                "Laravel",
                "React",
                "Spring"
            ],
            cooldown: 5,
            question: "Lequel des éléments suivants est un framework JavaScript pour le front-end ?",
            solution: 2
        },
        {
            time: 15,
            image: "https://images.unsplash.com/photo-1543946607-ebfaab77d5a1?q=80&w=500&auto=webp",
            answers: [
                "6,25 BTC",
                "12,5 BTC",
                "25 BTC",
                "50 BTC"
            ],
            cooldown: 5,
            question: "Quelle est la récompense de bloc pour le minage d'un bloc Bitcoin ?",
            solution: 0
        },
        {
            time: 15,
            image: "https://images.unsplash.com/photo-1581091870627-3c52cda4d0d9?q=80&w=500&auto=webp",
            answers: [
                "HTML",
                "CSS",
                "PHP",
                "XML"
            ],
            cooldown: 5,
            question: "Lequel des éléments suivants est utilisé pour le script côté serveur ?",
            solution: 2
        }
    ],
    playersAnswer: [],
    roundStartTime: 0,
    currentQuestion: 0
}
