# image de base 
FROM node:20-alpine

# Installation de ffmpeg
RUN apk add --no-cache ffmpeg

# dossier de travail dans le conteneur 
WORKDIR /app

# copie des fichiers de dépendances 
COPY package*.json ./

# installation 
RUN npm install

# port d'écoute 
EXPOSE 3000

# commande de lancement 
CMD ["npm", "run", "dev"]