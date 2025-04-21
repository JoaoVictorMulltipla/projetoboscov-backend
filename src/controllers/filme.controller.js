const prisma = require('../prisma/prismaClient');
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * /filmes:
 *   post:
 *     summary: Cria um novo filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               diretor:
 *                 type: string
 *               anoLancamento:
 *                 type: integer
 *               generoId:
 *                 type: integer
 *               duracao:
 *                 type: integer
 *               produtora:
 *                 type: string
 *               classificacao:
 *                 type: string
 *               poster:
 *                 type: string
 *     responses:
 *       201:
 *         description: Filme criado com sucesso.
 *       400:
 *         description: Erro ao criar o filme.
 */
async function criarFilme(req, res) {
  try {
    const filme = await prisma.filme.create({
      data: req.body
    });
    res.status(StatusCodes.CREATED).json(filme);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao criar filme.' });
  }
}

/**
 * @swagger
 * /filmes:
 *   get:
 *     summary: Lista todos os filmes
 *     responses:
 *       200:
 *         description: Lista de filmes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao buscar filmes.
 */
async function listarFilmes(req, res) {
  try {
    const filmes = await prisma.filme.findMany({
      include: { genero: true }
    });
    res.status(StatusCodes.OK).json(filmes);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao buscar filmes.' });
  }
}

module.exports = {
  criarFilme,
  listarFilmes
};
