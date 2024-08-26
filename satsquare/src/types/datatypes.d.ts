export interface Role {
    id: number;
    nom: string;
    utilisateurs: Utilisateur[];
  }
  
  export interface Utilisateur {
    id: number;
    pseudo?: string;  // unique
    email: string;    // unique
    role?: Role;
    roleId?: number;  // Foreign key for Role
    mot_de_passe: string;
    association?: Association;
    associationId?: number;  // Foreign key for Association
    statutCompte?: boolean;  // Default false
    sponsor?: Sponsor;
    sponsorId?: number;  // Foreign key for Sponsor
    creeLe: Date;
    misAJourLe: Date;
    walletId?: string;  // Optional field for wallet ID
    balance?: bigint;   // Optional field for wallet balance in sats
    quizzes: Quiz[];
    evenements: Evenement[];
    evenementsQuiz: EvenementsQuiz[];
  }
  
  export interface Association {
    id: number;
    nom: string;
    adresseEclairage: string;
    valide: number;
    estConfirme: boolean;
    logoUrl: string;  // Assuming logoUrl from the model
    creeLe: Date;
    misAJourLe: Date;
    utilisateurs: Utilisateur[];
    associationDons: AssociationDon[];
  }
  
  export interface Sponsor {
    id: number;
    nom: string;
    valide: number;
    adresseEclairage: string;
    estConfirme: boolean;
    creeLe: Date;
    misAJourLe: Date;
    utilisateurs: Utilisateur[];
    dons: Don[];
  }
  
  export interface Evenement {
    id: number;
    nom: string;
    description: string;
    utilisateur?: Utilisateur;
    userId?: number;  // Foreign key for Utilisateur
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
    evenementsQuiz: EvenementsQuiz[];
  }
  
  export interface Don {
    id: number;
    sponsor: Sponsor;
    sponsorId: number;  // Foreign key for Sponsor
    evenement: Evenement;
    evenementId: number;  // Foreign key for Evenement
    montant: number;
    creeLe: Date;
    misAJourLe: Date;
    associationDons: AssociationDon[];
  }
  
  export interface AssociationDon {
    id: number;
    don: Don;
    donId: number;  // Foreign key for Don
    association: Association;
    associationId: number;  // Foreign key for Association
  }
  
  export interface Quiz {
    id: number;
    room?: string;  // Optional field
    manager?: string;  // Optional field
    players: Player[];
    started: boolean;
    subject: string;
    password: string;
    questions: Question[];
    playersAnswers: PlayerAnswer[];
    roundStartTime: number;
    currentQuestion: number;
    createdAt: Date;
    updatedAt: Date;
    utilisateur?: Utilisateur;
    utilisateurId?: number;  // Foreign key for Utilisateur
    evenementsQuiz: EvenementsQuiz[];
  }
  
  export interface Player {
    id: number;
    name: string;
    quiz?: Quiz;
    quizId?: number;  // Foreign key for Quiz
    answers: PlayerAnswer[];
  }
  
  export interface Question {
    id: number;
    quiz: Quiz;
    quizId: number;  // Foreign key for Quiz
    time: number;
    image?: string;  // Optional field
    answers: string[];  // Store as JSON
    cooldown: number;
    question: string;
    solution: number;  // Index of the correct answer
    playersAnswers: PlayerAnswer[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface PlayerAnswer {
    id: number;
    player: Player;
    playerId: number;  // Foreign key for Player
    quiz: Quiz;
    quizId: number;  // Foreign key for Quiz
    question: Question;
    questionId: number;  // Foreign key for Question
    answer: number;  // Index of the selected answer
    answeredAt: Date;
  }
  
  export interface EvenementsQuiz {
    id: number;
    score: number;
    evenement: Evenement;
    evenementId: number;  // Foreign key for Evenement
    quiz: Quiz;
    quizId: number;  // Foreign key for Quiz
    questionId: number;
    reponseId: number;
    utilisateur: Utilisateur;
    userId: number;  // Foreign key for Utilisateur
  
    // Adding unique constraint mapping from the Prisma schema
    unique_event_quiz_question_response_user: {
      evenementId: number;
      quizId: number;
      questionId: number;
      reponseId: number;
      userId: number;
    };
  }
  
  export interface TopScore {
    id: number;
    username?: string;
    room?: string;
    points: number;
    sujet?: string;
    idQuiz?: number;
    satsWinner?: number;
    dateCreation: Date;
    dateModification?: Date;
  }
  
  export interface Game {
    started: boolean;
    manager?: string;
    room?: string;
    currentQuestion: number;
    roundStartTime: number;
    questions: Question[];
    players: Player[];
    playersAnswer: PlayerAnswer[];
  }
  
  export interface QuestionSocket {
    question: string;
    image?: string;
    answers: string[];
    solution: string;
    cooldown: number;
    time: number;
  }
  
  export interface ShowRoomProps {
    data: {
      /* Define appropriate props for SHOW_ROOM */
    };
  }
  
  export interface ShowResponsesProps {
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
  