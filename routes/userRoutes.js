const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Route pour obtenir l'utilisateur courant doit être AVANT les autres routes
router.get('/me', authenticate, userController.getCurrentUser);

// Les autres routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', authenticate, userController.getAllUsers);

// Routes protégées
router.get('/users/:id', authenticate, userController.getUserById);
router.put('/users/:id', authenticate, userController.updateUser);
router.delete('/users/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
