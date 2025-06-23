import express from 'express';
import PagamentoController from '../controllers/pagamentoController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new PagamentoController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Endpoint para retornar todos os pagamentos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gerarPagamento", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Efetua um novo pagamento'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/Pagamento" }
            }
        }
    } */
    ctrl.gerarPagamento(req, res);
});

router.post("/webhook", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Webhook para receber notificações do Mercado Pago'
    ctrl.webhook(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Retorna um pagamento baseado no ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Deleta um pagamento pelo ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

// Adicionar rota para gerar novo pagamento
router.post("/gerarNovoPagamento", (req, res) => {
    // #swagger.tags = ['Pagamento']
    // #swagger.summary = 'Endpoint para gerar novo pagamento para pedido editado'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gerarNovoPagamento(req, res);
});

export default router;