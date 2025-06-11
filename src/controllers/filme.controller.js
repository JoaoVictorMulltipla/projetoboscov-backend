const prisma = require("../prisma/prismaClient");
const { StatusCodes } = require("http-status-codes");

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
      data: req.body,
    });
    res.status(StatusCodes.CREATED).json(filme);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Erro ao criar filme." });
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
      include: { genero: true },
    });
    res.status(StatusCodes.OK).json(filmes);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Erro ao buscar filmes." });
  }
}

/**
 * @swagger
 * /filmes/{id}:
 *   put:
 *     summary: Atualiza um filme existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme a ser atualizado
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
 *       200:
 *         description: Filme atualizado com sucesso.
 *       400:
 *         description: Erro ao atualizar filme.
 *       404:
 *         description: Filme não encontrado.
 */
async function atualizarFilme(req, res) {
  const { id } = req.params;

  try {
    const filmeExistente = await prisma.filme.findUnique({
      where: { id: Number(id) },
    });

    if (!filmeExistente) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Filme não encontrado." });
    }

    const filmeAtualizado = await prisma.filme.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.status(StatusCodes.OK).json(filmeAtualizado);
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Erro ao atualizar filme." });
  }
}

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     summary: Busca um filme pelo ID com avaliações e usuários das avaliações
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do filme a ser buscado
 *     responses:
 *       200:
 *         description: Filme encontrado com avaliações e usuários.
 *       404:
 *         description: Filme não encontrado.
 *       400:
 *         description: Erro na requisição.
 */
async function buscarFilmePorId(req, res) {
  const { id } = req.params;

  try {
    const filme = await prisma.filme.findUnique({
      where: { id: Number(id) },
      include: {
        genero: true,
        avaliacoes: {
          include: {
            usuario: true,
          },
        },
      },
    });

    if (!filme) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Filme não encontrado." });
    }

    res.status(StatusCodes.OK).json(filme);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Erro ao buscar filme." });
  }
}

module.exports = {
  criarFilme,
  listarFilmes,
  atualizarFilme,
  buscarFilmePorId,
};
