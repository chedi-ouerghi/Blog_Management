const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.protect = async (req, res, next) => {
  let token;

  try {
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; 

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-password');

      
      if (!req.user) {
        return res.status(404).json({ message: "Utilisateur introuvable" });
      }

      next();
    } else {
      return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
    }
  } catch (error) {
    console.error(error); 
    return res.status(401).json({ message: 'Non autorisé, token invalide ou expiré' });
  }
};


exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Non autorisé, utilisateur non authentifié' });
  }

  
  if (req.user.role === 'admin') {
    next(); 
  } else {
    return res.status(403).json({ message: "Accès refusé. Réservé aux administrateurs." });
  }
};
