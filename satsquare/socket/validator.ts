import * as yup from "yup";

export const usernameValidator = yup
  .string()
  .required("Le nom d'utilisateur est requis")
  .min(4, "Le nom d'utilisateur ne peut pas contenir moins de 4 caractères")
  .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères");

export const inviteCodeValidator = yup
  .string()
  .required("Le code d'invitation est requis")
  .length(6, "Code d'invitation invalide");
