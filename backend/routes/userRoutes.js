const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');
const handleValidationErrors = require('../middlewares/ValidationErrors');
const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('L’email doit être valide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Le rôle doit être "user" ou "admin"'),
  ],
  handleValidationErrors,
  registerUser
);

router.post('/login', loginUser);

module.exports = router;
