const express = require('express');
const router = express.Router();
const {
  criarUsuario,
  listarUsuarios
} = require('../controllers/usuario.controller')

router.post('/', criarUsuario);
router.get('/', listarUsuarios);

module.exports = router;
