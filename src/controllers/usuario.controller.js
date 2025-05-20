const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

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
  const {
    nome,
    email,
    senha,
    data_nascimento,
    apelido,
    tipoUsuario = "CLIENTE",
  } = req.body;

  if (!nome || !email || !senha || !data_nascimento) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Campos obrigatórios: nome, email, senha, data_nascimento.",
    });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaCriptografada,
        data_nascimento: new Date(data_nascimento),
        apelido,
        tipoUsuario:
          tipoUsuario.toUpperCase() === "ADMIN" ? "ADMIN" : "CLIENTE",
      },
    });

    const token = jwt.sign(
      {
        id: novoUsuario.id,
        email: novoUsuario.email,
        tipoUsuario: novoUsuario.tipoUsuario,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(StatusCodes.CREATED).json({
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        tipoUsuario: novoUsuario.tipoUsuario,
        apelido: novoUsuario.apelido,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Erro ao criar usuário.",
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
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Erro ao buscar usuários." });
  }
}

/**
 * @swagger
 * /usuarios/{id}:
 *   patch:
 *     summary: Atualiza um usuário existente
 *     description: Permite que o usuário atualize seu nome, apelido e senha.
 *     parameters:
 *       - in: path
 *         name: id
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
 *               nome:
 *                 type: string
 *               apelido:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, apelido, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(id) },
    });
    if (!usuario) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Usuário não encontrado." });
    }

    const dadosAtualizados = {
      nome: nome || usuario.nome,
      apelido: apelido || usuario.apelido,
    };

    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosAtualizados,
    });

    res.status(StatusCodes.OK).json(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Erro ao atualizar o usuário.",
      detalhes: error.message,
    });
  }
}

/**
 * @swagger
 * /usuarios/{id}/desativar:
 *   patch:
 *     summary: Desativa um usuário (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário desativado com sucesso.
 *       404:
 *         description: Usuário não encontrado.
 */
async function desativarUsuario(req, res) {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    if (!usuario) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Usuário não encontrado." });
    }

    const atualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { status: false }
    });

    res.status(StatusCodes.OK).json({ mensagem: "Usuário desativado com sucesso.", usuario: atualizado });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Erro ao desativar o usuário.",
      detalhes: error.message,
    });
  }
}

module.exports = {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  desativarUsuario
};
