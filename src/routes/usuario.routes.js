const express = require('express');
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios
} = require('../controllers/usuario.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', criarUsuario);
router.get('/', autenticarToken, listarUsuarios); // protegido com JWT

module.exports = router;
