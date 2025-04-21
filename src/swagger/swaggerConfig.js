module.exports = {
    openapi: "3.0.0",
    info: {
      title: "API Projeto Boscov",
      version: "1.0.0",
      description: "Documentação da API de usuários e filmes"
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local"
      }
    ],
    paths: {} // As rotas estão descritas diretamente nos controllers via JSDoc
  };
  