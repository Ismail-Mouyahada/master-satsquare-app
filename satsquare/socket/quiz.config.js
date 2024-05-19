"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_STATE_INIT = void 0;
exports.GAME_STATE_INIT = {
    started: false,
    password: "PASSWORD",
    players: [],
    playersAnswer: [],
    manager: "",
    room: null,
    currentQuestion: 0,
    roundStartTime: 0,
    subject: "Programmation et Bitcoin",
    questions: [
        {
            question: "Qui a inventé Bitcoin ?",
            answers: [
                "Vitalik Buterin",
                "Satoshi Nakamoto",
                "Gavin Andresen",
                "Charlie Lee",
            ],
            solution: 1,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Quel langage de programmation est principalement utilisé pour le développement d'applications Android ?",
            answers: ["Swift", "Kotlin", "Python", "JavaScript"],
            image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=500&auto=webp",
            solution: 1,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Quand le livre blanc de Bitcoin a-t-il été publié ?",
            answers: ["2005", "2008", "2010", "2012"],
            solution: 1,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Quel est le principal avantage de l'utilisation de la technologie blockchain ?",
            answers: [
                "Centralisation",
                "Vitesse des transactions",
                "Décentralisation",
                "Faible consommation d'électricité",
            ],
            solution: 2,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Lequel des éléments suivants est un framework JavaScript pour le front-end ?",
            answers: ["Django", "Laravel", "React", "Spring"],
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=webp",
            solution: 2,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Quelle est la récompense de bloc pour le minage d'un bloc Bitcoin ?",
            answers: ["6,25 BTC", "12,5 BTC", "25 BTC", "50 BTC"],
            image: "https://images.unsplash.com/photo-1543946607-ebfaab77d5a1?q=80&w=500&auto=webp",
            solution: 0,
            cooldown: 5,
            time: 15,
        },
        {
            question: "Lequel des éléments suivants est utilisé pour le script côté serveur ?",
            answers: ["HTML", "CSS", "PHP", "XML"],
            image: "https://images.unsplash.com/photo-1581091870627-3c52cda4d0d9?q=80&w=500&auto=webp",
            solution: 2,
            cooldown: 5,
            time: 15,
        },
    ],
};
