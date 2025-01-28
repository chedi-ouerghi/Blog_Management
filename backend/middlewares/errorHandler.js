const multer = require("multer");

exports.errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'Erreur de téléchargement du fichier.' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Données invalides.' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
