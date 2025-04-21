const prisma = require('../prisma/prismaClient');
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     summary: Cria uma nova avaliação de filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUsuario:
 *                 type: integer
 *               idFilme:
 *                 type: integer
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso.
 *       400:
 *         description: Erro ao criar a avaliação.
 */
async function criarAvaliacao(req, res) {
  try {
    const avaliacao = await prisma.avaliacao.create({
      data: req.body
    });
    res.status(StatusCodes.CREATED).json(avaliacao);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao criar avaliação.' });
  }
}

/**
 * @swagger
 * /avaliacoes:
 *   get:
 *     summary: Lista todas as avaliações
 *     responses:
 *       200:
 *         description: Lista de avaliações.
 *       400:
 *         description: Erro ao buscar avaliações.
 */
async function listarAvaliacoes(req, res) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        usuario: true,
        filme: true
      }
    });
    res.status(StatusCodes.OK).json(avaliacoes);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao buscar avaliações.' });
  }
}

module.exports = {
  criarAvaliacao,
  listarAvaliacoes
};
