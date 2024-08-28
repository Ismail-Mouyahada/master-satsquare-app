export interface Quiz {
    id: number;
    room?: string | null;
    manager?: string | null;
    players: Player[];
    started: boolean;
    subject: string;
    password: string;
    questions: Question[];
    playersAnswers: PlayersAnswer[];
    roundStartTime: number;
    currentQuestion: number;
    createdAt: Date;
    updatedAt: Date;
    utilisateur?: Utilisateur | null;
    utilisateurId?: number | null;
    evenementsQuiz: EvenementsQuiz[];
  }
  
  export interface Player {
    id: number;
    name: string;
    quiz?: Quiz | null;
    quizId?: number | null;
    answers: PlayersAnswer[];
  }
  
  export interface Question {
    id: number;
    quiz: Quiz;
    quizId: number;
    time: number;
    image?: string | null;
    answers: any; // Assuming JSON is of type `any`. Change as needed.
    cooldown: number;
    question: string;
    solution: number;
    playersAnswers: PlayersAnswer[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PlayersAnswer {
    id: number;
    player: Player;
    playerId: number;
    quiz: Quiz;
    quizId: number;
    question: Question;
    questionId: number;
    answer: number;
    answeredAt: Date;
  }
  
  export interface Utilisateur {
    id: number;
    pseudo?: string | null;
    email: string;
    roleId?: number | null;
    mot_de_passe: string;
    associationId?: number | null;
    statutCompte?: boolean | null;
    sponsorId?: number | null;
    creeLe: Date;
    misAJourLe: Date;
    walletId?: string | null;
    balance?: bigint | null;
    quizzes: Quiz[];
    evenements: Evenement[];
    evenementsQuiz: EvenementsQuiz[];
    association?: Association | null;
    role?: Role | null;
    sponsor?: Sponsor | null;
  }
  
  export interface Association {
    id: number;
    nom: string;
    adresseEclairage: string;
    valide: number;
    estConfirme: boolean;
    logoUrl: string;
    creeLe: Date;
    misAJourLe: Date;
    associationDons: AssociationDon[];
    utilisateurs: Utilisateur[];
  }
  
  export interface Sponsor {
    id: number;
    nom: string;
    valide: number;
    adresseEclairage: string;
    estConfirme: boolean;
    creeLe: Date;
    misAJourLe: Date;
    dons: Don[];
    utilisateurs: Utilisateur[];
  }
  
  export interface Role {
    id: number;
    nom: string;
    utilisateurs: Utilisateur[];
  }
  
  export interface Evenement {
    id: number;
    nom: string;
    description: string;
    userId?: number | null;
    commenceA: Date;
    termineA: Date;
    estPublic: boolean;
    estGratuit: boolean;
    satMinimum: number;
    recompenseJoueurs: number;
    donAssociation: number;
    donPlateforme: number;
    creeLe: Date;
    misAJourLe: Date;
    dons: Don[];
    utilisateur?: Utilisateur | null;
    evenementsQuiz: EvenementsQuiz[];
  }
  
  export interface Don {
    id: number;
    sponsorId: number;
    evenementId: number;
    montant: number;
    creeLe: Date;
    misAJourLe: Date;
    associationDons: AssociationDon[];
    evenement: Evenement;
    sponsor: Sponsor;
  }
  
  export interface AssociationDon {
    id: number;
    donId: number;
    associationId: number;
    association: Association;
    don: Don;
  }
  
  export interface EvenementsQuiz {
    id: number;
    score: number;
    evenementId: number;
    quizId: number;
    questionId: number;
    reponseId: number;
    userId: number;
    evenement: Evenement;
    quiz: Quiz;
    utilisateur: Utilisateur;
  }
  
  export interface TopScore {
    id: number;
    username?: string | null;
    room?: string | null;
    points: number;
    sujet?: string | null;
    idQuiz?: number | null;
    satsWinner?: number | null;
    dateCreation: Date;
    dateModification?: Date | null;
  }
  