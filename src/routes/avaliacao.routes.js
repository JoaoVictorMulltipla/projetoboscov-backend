const express = require('express');
const router = express.Router();
const {
  criarAvaliacao,
  listarAvaliacoes,
  atualizarAvaliacao,
  deletarAvaliacao
} = require('../controllers/avaliacao.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, criarAvaliacao);
router.get('/', autenticarToken, listarAvaliacoes);
router.patch('/:idUsuario/:idFilme', autenticarToken, atualizarAvaliacao);
router.delete('/:idUsuario/:idFilme', autenticarToken, deletarAvaliacao);

module.exports = router;
