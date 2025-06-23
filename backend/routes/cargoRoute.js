import express from 'express';
import CargoController from '../controllers/cargoController.js';
//import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new CargoController();
//let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Cargo']
    // #swagger.summary = 'Endpoint para retornar todos os cargos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    //#swagger.tags = ['Cargo']
    //#swagger.summary = 'Cadastra um cargo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    //#swagger.tags = ['Cargo']
    //#swagger.summary = 'Retorna um cargo baseado em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    //#swagger.tags = ['Cargo']
    //#swagger.summary = 'Altera um cargo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    //#swagger.tags = ['Cargo']
    //#swagger.summary = 'Deleta um cargo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

export default router;
