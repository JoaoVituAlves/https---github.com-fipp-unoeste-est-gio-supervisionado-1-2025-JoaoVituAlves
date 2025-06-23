import express from 'express';
import ClienteController from '../controllers/clienteController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new ClienteController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Endpoint para retornar todos os clientes'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Cadastra um cliente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Retorna um cliente baseado em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.get("/top-pedidos", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Endpoint para listar clientes com mais pedidos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listarTopClientesPedidos(req, res);
});

router.put("/alterar", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Altera um cliente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.patch("/alteracao-parcial", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Altera parcialmente um cliente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterarParcialmente(req, res);
});

router.patch("/nova-senha", (req, res) => {
    //#swagger.tags = ['Cliente']
    //#swagger.summary = 'Rota para criação de uma nova senha a partir da senha antiga'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.criarNovaSenha(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Deleta um cliente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

router.post("/recuperar-senha", (req, res) => {
    //#swagger.tags = ['Cliente']
    //#swagger.summary = 'Rota para recuperar senha via token'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.recuperarSenha(req, res);
});

router.post("/redefinir-senha", (req, res) => {
    //#swagger.tags = ['Cliente']
    //#swagger.summary = 'Rota para redefinir senha via token'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.redefinirSenha(req, res);
});

router.patch("/ativar", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Deixa o cliente ativo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.ativar(req, res);
});

router.patch("/inativar", (req, res) => {
    // #swagger.tags = ['Cliente']
    // #swagger.summary = 'Deixa o cliente inativo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.inativar(req, res);
});

export default router;