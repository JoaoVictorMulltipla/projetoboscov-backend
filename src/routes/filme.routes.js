const express = require('express');
const router = express.Router();
const {
  criarFilme,
  listarFilmes,
  atualizarFilme,
  buscarFilmePorId
} = require('../controllers/filme.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, criarFilme);
router.get('/', autenticarToken, listarFilmes);
router.patch('/:id', autenticarToken, atualizarFilme);
router.get('/:id', autenticarToken, buscarFilmePorId);

module.exports = router;
