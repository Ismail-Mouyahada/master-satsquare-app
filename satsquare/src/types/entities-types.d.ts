export interface Role {
  id: number;
  nom: string;
  utilisateurs?: Utilisateur[];
}

export interface Utilisateur {
  id: number;
  pseudo: string;
  email: string;
  role?: Role;
  role_id?: number;
  mot_de_passe: string;
  association?: Association;
  associationId?: number;
  statut_compte: boolean;
  sponsor?: Sponsor;
  sponsorId?: number;
  creeLe: Date;
  mis_a_jour_le: Date;
  walletId?: string; // Optional field for wallet ID
  balance?: number;  // Optional field for wallet balance in sats
  EvenementsQuiz: EvenementsQuiz[];
  Evenement: Evenement[];
  Quiz: Quiz[];
}

export interface Association {
  id: number;
  nom: string;
  adresseEclairage: string;
  valide: number;
  estConfirme: boolean;
  creeLe: Date;
  mis_a_jour_le: Date;
  Utilisateurs: Utilisateur[];
  AssociationDons: AssociationDon[];
}

export interface Sponsor {
  id: number;
  nom: string;
  valide: number;
  adresseEclairage: string;
  estConfirme: boolean;
  creeLe: Date;
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
  creeLe: Date;
  mis_a_jour_le: Date;
  Dons: Don[];
  EvenementsQuiz: EvenementsQuiz[];
}

export interface Don {
  id: number;
  sponsor: Sponsor;
  sponsorId: number;
  evenement: Evenement;
  evenement_id: number;
  montant: number;
  creeLe: Date;
  mis_a_jour_le: Date;
  AssociationDons: AssociationDon[];
}

export interface AssociationDon {
  id: number;
  don: Don;
  don_id: number;
  association: Association;
  associationId: number;
}

export interface Quiz {
  id: number;
  titre: string;
  utilisateur: Utilisateur | null;
  user_id: number | null;
  categorie: string;
  creeLe: Date;
  mis_a_jour_le: Date;
  room?: string | null;
  manager?: string | null;
  started: boolean;
  subject: string;
  password: string;
  roundStartTime: number;
  currentQuestion: number;
  utilisateurId: number | null;
}

export interface EvenementsQuiz {
  id: number;
  score: number;
  evenement: Evenement;
  evenement_id: number;
  quiz: Quiz;
  quiz_id: number;
  question_id: number;
  reponse_id: number;
  utilisateur: Utilisateur;
  user_id: number;
}

export interface Question {
  id: number;
  quiz: Quiz;
  quiz_id: number;
  texte_question: string;
  Reponses: Reponse[];
}

export interface Reponse {
  id: number;
  question: Question;
  question_id: number;
  texte_reponse: string;
  est_correcte: boolean;
}

export interface Game {
  started: any;
  manager: any;
  room: any;
  currentQuestion: number;
  roundStartTime: number;
  manager: string;
  questions: Question[];
  players: Player[];
  playersAnswer: PlayerAnswer[];
}

export interface Player {
  id: string;
  username: string;
  points: number;
}

export interface QuestionScoket {
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
    /* Define appropriate props for SHOW_ROOM */
  };
}

interface ShowResponsesProps {
  data: {
    question: string;
    answers: string[];
    image: string;
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
