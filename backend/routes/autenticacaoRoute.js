import express from 'express';
import AutenticacaoController from '../controllers/autenticacaoController.js';

const router = express.Router();

let ctrl = new AutenticacaoController();
router.post("/token", (req, res) => {
    // #swagger.tags = ['Autenticacao']
    ctrl.token(req, res);
});
router.get("/logout", (req, res) => {
    // #swagger.tags = ['Autenticacao']
    ctrl.logout(req, res);
});
router.get("/verificar-token", (req, res) => {
    // #swagger.tags = ['Autenticacao']
    ctrl.verificar(req, res);
});

export default router;