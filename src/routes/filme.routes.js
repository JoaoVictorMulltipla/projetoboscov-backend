const express = require('express');
const router = express.Router();
const {
  criarFilme,
  listarFilmes
} = require('../controllers/filme.controller');

// POST /filmes
router.post('/', criarFilme);

// GET /filmes
router.get('/', listarFilmes);

module.exports = router;
