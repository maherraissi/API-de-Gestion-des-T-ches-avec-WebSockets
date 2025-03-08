# API de Gestion des Tâches avec WebSockets

## Description
Ce projet est une API Node.js permettant la gestion des tâches en temps réel grâce aux WebSockets et une base de données MongoDB.

## Fonctionnalités
- Gestion des utilisateurs (inscription, connexion, JWT authentication)
- Création, mise à jour et suppression des tâches
- Communication en temps réel via WebSockets

## Installation

### Prérequis
- Node.js installé
- MongoDB en service

### Étapes
1. Cloner le dépôt :
   ```sh
   git clone https://github.com/jilanigh/API-de-Gestion-des-T-ches-avec-WebSockets.git
   ```
2. Se déplacer dans le dossier du projet :
   ```sh
   cd API-de-Gestion-des-T-ches-avec-WebSockets
   ```
3. Installer les dépendances :
   ```sh
   npm install
   ```
4. Configurer les variables d'environnement en créant un fichier `.env` :
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Démarrer le serveur :
   ```sh
   npm start
   ```

## Utilisation
L'API expose plusieurs routes accessibles via Postman ou un client frontend.

### Endpoints principaux
- `POST /api/users/register` : Inscription d'un utilisateur
- `POST /api/users/login` : Connexion et obtention du token JWT
- `GET /api/tasks` : Récupérer toutes les tâches (authentification requise)
- `POST /api/tasks` : Créer une tâche (authentification requise)
- `PUT /api/tasks/:id` : Modifier une tâche (authentification requise)
- `DELETE /api/tasks/:id` : Supprimer une tâche (authentification requise)

## Technologies utilisées
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB
- **Authentification** : JWT (JSON Web Token)
- **Temps réel** : WebSockets avec Socket.io

## Auteur
Développé par **Jilani Gharbi,Raissi Maher,Hadded Wael** 🚀

## Licence
Ce projet est sous licence MIT.
