"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteCodeValidator = exports.usernameValidator = void 0;
var yup = require("yup");
exports.usernameValidator = yup
    .string()
    .required("Le nom d'utilisateur est requis")
    .min(4, "Le nom d'utilisateur ne peut pas contenir moins de 4 caractères")
    .max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères");
exports.inviteCodeValidator = yup
    .string()
    .required("Le code d'invitation est requis")
    .length(6, "Code d'invitation invalide");
