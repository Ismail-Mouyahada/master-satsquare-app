import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  await prisma.role.createMany({
    data: [
      { nom: 'Admin' },
      { nom: 'User' },
    ],
  });

  const roleAdmin = await prisma.role.findFirst({ where: { nom: 'Admin' } });
  const roleUser = await prisma.role.findFirst({ where: { nom: 'User' } });

  if (!roleAdmin || !roleUser) {
    throw new Error('Roles not found');
  }

  // Seed associations
  const associations = [];
  for (let i = 0; i < 5; i++) {
    const association = await prisma.association.create({
      data: {
        nom: faker.company.name(),
        adresse_eclairage: faker.address.streetAddress(),
        valide: faker.datatype.boolean() ? 1 : 0,
        est_confirme: faker.datatype.boolean(),
        logo_url: faker.image.imageUrl(),
      },
    });
    associations.push(association);
  }

  // Seed sponsors
  const sponsors = [];
  for (let i = 0; i < 5; i++) {
    const sponsor = await prisma.sponsor.create({
      data: {
        nom: faker.company.name(),
        valide: faker.datatype.boolean() ? 1 : 0,
        adresse_eclairage: faker.address.streetAddress(),
        est_confirme: faker.datatype.boolean(),
      },
    });
    sponsors.push(sponsor);
  }

  // Seed utilisateurs
  const utilisateurs = [];
  for (let i = 0; i < 5; i++) {
    const utilisateur = await prisma.utilisateur.create({
      data: {
        pseudo: faker.internet.userName(),
        email: faker.internet.email(),
        mot_de_passe: bcrypt.hashSync("password123", 10),
        role: { connect: { id: roleAdmin.id } },
        association: { connect: { id: associations[i % associations.length].id } },
        sponsor: { connect: { id: sponsors[i % sponsors.length].id } },
        statut_compte: faker.datatype.boolean(),
      },
    });
    utilisateurs.push(utilisateur);
  }

  // Seed evenements
  const evenements = [];
  for (let i = 0; i < 5; i++) {
    const evenement = await prisma.evenement.create({
      data: {
        nom: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        utilisateur: { connect: { id: utilisateurs[i % utilisateurs.length].id } },
        commence_a: faker.date.future(),
        termine_a: faker.date.future(),
        est_public: faker.datatype.boolean(),
        est_gratuit: faker.datatype.boolean(),
        sat_minimum: faker.datatype.number({ min: 1, max: 100 }),
        recompense_joueurs: faker.datatype.number({ min: 1, max: 1000 }),
        don_association: faker.datatype.number({ min: 1, max: 1000 }),
        don_plateforme: faker.datatype.number({ min: 1, max: 1000 }),
      },
    });
    evenements.push(evenement);
  }

  // Seed quizzes
  const quizzes = [];
  for (let i = 0; i < 5; i++) {
    const quiz = await prisma.quiz.create({
      data: {
        titre: faker.lorem.words(3),
        utilisateur: { connect: { id: utilisateurs[i % utilisateurs.length].id } },
        categorie: faker.lorem.word(),
      },
    });
    quizzes.push(quiz);
  }

  // Seed questions
  const questions = [];
  for (let i = 0; i < 5; i++) {
    const question = await prisma.question.create({
      data: {
        quiz: { connect: { id: quizzes[i % quizzes.length].id } },
        texte_question: faker.lorem.sentence(),
      },
    });
    questions.push(question);
  }

  // Seed reponses
  for (const question of questions) {
    await prisma.reponse.createMany({
      data: [
        { question_id: question.id, texte_reponse: faker.lorem.word(), est_correcte: true },
        { question_id: question.id, texte_reponse: faker.lorem.word(), est_correcte: false },
      ],
    });
  }

  // Seed dons
  const dons = [];
  for (let i = 0; i < 5; i++) {
    const don = await prisma.don.create({
      data: {
        sponsor: { connect: { id: sponsors[i % sponsors.length].id } },
        evenement: { connect: { id: evenements[i % evenements.length].id } },
        montant: faker.datatype.number({ min: 100, max: 10000 }),
      },
    });
    dons.push(don);
  }

  // Seed association dons
  for (const don of dons) {
    await prisma.associationDon.create({
      data: {
        don: { connect: { id: don.id } },
        association: { connect: { id: associations[dons.indexOf(don) % associations.length].id } },
      },
    });
  }

  // Seed evenements quizzes
  for (const quiz of quizzes) {
    await prisma.evenementsQuiz.create({
      data: {
        evenement: { connect: { id: evenements[quizzes.indexOf(quiz) % evenements.length].id } },
        quiz: { connect: { id: quiz.id } },
        question_id: questions[quizzes.indexOf(quiz) % questions.length].id,
        utilisateur: { connect: { id: utilisateurs[quizzes.indexOf(quiz) % utilisateurs.length].id } },
        reponse_id: 1, // Adjust this as necessary
        score: faker.datatype.number({ min: 0, max: 100 }),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
