const express = require('express');
const router = express.Router();
const {
  criarGenero,
  listarGeneros
} = require('../controllers/genero.controller');

router.post('/', criarGenero);
router.get('/', listarGeneros);

module.exports = router;
