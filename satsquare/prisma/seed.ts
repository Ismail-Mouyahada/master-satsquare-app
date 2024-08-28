import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const adminRole = await prisma.role.create({
    data: {
      nom: 'Admin',
    },
  });

  // Seed associations
  const mathClub = await prisma.association.create({
    data: {
      nom: faker.company.name(),
      adresseEclairage: faker.address.streetAddress(),
      valide: 1,
      estConfirme: true,
      logoUrl: faker.image.avatar(),
    },
  });

  // Seed sponsors
  const sponsorInc = await prisma.sponsor.create({
    data: {
      nom: faker.company.name(),
      valide: 1,
      adresseEclairage: faker.address.streetAddress(),
      estConfirme: true,
    },
  });

  const motdepasse = await bcrypt.hash('hashed_password', 10);
  // Seed utilisateurs (users)
  const user1 = await prisma.utilisateur.create({
    data: {
      pseudo: faker.internet.userName(),
      email: faker.internet.email(),
      mot_de_passe: motdepasse,
      statutCompte: true,
      walletId: faker.finance.account(),
      balance: BigInt(faker.finance.amount(100000000, 1000000000, 0)),
      roleId: adminRole.id,
      associationId: mathClub.id,
      sponsorId: sponsorInc.id,
    },
  });

  // Seed quiz
  const quiz = await prisma.quiz.create({
    data: {
      room: null,
      manager: null,
      started: false,
      subject: faker.hacker.phrase(),
      password: faker.internet.password(),
      roundStartTime: 0,
      currentQuestion: 0,
      utilisateurId: user1.id,
      questions: {
        create: [
          {
            time: 15,
            answers: [
              'Vitalik Buterin',
              'Satoshi Nakamoto',
              'Gavin Andresen',
              'Charlie Lee',
            ],
            cooldown: 5,
            question: 'Qui a inventé Bitcoin ?',
            solution: 1,
          },
          {
            time: 15,
            image: faker.image.urlPicsumPhotos(),
            answers: ['Swift', 'Kotlin', 'Python', 'JavaScript'],
            cooldown: 5,
            question:
              "Quel langage de programmation est principalement utilisé pour le développement d'applications Android ?",
            solution: 1,
          },
          {
            time: 15,
            answers: ['2005', '2008', '2010', '2012'],
            cooldown: 5,
            question: 'Quand le livre blanc de Bitcoin a-t-il été publié ?',
            solution: 1,
          },
          {
            time: 15,
            answers: [
              'Centralisation',
              'Vitesse des transactions',
              'Décentralisation',
              "Faible consommation d'électricité",
            ],
            cooldown: 5,
            question:
              "Quel est le principal avantage de l'utilisation de la technologie blockchain ?",
            solution: 2,
          },
          {
            time: 15,
            image: faker.image.urlPicsumPhotos(),
            answers: ['Django', 'Laravel', 'React', 'Spring'],
            cooldown: 5,
            question: "Lequel des éléments suivants est un framework JavaScript pour le front-end ?",
            solution: 2,
          },
          {
            time: 15,
            image: faker.image.urlPicsumPhotos(),
            answers: ['6,25 BTC', '12,5 BTC', '25 BTC', '50 BTC'],
            cooldown: 5,
            question: "Quelle est la récompense de bloc pour le minage d'un bloc Bitcoin ?",
            solution: 0,
          },
          {
            time: 15,
            image: faker.image.urlLoremFlickr(),
            answers: ['HTML', 'CSS', 'PHP', 'XML'],
            cooldown: 5,
            question: 'Lequel des éléments suivants est utilisé pour le script côté serveur ?',
            solution: 2,
          },
        ],
      },
    },
  });

  // Seed events
  const event = await prisma.evenement.create({
    data: {
      nom: faker.company.bs(),
      description: faker.lorem.paragraph(),
      commenceA: faker.date.future(),
      termineA: faker.date.future(),
      estPublic: true,
      estGratuit: true,
      satMinimum: faker.datatype.number({ min: 50, max: 100 }),
      recompenseJoueurs: faker.datatype.number({ min: 1000, max: 5000 }),
      donAssociation: faker.datatype.number({ min: 100, max: 1000 }),
      donPlateforme: faker.datatype.number({ min: 10, max: 100 }),
      userId: user1.id,
      evenementsQuiz: {
        create: {
          quizId: quiz.id,
          score: faker.datatype.number({ min: 50, max: 100 }),
          questionId: 1, // assuming the first question
          reponseId: 1, // assuming the first answer
          userId: user1.id,
        },
      },
    },
  });

  // Seed donations
  const donation = await prisma.don.create({
    data: {
      sponsorId: sponsorInc.id,
      evenementId: event.id,
      montant: faker.datatype.number({ min: 1000, max: 5000 }),
    },
  });

  // Seed association donations
  await prisma.associationDon.create({
    data: {
      donId: donation.id,
      associationId: mathClub.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
