export interface Role {
    id: number;
    nom: string;
    utilisateurs: Utilisateur[];
}

export interface Utilisateur {
    id: number;
    pseudo: string;
    role?: Role;
    role_id?: number;
    mot_de_passe: string;
    association?: Association;
    association_id?: number;
    statut_compte: boolean;
    sponsor?: Sponsor;
    sponsor_id?: number;
    cree_le: Date;
    mis_a_jour_le: Date;
    walletId?: string; // Optional field for wallet ID
    balance?: number;  // Optional field for wallet balance in sats
    EvenementsQuiz: EvenementsQuiz[];
    Evenement: Evenement[];
    Quiz: QuizState[];
}

export interface Association {
    id: number;
    nom: string;
    adresse_eclairage: string;
    valide: number;
    est_confirme: boolean;
    cree_le: Date;
    mis_a_jour_le: Date;
    Utilisateurs: Utilisateur[];
    AssociationDons: AssociationDon[];
}

export interface Sponsor {
    id: number;
    nom: string;
    valide: number;
    adresse_eclairage: string;
    est_confirme: boolean;
    cree_le: Date;
    mis_a_jour_le: Date;
    Utilisateurs: Utilisateur[];
    Dons: Don[];
}

export interface Evenement {
    id: number;
    nom: string;
    description: string;
    utilisateur: Utilisateur;
    user_id: number;
    commence_a: Date;
    termine_a: Date;
    est_public: boolean;
    cree_le: Date;
    mis_a_jour_le: Date;
    Dons: Don[];
    EvenementsQuiz: EvenementsQuiz[];
}

export interface Don {
    id: number;
    sponsor: Sponsor;
    sponsor_id: number;
    evenement: Evenement;
    evenement_id: number;
    montant: number;
    cree_le: Date;
    mis_a_jour_le: Date;
    AssociationDons: AssociationDon[];
}

export interface AssociationDon {
    id: number;
    don: Don;
    don_id: number;
    association: Association;
    association_id: number;
}

export interface QuizState {
    id?: number;
    titre: string;
    user_id: number;
    categorie: string;
    date?: Date;
    cree_le?: Date;
    mis_a_jour_le?: Date;
    EvenementsQuiz?: EvenementsQuiz[];
    Questions: QuestionState[];
}

export interface EvenementsQuiz {
    id: number;
    score: number;
    evenement: Evenement;
    evenement_id: number;
    quiz: QuizState;
    quiz_id: number;
    question_id: number;
    reponse_id: number;
    utilisateur: Utilisateur;
    user_id: number;
}

export interface QuestionState {
    answers: any;
    question: any;
    image: any;
    cooldown: any;
    time: any;
    solution: string;
    id?: number;
    texte_question: string;
    Reponses: Reponse[];
    quiz_id?: number;
    titre: string;
    user_id: number; 
    categorie: string; 
    cree_l?: Date; 
    mis_a_jour_le?: Date;
}


export interface Reponse {
    id?: number;
    texte_reponse: string;
    est_correcte: boolean;
    question_id?: number;
}

export interface Game {
    started: boolean;
    manager: string;
    room: string;
    currentQuestion: number;
    roundStartTime: number;
    questions: QuestionState[];
    players: Player[];
    answers : string[];
    playersAnswer: PlayerAnswer[];
}

export interface Player {
    id: string;
    username: string;
    points: number;
}

export interface QuestionSocket {
    question: string;
    image?: string;
    answers: string[];
    solution: string;
    cooldown: number;
    time: number;
}

export interface PlayerAnswer {
    id: string;
    answer: string;
    points: number;
}

export interface ShowRoomProps {
    data: {
        // Define appropriate props for SHOW_ROOM
    };
}

export interface ShowResponsesProps {
    data: {
        question: string;
        answers: string[];
        image?: string;
        time: number;
        responses: string[];
        correct: string;
    };
}

export interface ShowLeaderboardProps {
    data: {
        leaderboard: any;
    };
}

export interface FinishProps {
    data: {
        subject: string;
        top: string;
    };
}
