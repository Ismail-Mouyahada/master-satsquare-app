generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Utilisateur {
  id             Int              @id @default(autoincrement())
  pseudo         String           @unique
  email          String           @unique
  role_id        Int?
  mot_de_passe   String
  associationId Int?
  statut_compte  Boolean
  sponsorId     Int?
  creeLe        DateTime         @default(now())
  mis_a_jour_le  DateTime         @updatedAt
  walletId       String?          // Optional field for the LNbits wallet ID
  balance        BigInt?
  Evenement      Evenement[]
  EvenementsQuiz EvenementsQuiz[]
  Quiz           Quiz[]
  association    Association?     @relation(fields: [associationId], references: [id], onDelete: Cascade)
  role           Role?            @relation(fields: [role_id], references: [id], onDelete: Cascade)
  sponsor        Sponsor?         @relation(fields: [sponsorId], references: [id], onDelete: Cascade)
  Game           Game[]
}

model Association {
  id                Int              @id @default(autoincrement())
  nom               String
  adresseEclairage String
  valide            Int
  estConfirme      Boolean
  logo_url          String
  creeLe           DateTime         @default(now())
  mis_a_jour_le     DateTime         @updatedAt
  AssociationDons   AssociationDon[]
  Utilisateurs      Utilisateur[]
}

model Sponsor {
  id                Int           @id @default(autoincrement())
  nom               String
  valide            Int
  adresseEclairage String
  estConfirme      Boolean
  creeLe           DateTime      @default(now())
  mis_a_jour_le     DateTime      @updatedAt
  Dons              Don[]
  Utilisateurs      Utilisateur[]
}

model Role {
  id           Int           @id @default(autoincrement())
  nom          String
  utilisateurs Utilisateur[]
}

model Evenement {
  id                 Int              @id @default(autoincrement())
  nom                String
  description        String
  user_id            Int?
  commence_a         DateTime
  termine_a          DateTime
  est_public         Boolean
  est_gratuit        Boolean
  sat_minimum        Int
  recompense_joueurs Int
  don_association    Int
  don_plateforme     Int
  creeLe            DateTime         @default(now())
  mis_a_jour_le      DateTime         @updatedAt
  Dons               Don[]
  utilisateur        Utilisateur?     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  EvenementsQuiz     EvenementsQuiz[]
}

model Don {
  id              Int              @id @default(autoincrement())
  sponsorId      Int
  evenement_id    Int
  montant         Float
  creeLe         DateTime         @default(now())
  mis_a_jour_le   DateTime         @updatedAt
  AssociationDons AssociationDon[]
  evenement       Evenement        @relation(fields: [evenement_id], references: [id], onDelete: Cascade)
  sponsor         Sponsor          @relation(fields: [sponsorId], references: [id], onDelete: Cascade)
}

model AssociationDon {
  id             Int         @id @default(autoincrement())
  don_id         Int
  associationId Int
  association    Association @relation(fields: [associationId], references: [id], onDelete: Cascade)
  don            Don         @relation(fields: [don_id], references: [id], onDelete: Cascade)
}

model Quiz {
  id             Int              @id @default(autoincrement())
  titre          String
  user_id        Int?
  categorie      String
  creeLe        DateTime         @default(now())
  mis_a_jour_le  DateTime         @updatedAt
  EvenementsQuiz EvenementsQuiz[]
  Questions      Question[]
  utilisateur    Utilisateur?     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  Game           Game[]
}

model EvenementsQuiz {
  id           Int         @id @default(autoincrement())
  score        Int
  evenement_id Int
  quiz_id      Int
  question_id  Int
  reponse_id   Int
  user_id      Int
  evenement    Evenement   @relation(fields: [evenement_id], references: [id], onDelete: Cascade)
  quiz         Quiz        @relation(fields: [quiz_id], references: [id], onDelete: Cascade)
  utilisateur  Utilisateur @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@unique([evenement_id, quiz_id, question_id, reponse_id, user_id], name: "unique_event_quiz_question_response_user")
}

model Question {
  id             Int       @id @default(autoincrement())
  quiz_id        Int?
  texte_question String
  quiz           Quiz?     @relation(fields: [quiz_id], references: [id], onDelete: Cascade)
  Reponses       Reponse[]
}

model Reponse {
  id            Int       @id @default(autoincrement())
  question_id   Int?
  texte_reponse String
  est_correcte  Boolean
  question      Question? @relation(fields: [question_id], references: [id], onDelete: Cascade)
}

model Game {
  id                Int              @id @default(autoincrement())
  room              String           @unique
  password          String
  manager_id        Int?
  started           Boolean          @default(false)
  subject           String
  currentQuestion   Int              @default(0)
  roundStartTime    DateTime?
  players           Json
  playersAnswer     Json
  creeLe           DateTime         @default(now())
  mis_a_jour_le     DateTime         @updatedAt
  utilisateur       Utilisateur?     @relation(fields: [manager_id], references: [id], onDelete: Cascade)
  quiz_id           Int?
  quiz              Quiz?            @relation(fields: [quiz_id], references: [id], onDelete: Cascade)
}
