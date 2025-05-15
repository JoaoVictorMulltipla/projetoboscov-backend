require("dotenv").config();
const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const JWT_SECRET = process.env.JWT_SECRET || "senha-temporaria";

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário
 *     description: Realiza o login com e-mail e senha, retornando um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Informe email e senha.",
    });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
      },
      JWT_SECRET,
      { expiresIn: "6h" }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;

    res.status(StatusCodes.OK).json({
      token,
      usuario: usuarioSemSenha,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Erro ao realizar login." });
  }
}

module.exports = {
  login,
};
