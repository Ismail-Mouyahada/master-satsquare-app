
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
    EvenementsQuiz: EvenementsQuiz[];
    Evenement: Evenement[];
    Quiz: Quiz[];
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

export interface Quiz {
    id: number;
    titre: string;
    utilisateur: Utilisateur;
    user_id: number;
    categorie: string;
    cree_le: Date;
    mis_a_jour_le: Date;
    EvenementsQuiz: EvenementsQuiz[];
    Questions: Question[];
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
