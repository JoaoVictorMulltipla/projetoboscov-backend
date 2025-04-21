const prisma = require('../prisma/prismaClient');
const { StatusCodes } = require('http-status-codes');

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Adiciona um novo usuário ao sistema com base nas informações fornecidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               data_nascimento:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *       400:
 *         description: Falha ao criar o usuário.
 */
async function criarUsuario(req, res) {
  const { nome, email, senha, data_nascimento, tipoUsuario = 'CLIENTE' } = req.body;

  if (!nome || !email || !senha || !data_nascimento) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Campos obrigatórios: nome, email, senha, data_nascimento.',
    });
  }

  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        data_nascimento: new Date(data_nascimento),
        tipoUsuario: tipoUsuario.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'CLIENTE',
      },
    });
    res.status(StatusCodes.CREATED).json(novoUsuario);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Erro ao criar usuário.',
      detalhes: error.message,
    });
  }
}


/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna todos os usuários
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *       400:
 *         description: Falha ao buscar usuários.
 */
async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.status(StatusCodes.OK).json(usuarios);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Erro ao buscar usuários.' });
  }
}

module.exports = {
  criarUsuario,
  listarUsuarios,
};
