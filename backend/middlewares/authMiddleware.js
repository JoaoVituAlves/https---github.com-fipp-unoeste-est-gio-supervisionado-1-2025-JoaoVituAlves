import jwt from 'jsonwebtoken';
import FuncionarioRepository from '../repositories/funcionarioRepository.js';
import ClienteRepository from '../repositories/clienteRepository.js';

const SEGREDO = "1BA1B2@@@@@&&&;;;;;;&&&B3C4D5";

export default class AuthMiddleware {

    gerarToken(id, nome, cpf, telefone, email, cargoId, tipoUsuario) {
        return jwt.sign({
            id, nome, cpf, telefone, email, cargoId, tipoUsuario
        }, SEGREDO, { expiresIn: '8h' });
    }

    async validar(req, res, next) {
        let { token } = req.cookies;
        if (!token) return res.status(401).json({ msg: "Token não fornecido!" });

        try {
            let dados = jwt.verify(token, SEGREDO);
            let auth = new AuthMiddleware();

            if (dados.tipoUsuario === "cliente") {
                let repo = new ClienteRepository();
                let cliente = await repo.obter(dados.id);
                if (cliente) {
                    let novoToken = auth.gerarToken(cliente.id, cliente.nome, cliente.cpf, cliente.telefone, cliente.email, null, "cliente");
                    res.cookie("token", novoToken, { httpOnly: true });
                    req.clienteLogado = cliente;
                    return next();
                }
            }

            if (dados.tipoUsuario === "funcionario") {
                let repo = new FuncionarioRepository();
                let funcionario = await repo.obter(dados.id);
                if (funcionario) {
                    let novoToken = auth.gerarToken(funcionario.id, funcionario.nome, funcionario.cpf, funcionario.telefone, funcionario.email, funcionario.id_cargo, "funcionario");
                    res.cookie("token", novoToken, { httpOnly: true });
                    req.funcionarioLogado = funcionario;
                    return next();
                }
            }

            return res.status(401).json({ msg: "Não autorizado!" });

        } catch (ex) {
            return res.status(401).json({ msg: "Token inválido ou expirado!" });
        }
    }
}