import express from 'express';
import ProdutoController from '../controllers/produtoController.js';
// import AuthMiddleware from '../middlewares/authMiddleware.js';
import Multer from 'multer';

const router = express.Router();

let upload = Multer(); 
let ctrl = new ProdutoController();
// let auth = new AuthMiddleware();

router.get("/listar", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Endpoint para retornar todos os produtos'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.listar(req, res);
});

router.post("/gravar", upload.array("imagens", 5), (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Cadastra um novo produto'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/produtoModel"
                    }  
                }
            }
        } 
    */
    ctrl.gravar(req, res);
});

router.get("/obter/:id", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Retorna um produto baseado no ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.obter(req, res);
});

router.put("/alterar", upload.array("imagens", 5), (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Altera um produto completamente'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/produtoModel"
                    }  
                }
            }
        } 
    */
    ctrl.alterar(req, res);
});

router.patch("/alterar-parcial", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Altera parcialmente um produto'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.alterarParcialmente(req, res);
});

router.delete("/deletar/:id", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Deleta um produto pelo ID'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.deletar(req, res);
});

router.patch("/visivel", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Deixa o produto visível na vitrine'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.visivel(req, res);
});

router.patch("/oculto", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Deixa o produto oculto na vitrine'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.oculto(req, res);
});

router.patch("/ativar", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Deixa o produto ativo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.ativar(req, res);
});

router.patch("/inativar", (req, res) => {
    // #swagger.tags = ['Produto']
    // #swagger.summary = 'Deixa o produto inativo'
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    ctrl.inativar(req, res);
});

export default router;