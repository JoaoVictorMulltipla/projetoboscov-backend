const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const JWT_SECRET = process.env.JWT_SECRET || 'secreta-temporaria';

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: 'Token inválido ou expirado.' });
    }

    req.usuario = usuario; 
    next();
  });
}

module.exports = {
  autenticarToken
};
