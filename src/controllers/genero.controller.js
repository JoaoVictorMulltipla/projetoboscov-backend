const prisma = require('../prisma/prismaClient');
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * /generos:
 *   post:
 *     summary: Cria um novo gênero
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gênero criado com sucesso.
 *       400:
 *         description: Erro ao criar o gênero.
 */
async function criarGenero(req, res) {
  try {
    const genero = await prisma.genero.create({
      data: req.body
    });
    res.status(StatusCodes.CREATED).json(genero);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao criar gênero.' });
  }
}

/**
 * @swagger
 * /generos:
 *   get:
 *     summary: Lista todos os gêneros
 *     responses:
 *       200:
 *         description: Lista de gêneros.
 *       400:
 *         description: Erro ao buscar gêneros.
 */
async function listarGeneros(req, res) {
  try {
    const generos = await prisma.genero.findMany();
    res.status(StatusCodes.OK).json(generos);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao buscar gêneros.' });
  }
}

module.exports = {
  criarGenero,
  listarGeneros
};
