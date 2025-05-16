const express = require('express');
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario
} = require('../controllers/usuario.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', criarUsuario);
router.get('/', autenticarToken, listarUsuarios);
router.patch('/:id', autenticarToken, atualizarUsuario);

module.exports = router;
