# Utiliser une image de Node.js basée sur Alpine pour un environnement léger
FROM node:18-alpine

# Définir le répertoire de travail à /app
WORKDIR /app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Exposer le port 5001 (selon ton fichier docker-compose.yml)
EXPOSE 5001

# Installer nodemon globalement pour un rechargement automatique pendant le développement
RUN npm install -g nodemon

# Commande par défaut pour démarrer l'application avec nodemon
CMD ["node", "server.js"]
