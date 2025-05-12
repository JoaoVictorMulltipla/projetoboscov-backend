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

/**
 * @swagger
 * /avaliacoes/{idUsuario}/{idFilme}:
 *   put:
 *     summary: Atualiza uma avaliação existente
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idFilme
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso.
 *       404:
 *         description: Avaliação não encontrada.
 *       400:
 *         description: Erro ao atualizar a avaliação.
 */
async function atualizarAvaliacao(req, res) {
  const { idUsuario, idFilme } = req.params;
  const { nota, comentario } = req.body;

  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: {
        idUsuario_idFilme: {
          idUsuario: Number(idUsuario),
          idFilme: Number(idFilme)
        }
      }
    });

    if (!avaliacao) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Avaliação não encontrada.' });
    }

    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: {
        idUsuario_idFilme: {
          idUsuario: Number(idUsuario),
          idFilme: Number(idFilme)
        }
      },
      data: { nota, comentario }
    });

    res.status(StatusCodes.OK).json(avaliacaoAtualizada);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao atualizar avaliação.' });
  }
}

/**
 * @swagger
 * /avaliacoes/{idUsuario}/{idFilme}:
 *   delete:
 *     summary: Deleta uma avaliação existente
 *     parameters:
 *       - name: idUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idFilme
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso.
 *       404:
 *         description: Avaliação não encontrada.
 *       400:
 *         description: Erro ao deletar a avaliação.
 */
async function deletarAvaliacao(req, res) {
  const { idUsuario, idFilme } = req.params;

  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: {
        idUsuario_idFilme: {
          idUsuario: Number(idUsuario),
          idFilme: Number(idFilme)
        }
      }
    });

    if (!avaliacao) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Avaliação não encontrada.' });
    }

    await prisma.avaliacao.delete({
      where: {
        idUsuario_idFilme: {
          idUsuario: Number(idUsuario),
          idFilme: Number(idFilme)
        }
      }
    });

    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao deletar avaliação.' });
  }
}

module.exports = {
  criarAvaliacao,
  listarAvaliacoes,
  atualizarAvaliacao,
  deletarAvaliacao
};
