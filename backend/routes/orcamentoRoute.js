import express from 'express';
import OrcamentoController from '../controllers/orcamentoController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new OrcamentoController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Orçamento']
    // #swagger.summary = 'Endpoint para retornar todos os orçamentos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    // #swagger.tags = ['Orçamento']
    // #swagger.summary = 'Cadastra um novo orçamento'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/OrcamentoCompleto" }
            }
        }
    } */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Orçamento']
    // #swagger.summary = 'Retorna um orçamento baseado no ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    // #swagger.tags = ['Orçamento']
    // #swagger.summary = 'Altera um orçamento completamente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
       /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/OrcamentoCompleto" }
            }
        }
    } */
    ctrl.alterar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Orçamento']
    // #swagger.summary = 'Deleta um orçamento pelo ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

export default router;
