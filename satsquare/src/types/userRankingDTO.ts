export interface UserRankingDTO {
  classement: number;
  pseudo: string;
  participation: number;
  nombre_de_victoire: number;
  point: number;
}
export interface Score {
  id: number;
  username?: string;
  room?: string;
  points: number ;
  sujet?: string;
  idQuiz?: number;
  satsWinner?: number;
  dateCreation?: Date;
  dateModification?: Date;
}