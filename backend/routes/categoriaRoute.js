import express from 'express';
import CategoriaController from '../controllers/categoriaController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new CategoriaController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Categoria']
    // #swagger.summary = 'Endpoint para retornar todas as categorias'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    // #swagger.tags = ['Categoria']
    // #swagger.summary = 'Cadastra uma categoria'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Categoria']
    // #swagger.summary = 'Retorna uma categoria baseada em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    // #swagger.tags = ['Categoria']
    // #swagger.summary = 'Altera uma categoria'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Categoria']
    // #swagger.summary = 'Deleta uma categoria'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

export default router;
