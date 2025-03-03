const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Vérifie le chemin selon ton projet
require('dotenv').config();  // Charger les variables d'environnement

// Middleware d'authentification
const authenticate = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé : Aucun token fourni' });
    }

    // Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { userId, role, ... }
    
    next(); // Passer au prochain middleware ou contrôleur
  } catch (error) {
    console.error('Erreur d’authentification:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware d’autorisation (vérification des rôles)
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Accès refusé : Rôle non défini' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès interdit : Rôle insuffisant' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
