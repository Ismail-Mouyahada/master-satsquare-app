const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Seed roles
  await prisma.role.createMany({
    data: [{ nom: "Admin" }, { nom: "User" }],
  });

  // Seed associations
  const associations = [];
  for (let i = 0; i < 5; i++) {
    const association = await prisma.association.create({
      data: {
        nom: faker.company.name(),
        adresse_eclairage: faker.address.streetAddress(),
        valide: faker.datatype.number({ min: 0, max: 1 }),
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
        adresse_eclairage: faker.address.streetAddress(),
        valide: faker.datatype.number({ min: 0, max: 1 }),
        est_confirme: faker.datatype.boolean(),
      },
    });
    sponsors.push(sponsor);
  }

  // Seed users
  const utilisateurs = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash("password", 10);
    const utilisateur = await prisma.utilisateur.create({
      data: {
        pseudo: faker.internet.userName(),
        email: faker.internet.email(),
        mot_de_passe: hashedPassword,
        statut_compte: faker.datatype.boolean(),
        association: {
          connect: {
            id: associations[
              faker.datatype.number({ min: 0, max: associations.length - 1 })
            ].id,
          },
        },
        sponsor: {
          connect: {
            id: sponsors[
              faker.datatype.number({ min: 0, max: sponsors.length - 1 })
            ].id,
          },
        },
        role: {
          connect: {
            id: faker.datatype.number({ min: 1, max: 2 }), // Assuming you have 2 roles: Admin and User
          },
        },
      },
    });
    utilisateurs.push(utilisateur);
  }

  // Seed quizzes
  const quizzes = [];
  for (let i = 0; i < 5; i++) {
    const quiz = await prisma.quiz.create({
      data: {
        titre: faker.lorem.sentence(),
        categorie: faker.lorem.word(),
        utilisateur: {
          connect: {
            id: utilisateurs[
              faker.datatype.number({ min: 0, max: utilisateurs.length - 1 })
            ].id,
          },
        },
      },
    });
    quizzes.push(quiz);
  }

  // Seed events
  for (let i = 0; i < 5; i++) {
    await prisma.evenement.create({
      data: {
        nom: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        commence_a: faker.date.future(),
        termine_a: faker.date.future(),
        est_public: faker.datatype.boolean(),
        est_gratuit: faker.datatype.boolean(),
        sat_minimum: faker.datatype.number({ min: 0, max: 1000 }),
        recompense_joueurs: faker.datatype.number({ min: 0, max: 100 }),
        don_association: faker.datatype.number({ min: 0, max: 100 }),
        don_plateforme: faker.datatype.number({ min: 0, max: 100 }),
        utilisateur: {
          connect: {
            id: utilisateurs[
              faker.datatype.number({ min: 0, max: utilisateurs.length - 1 })
            ].id,
          },
        },
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
