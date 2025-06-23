import express from 'express';
import routerFornecedores from './routes/fornecedorRoute.js';
import routerFuncionarios from './routes/funcionarioRoute.js'; 
import routerCliente from './routes/clienteRoute.js';
import routerCargos from './routes/cargoRoute.js';
import routerTipos from './routes/tipoRoute.js';
import routerCategorias from './routes/categoriaRoute.js'; 
import routerAutenticacao from './routes/autenticacaoRoute.js';
import routerProdutos from './routes/produtoRoute.js';
import routerPedidos from './routes/pedidoRoute.js';
import routerOrcamentos from './routes/orcamentoRoute.js';
import routerPagamentos from './routes/pagamentoRoute.js';
import routerUnidades from './routes/unidadeRoute.js';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import { createRequire } from 'module';
import cors from 'cors';

const require = createRequire(import.meta.url);
const outputJson = require('./swagger-output.json');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(outputJson));
app.use('/auth', routerAutenticacao);
app.use('/fornecedores', routerFornecedores);
app.use('/funcionarios', routerFuncionarios);
app.use('/cargos', routerCargos);
app.use('/tipos', routerTipos);
app.use('/categorias', routerCategorias); 
app.use('/clientes', routerCliente);
app.use('/produtos', routerProdutos);
app.use('/pedidos', routerPedidos);
app.use('/orcamentos', routerOrcamentos);
app.use('/pagamentos', routerPagamentos);
app.use('/unidades', routerUnidades);



app.listen(5000, function () {
    console.log('Servidor web em funcionamento!');
});