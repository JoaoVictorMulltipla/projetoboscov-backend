const express = require('express');
const router = express.Router();
const {
  criarFilme,
  listarFilmes
} = require('../controllers/filme.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, criarFilme);
router.get('/', autenticarToken, listarFilmes);

module.exports = router;
