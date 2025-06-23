import express from 'express';
import PedidoController from '../controllers/pedidoController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new PedidoController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Endpoint para retornar todos os pedidos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Cadastra um novo pedido'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/PedidoCompleto" }
            }
        }
    } */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Retorna um pedido baseado no ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Altera um pedido completamente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.atualizarPedido(req, res);
});

router.patch("/alterar-parcial", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Altera parcialmente um pedido'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterarParcialmente(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Deleta um pedido pelo ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

// Adicionar novas rotas para a funcionalidade "Meus Pedidos"

// Listar pedidos de um cliente
router.get("/cliente/:id_cliente", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Endpoint para listar pedidos de um cliente específico'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarPorCliente(req, res);
});

// Obter detalhes de um pedido
router.get("/detalhes/:id", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Endpoint para obter detalhes de um pedido específico'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.detalhesPedido(req, res);
});

// Cancelar um pedido
router.put("/cancelar/:id", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Endpoint para cancelar um pedido'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.cancelarPedido(req, res);
});

// Atualizar um pedido
router.put("/atualizar/:id", (req, res) => {
    // #swagger.tags = ['Pedido']
    // #swagger.summary = 'Endpoint para atualizar um pedido'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/PedidoCompleto" }
            }
        }
    } */
    ctrl.atualizarPedido(req, res);
});

export default router;