const express = require('express');
const router = express.Router();
const {
  criarAvaliacao,
  listarAvaliacoes
} = require('../controllers/avaliacao.controller');

router.post('/', criarAvaliacao);
router.get('/', listarAvaliacoes);

module.exports = router;
