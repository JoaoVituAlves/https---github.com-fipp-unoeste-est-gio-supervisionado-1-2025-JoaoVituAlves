import express from 'express';
import TipoController from '../controllers/tipoController.js';
//import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new TipoController();
//let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Tipo']
    // #swagger.summary = 'Endpoint para retornar todos os tipos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    //#swagger.tags = ['Tipo']
    //#swagger.summary = 'Cadastra um tipo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    //#swagger.tags = ['Tipo']
    //#swagger.summary = 'Retorna um tipo baseado em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    //#swagger.tags = ['Tipo']
    //#swagger.summary = 'Altera um tipo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    //#swagger.tags = ['Tipo']
    //#swagger.summary = 'Deleta um tipo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

export default router;
