const express = require('express');
const router = express.Router();
const {
  criarGenero,
  listarGeneros
} = require('../controllers/genero.controller');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.post('/', autenticarToken, criarGenero);
router.get('/', autenticarToken, listarGeneros);

module.exports = router;
