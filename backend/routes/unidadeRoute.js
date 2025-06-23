import express from 'express';
import UnidadeController from '../controllers/unidadeController.js';
//import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new UnidadeController();
//let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Unidades']
    // #swagger.summary = 'Endpoint para retornar todos as unidades'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    //#swagger.tags = ['Unidades']
    //#swagger.summary = 'Cadastra uma unidade'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    //#swagger.tags = ['Unidades']
    //#swagger.summary = 'Retorna uma unidade baseado em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    //#swagger.tags = ['Unidades']
    //#swagger.summary = 'Altera uma unidade'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    //#swagger.tags = ['Unidades']
    //#swagger.summary = 'Deleta uma unidade'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

export default router;
