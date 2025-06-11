const express = require('express');
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  desativarUsuario
} = require('../controllers/usuario.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', criarUsuario);
router.get('/', autenticarToken, listarUsuarios);
router.patch('/:id', autenticarToken, atualizarUsuario);
router.patch('/:id/desativar', autenticarToken, desativarUsuario);

module.exports = router;
