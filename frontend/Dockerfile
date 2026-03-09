FROM node:22-alpine

WORKDIR /app

# On installe les dépendances en premier (optimisation du cache Docker)
COPY package*.json ./
RUN npm install

# Note : On ne COPY pas le reste du code ici en DEV, 
# car le docker-compose va "monter" les dossiers en temps réel.

EXPOSE 5173

# On force l'hôte pour que Vite réponde aux requêtes du proxy Nginx
CMD ["npm", "run", "dev", "--", "--host"]
