# SATSQUARE APP
### Description :
SatSquare est une application web progressive (PWA) innovante et inclusive, spécialement conçue pour stimuler l'engagement. 

En combinant la technologie blockchain avec des jeux interactifs, SatSquare offre aux utilisateurs une expérience unique où ils peuvent participer à des activités amusantes tout en contribuant à des causes caritatives. 


### Documentation de démarrage pour SatSquare

Ce guide vous explique comment démarrer l'application SatSquare en local pour le développement, en environnement de test, et en production, avec ou sans Docker.

---

## 1. **Prérequis**

### A. **Outils requis**
- **Node.js** : Version 16 ou supérieure.
- **NPM** : Vient généralement avec Node.js.
- **Docker** : Pour la gestion des conteneurs (facultatif si vous ne voulez pas utiliser Docker).
- **Git** : Pour cloner le dépôt.

### B. **Clonage du dépôt**
Clonez le dépôt SatSquare depuis GitHub :
```bash
git clone https://github.com/your-username/satsquare.git
cd satsquare
```

---

## 2. **Démarrage en local (Développement)**

### A. **Configuration des variables d'environnement**

Créez un fichier `.env.local` à la racine du projet avec le contenu suivant :
```env
POSTGRES_USER=postgres_dev
POSTGRES_PASSWORD=dev_password
POSTGRES_DB=sat_square_dev_db
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
NEXTAUTH_SECRET="your_dev_secret_key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="ws://localhost:5157"
```

### B. **Démarrage sans Docker**

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer la base de données** (assurez-vous d'avoir PostgreSQL en cours d'exécution) :
   ```bash
   npx prisma migrate dev
   ```

3. **Démarrer l'application** :
   ```bash
   npm run all-dev
   ```

### C. **Démarrage avec Docker**

1. **Créer un fichier `docker-compose.dev.yml`** (ou utiliser celui fourni) :
   ```yaml
   version: '3.8'
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.dev
       ports:
         - "3000:3000"
         - "5157:5157"
       env_file:
         - .env.local
       volumes:
         - .:/app
         - /app/node_modules
       command: npm run all-dev

     db:
       image: postgres:13
       environment:
         POSTGRES_USER: postgres_dev
         POSTGRES_PASSWORD: dev_password
         POSTGRES_DB: sat_square_dev_db
       ports:
         - "5432:5432"
   ```

2. **Démarrer les conteneurs** :
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Accéder à l'application** : L'application sera disponible à `http://localhost:3000`.

---

## 3. **Démarrage en environnement de test**

### A. **Configuration des variables d'environnement**

Créez un fichier `.env.test` à la racine du projet avec le contenu suivant :
```env
POSTGRES_USER=postgres_test
POSTGRES_PASSWORD=test_password
POSTGRES_DB=sat_square_test_db
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
NEXTAUTH_SECRET="your_test_secret_key"
NEXT_PUBLIC_SITE_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="ws://localhost:5158"
```

### B. **Démarrage sans Docker**

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer la base de données pour les tests** :
   ```bash
   npx prisma migrate dev
   ```

3. **Exécuter les tests** :
   ```bash
   npm run test:e2e
   ```

### C. **Démarrage avec Docker**

1. **Créer un fichier `docker-compose.test.yml`** :
   ```yaml
   version: '3.8'
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.test
       ports:
         - "3001:3001"
         - "5158:5158"
       env_file:
         - .env.test
       volumes:
         - .:/app
         - /app/node_modules
       command: npm run test:e2e

     db:
       image: postgres:13
       environment:
         POSTGRES_USER: postgres_test
         POSTGRES_PASSWORD: test_password
         POSTGRES_DB: sat_square_test_db
       ports:
         - "5432:5432"
   ```

2. **Démarrer les conteneurs** :
   ```bash
   docker-compose -f docker-compose.test.yml up --build
   ```

3. **Exécuter les tests dans le conteneur** :
   ```bash
   docker-compose -f docker-compose.test.yml exec app npm run test:e2e
   ```

---

## 4. **Démarrage en production**

### A. **Configuration des variables d'environnement**

Créez un fichier `.env.prod` à la racine du projet avec le contenu suivant :
```env
POSTGRES_USER=postgres_prod
POSTGRES_PASSWORD=prod_password
POSTGRES_DB=sat_square_prod_db
POSTGRES_PORT=5432
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
NEXTAUTH_SECRET="your_prod_secret_key"
NEXT_PUBLIC_SITE_URL="https://yourproductionurl.com"
NEXT_PUBLIC_SOCKET_URL="wss://yourproductionurl.com/socket"
```

### B. **Démarrage sans Docker**

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer la base de données pour la production** :
   ```bash
   npx prisma migrate deploy
   ```

3. **Construire l'application** :
   ```bash
   npm run build
   ```

4. **Démarrer l'application en mode production** :
   ```bash
   npm run start
   ```

### C. **Démarrage avec Docker**

1. **Créer un fichier `docker-compose.prod.yml`** :
   ```yaml
   version: '3.8'
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile.prod
       ports:
         - "3000:3000"
         - "5157:5157"
       env_file:
         - .env.prod
       command: npm run all

     db:
       image: postgres:13
       environment:
         POSTGRES_USER: postgres_prod
         POSTGRES_PASSWORD: prod_password
         POSTGRES_DB: sat_square_prod_db
       ports:
         - "5432:5432"
   ```

2. **Démarrer les conteneurs** :
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```

3. **Accéder à l'application** : L'application sera disponible à `https://yourproductionurl.com`.

---

## 5. **Points à vérifier**

- **Ports** : Assurez-vous que les ports utilisés ne sont pas déjà occupés par un autre service.
- **Base de données** : Vérifiez que votre base de données PostgreSQL est correctement configurée et accessible.
- **Environnements** : Utilisez les bonnes variables d'environnement pour chaque étape du déploiement.

---

## 6. **Résumé**

SatSquare peut être démarré facilement en local pour le développement, en test ou en production, avec ou sans Docker. En suivant ce guide, vous pouvez configurer votre environnement en fonction de vos besoins et démarrer rapidement le développement ou le déploiement de l'application.

Si vous avez besoin de plus d'informations ou rencontrez des problèmes, consultez la documentation ou demandez de l'aide dans votre équipe.