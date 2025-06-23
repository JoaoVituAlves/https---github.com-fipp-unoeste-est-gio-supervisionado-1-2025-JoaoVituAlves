import express from 'express';
import FuncionarioController from '../controllers/funcionarioController.js';
//import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

let ctrl = new FuncionarioController();
//let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Funcionário']
    // #swagger.summary = 'Endpoint para retornar todos os funcionários'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Cadastra um funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Retorna um funcionário baseado em um código'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Altera um funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterar(req, res);
});

router.patch("/parcial", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Realiza a alteração parcial do funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterarParcialmente(req, res);
});

router.patch("/nova-senha", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Rota para criação de uma nova senha a partir da senha antiga'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.criarNovaSenha(req, res);
});

router.patch("/inativar", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Realiza a inativação de um funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.inativar(req, res);
});

router.patch("/reativar", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Realiza a reativação de um funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.reativar(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Deleta um funcionário'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

router.post("/recuperar-senha", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Rota para recuperar senha via token'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.recuperarSenha(req, res);
});

router.post("/redefinir-senha", (req, res) => {
    //#swagger.tags = ['Funcionário']
    //#swagger.summary = 'Rota para redefinir senha via token'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.redefinirSenha(req, res);
});

export default router;
