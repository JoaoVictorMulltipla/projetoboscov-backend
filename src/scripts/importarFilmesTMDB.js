require('dotenv').config();
const axios = require('axios');
const prisma = require('../prisma/prismaClient');

const TMDB_API_KEY = 'da90c988a1ef9be143183c320a171bfc';
const TOTAL_FILMES = 50;

async function buscarFilmesDaTMDB() {
  const filmes = [];
  let pagina = 1;

  while (filmes.length < TOTAL_FILMES) {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&region=BR`, {
      params: {
        api_key: TMDB_API_KEY,
        page: pagina
      }
    });

    filmes.push(...data.results);
    pagina++;
  }

  return filmes.slice(0, TOTAL_FILMES);
}

async function importarFilmes() {
  const filmesTMDB = await buscarFilmesDaTMDB();

  const promessas = filmesTMDB.map(async (tmdb) => {
    try {
      const detalhes = await axios.get(`https://api.themoviedb.org/3/movie/${tmdb.id}`, {
        params: {
          api_key: TMDB_API_KEY,
          language: 'pt-BR',
          append_to_response: 'credits'
        }
      });

      const info = detalhes.data;

      const generosDoFilme = [];

      for (const g of info.genres) {
        let genero = await prisma.genero.findFirst({
          where: { descricao: g.name }
        });

        if (!genero) {
          genero = await prisma.genero.create({
            data: { descricao: g.name }
          });
        }

        generosDoFilme.push(genero);
      }

      const diretor = info.credits.crew.find(p => p.job === 'Director')?.name || 'Desconhecido';

      const filmeCriado = await prisma.filme.create({
        data: {
          nome: info.title,
          diretor: diretor,
          anoLancamento: parseInt(info.release_date?.split('-')[0]) || 2000,
          generoId: generosDoFilme[0]?.id ?? null,
          duracao: info.runtime || 100,
          produtora: info.production_companies[0]?.name || 'Desconhecida',
          classificacao: info.adult ? '18+' : 'Livre',
          poster: `https://image.tmdb.org/t/p/w500${info.poster_path}`
        }
      });

      for (const genero of generosDoFilme) {
        await prisma.generoFilme.create({
          data: {
            idFilme: filmeCriado.id,
            idGenero: genero.id
          }
        });
      }

      console.log(`✅ Filme importado: ${info.title}`);

    } catch (error) {
      console.error(`❌ Erro ao importar filme ${tmdb.title}:`, error.message);
    }
  });

  // Executa todas as importações em paralelo
  await Promise.all(promessas);

  console.log('✅ Importação finalizada!');
}

importarFilmes()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
