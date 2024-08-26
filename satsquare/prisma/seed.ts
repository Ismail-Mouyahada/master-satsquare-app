// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      nom: 'Math Club',
      adresseEclairage: '123 Street, City',
      valide: 1,
      estConfirme: true,
      logoUrl: 'https://example.com/logo.png',
    },
  });

  // Seed sponsors
  const sponsorInc = await prisma.sponsor.create({
    data: {
      nom: 'Sponsor Inc.',
      valide: 1,
      adresseEclairage: '456 Avenue, City',
      estConfirme: true,
    },
  });

  const motdepasse = await bcrypt.hash('hashed_password', 10)
  // Seed utilisateurs (users)
  const user1 = await prisma.utilisateur.create({
    data: {
      pseudo: 'User123'+ BigInt(100000000),
      email: 'user12@example.com',
      mot_de_passe: motdepasse,
      statutCompte: true,
      walletId: 'LN123456',
      balance: BigInt(100000000),
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
      subject: 'Programmation et Bitcoin',
      password: 'PASSWORD',
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
            image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=500&auto=webp',
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
            image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=webp',
            answers: ['Django', 'Laravel', 'React', 'Spring'],
            cooldown: 5,
            question: "Lequel des éléments suivants est un framework JavaScript pour le front-end ?",
            solution: 2,
          },
          {
            time: 15,
            image: 'https://images.unsplash.com/photo-1543946607-ebfaab77d5a1?q=80&w=500&auto=webp',
            answers: ['6,25 BTC', '12,5 BTC', '25 BTC', '50 BTC'],
            cooldown: 5,
            question: "Quelle est la récompense de bloc pour le minage d'un bloc Bitcoin ?",
            solution: 0,
          },
          {
            time: 15,
            image: 'https://images.unsplash.com/photo-1581091870627-3c52cda4d0d9?q=80&w=500&auto=webp',
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
      nom: 'Math Championship',
      description: 'A quiz competition on mathematics.',
      commenceA: new Date('2024-09-01T10:00:00.000Z'),
      termineA: new Date('2024-09-01T12:00:00.000Z'),
      estPublic: true,
      estGratuit: true,
      satMinimum: 100,
      recompenseJoueurs: 1000,
      donAssociation: 500,
      donPlateforme: 100,
      userId: user1.id,
      evenementsQuiz: {
        create: {
          quizId: quiz.id,
          score: 100,
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
      montant: 1000.0,
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
