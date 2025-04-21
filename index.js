const express = require('express');
const swaggerUi = require('swagger-ui-express');

const swaggerDocs = require('./src/swagger/swaggerConfig');
const usuarioRoutes = require('./src/routes/usuario.routes');
const filmeRoutes = require('./src/routes/filme.routes');
const generoRoutes = require('./src/routes/genero.routes');
const avaliacaoRoutes = require('./src/routes/avaliacao.routes');

const app = express();
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/filmes', filmeRoutes);
app.use('/generos', generoRoutes);
app.use('/avaliacoes', avaliacaoRoutes);

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
