# Utiliser une image Node.js comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json (s'ils existent)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application Next.js
RUN npm run build

# Migration des données
RUN npx prisma db push
# Seed des données
RUN npx prisma seed

# Exposer le port 3000 pour l'application Next.js
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["npm", "start"]
