const express = require('express');
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios
} = require('../controllers/usuario.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, criarUsuario);
router.get('/', autenticarToken, listarUsuarios); 

module.exports = router;
