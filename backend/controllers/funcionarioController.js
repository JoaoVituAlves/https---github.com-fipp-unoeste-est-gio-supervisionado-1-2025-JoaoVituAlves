import FuncionarioEntity from "../entities/funcionarioEntity.js";
import FuncionarioRepository from "../repositories/funcionarioRepository.js";
import { validarDataAdmissao, validarSalario, validarCPF, validarEmail, validarTelefone, validarStatus, validarSenhas, formatarCPF, formatarTelefone, validarNovasSenhas, validarSenhasRedefinidas, validarSenha, validarNovaSenha } from "../utils/funcionarioValidacao.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { enviarEmailRecuperacao } from "../utils/emailService.js";

export default class FuncionarioController {

    async listar(req, res) {
        try {
            let repo = new FuncionarioRepository();
            let lista = await repo.listar();
            if (lista != null && lista != "") {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhum funcionário cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new FuncionarioRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Funcionário não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let { nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha, confmSenha } = req.body;

            if (nome && cpf && telefone && email && data_admissao && id_cargo && status && id_tipo && senha) {

                // Validações antes de continuar
                if (!validarDataAdmissao(data_admissao)) {
                    return res.status(400).json({ msg: "Data de admissão inválida (não pode ser no futuro)" });
                }
                if (!validarSalario(salario)) {
                    return res.status(400).json({ msg: "Salário inválido (deve ser um número positivo e maior que zero)" });
                }
                if (!validarCPF(cpf)) {
                    return res.status(400).json({ msg: "CPF inválido" });
                }
                cpf = formatarCPF(cpf);
                if (!validarTelefone(telefone)) {
                    return res.status(400).json({ msg: "Telefone inválido (deve conter 10 ou 11 números)" });
                }
                telefone = formatarTelefone(telefone);
                if (!validarEmail(email)) {
                    return res.status(400).json({ msg: "E-mail inválido" });
                }
                if (!validarStatus(status)) {
                    return res.status(400).json({ msg: "Status inválido (deve ser 0 - Inativo ou 1 - Ativo)" });
                }
                if (!validarSenha(senha)) {
                    return res.status(400).json({ msg: "Senha inválida! Deve conter pelo menos 6 caracteres, 1 maiúsculo e 1 especial" });
                }
                if (!validarSenhas(senha, confmSenha)) {
                    return res.status(400).json({ msg: "A confirmação da senha não é igual à senha cadastrada" });
                }    

                const senhaHash = await bcrypt.hash(senha, 10);
                let entidade = new FuncionarioEntity(0, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senhaHash);
                let repo = new FuncionarioRepository();

                let existeCpf = await repo.buscarPorCpf(cpf);
                if (existeCpf) {
                    return res.status(400).json({ msg: "Já existe um cadastro com esse CPF" });
                }
                
                let existeEmail = await repo.buscarPorEmail(email);
                if (existeEmail) {
                    return res.status(400).json({ msg: "Já existe um cadastro com esse E-mail" });
                }                

                let result = await repo.gravar(entidade);

                if (result) {
                    res.status(201).json({ msg: "Funcionário cadastrado com sucesso!" });
                } else {
                    throw new Error("Erro ao inserir funcionário no banco de dados");
                }
            } else {
                res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async alterar(req, res) {
        try {
            let { id, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo } = req.body;

            if (id && nome && cpf && telefone && email && data_admissao && id_cargo && status && id_tipo ) {

                // Validações antes de continuar
                if (!validarDataAdmissao(data_admissao)) {
                    return res.status(400).json({ msg: "Data de admissão inválida (não pode ser no futuro)" });
                }
                if (!validarSalario(salario)) {
                    return res.status(400).json({ msg: "Salário inválido (deve ser um número positivo e maior que zero)" });
                }
                if (!validarCPF(cpf)) {
                    return res.status(400).json({ msg: "CPF inválido" });
                }
                cpf = formatarCPF(cpf);
                if (!validarTelefone(telefone)) {
                    return res.status(400).json({ msg: "Telefone inválido (deve conter 10 ou 11 números)" });
                }
                telefone = formatarTelefone(telefone);
                if (!validarEmail(email)) {
                    return res.status(400).json({ msg: "E-mail inválido" });
                }
                if (!validarStatus(status)) {
                    return res.status(400).json({ msg: "Status inválido (deve ser 0 - Inativo ou 1 - Ativo)" });
                }  
                
                let repo = new FuncionarioRepository();
                let funcionarioAtual = await repo.obter(id);
                let senha = funcionarioAtual.senha;
                let entidade = new FuncionarioEntity(id, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha);

                if(cpf != funcionarioAtual.cpf) {
                    let existeCpf = await repo.buscarPorCpf(cpf);
                    if (existeCpf) {
                        return res.status(400).json({ msg: "Já existe um cadastro com esse CPF" });
                    }
                }

                if(email != funcionarioAtual.email) {
                    let existeEmail = await repo.buscarPorEmail(email);
                    if (existeEmail) {
                        return res.status(400).json({ msg: "Já existe um cadastro com esse E-mail" });
                    }  
                }

                if (await repo.obter(id)) {
                    let result = await repo.alterar(entidade);

                    if (result) {
                        res.status(200).json({ msg: "Alteração realizada com sucesso!" });
                    } else {
                        throw new Error("Erro ao executar a atualização no banco de dados");
                    }
                } else {
                    res.status(404).json({ msg: "Funcionário não encontrado para alteração" });
                }
            } else {
                res.status(400).json({ msg: "Informe os parâmetros corretamente!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async alterarParcialmente(req, res) {
        try {
            let { id, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha } = req.body;

            if (id && (nome || cpf || telefone || email || data_admissao || id_cargo || salario || status || id_tipo || senha)) {
                let entidade = new FuncionarioEntity(id, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha);
                let repo = new FuncionarioRepository();
                let result = await repo.alteracaoParcial(entidade);

                if (result) {
                    res.status(200).json({ msg: "Alteração parcial realizada com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a atualização no banco de dados");
                }
            } else {
                res.status(400).json({ msg: "Parâmetros insuficientes para alteração parcial!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async criarNovaSenha(req, res) {
        try {
            let { id, senhaAtual, novaSenha, confmNovaSenha } = req.body;

            if (id && (senhaAtual || novaSenha)) {
                if (!validarNovaSenha(novaSenha)) {
                    return res.status(400).json({ msg: "Nova senha inválida! Deve conter pelo menos 6 caracteres, 1 maiúsculo e 1 especial" });
                }
                if (!validarNovasSenhas(novaSenha, confmNovaSenha)) {
                    return res.status(400).json({ msg: "A confirmação da nova senha não é igual à nova senha cadastrada" });
                }

                let repo = new FuncionarioRepository();
                let funcionario = await repo.obter(id);

                if (!funcionario) {
                    return res.status(404).json({ msg: "Funcionário não encontrado!" });
                }

                // Comparar senha atual com hash
                const senhaConfere = await bcrypt.compare(senhaAtual, funcionario.senha);
                if (!senhaConfere) {
                    return res.status(403).json({ msg: "Senha atual incorreta!" });
                }

                // Gerar hash da nova senha
                const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
                let result = await repo.criarNovaSenha(novaSenhaHash, id);

                if (result) {
                    res.status(200).json({ msg: "Nova senha atualizada com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a atualização no banco de dados");
                }
            } else {
                res.status(400).json({ msg: "Parâmetros insuficientes para alteração de nova senha!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async inativar(req, res) {
        try {
            let { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ msg: "ID do funcionário é obrigatório!" });
            }
    
            let repo = new FuncionarioRepository();
            let funcionario = await repo.obter(id);
            if(funcionario) {
                let linhasAfetadas = await repo.inativar(id);
    
                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Funcionário inativado com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Funcionário já está inativo!" });
                }
            }
            else {
                return res.status(404).json({ msg: "Funcionário não encontrado para inativação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    } 
    
    async reativar(req, res) {
        try {
            let { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ msg: "ID do funcionário é obrigatório!" });
            }
    
            let repo = new FuncionarioRepository();
            let funcionario = await repo.obter(id);
            if(funcionario) {
                let linhasAfetadas = await repo.reativar(id);
    
                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Funcionário reativado com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Funcionário já está ativo!" });
                }
            }
            else {
                return res.status(404).json({ msg: "Funcionário não encontrado para reativação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    } 

    async deletar(req, res) {
        try {
            let { id } = req.params;
            let repo = new FuncionarioRepository();

            if (await repo.obter(id)) {
                let result = await repo.deletar(id);

                if (result) {
                    res.status(200).json({ msg: "Funcionário deletado com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a deleção no banco de dados");
                }
            } else {
                res.status(404).json({ msg: "Funcionário não encontrado para deleção" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async recuperarSenha(req, res) {
        const { email } = req.body;
    
        try {
            const repo = new FuncionarioRepository();
            const funcionario = await repo.buscarPorEmail(email);

            if (!funcionario) {
                return res.status(404).json({ erro: 'Funcionário não encontrado' });
            }
    
            const token = crypto.randomBytes(32).toString('hex');
            const validade = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validade

            const tokenValido = await repo.buscarTokenValidoPorFuncionario(funcionario.id);
            if (tokenValido) {
                return res.status(400).json({ erro: 'Já foi enviado um e-mail de recuperação. Aguarde ele expirar para solicitar outro.' });
            }            
    
            await repo.salvarTokenReset(funcionario.id, token, validade);
            await enviarEmailRecuperacao(email, token);
    
            res.json({ mensagem: 'E-mail enviado com sucesso!' });
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }    

    async redefinirSenha(req, res) {
        const { token, novaSenha, confmNovaSenha } = req.body;

        try {
            if (token && novaSenha && confmNovaSenha) {
                if (!validarNovaSenha(novaSenha)) {
                    return res.status(400).json({ msg: "Nova senha inválida! Deve conter pelo menos 6 caracteres, 1 maiúsculo e 1 especial" });
                }
                if (!validarSenhasRedefinidas(novaSenha, confmNovaSenha)) {
                    return res.status(400).json({ msg: "A confirmação da senha não é igual à senha informada!" });
                }

                let repo = new FuncionarioRepository();
                let funcionario = await repo.buscarPorToken(token);

                if (!funcionario || new Date(funcionario.validade_token) < new Date()) {
                    return res.status(400).json({ erro: 'Token inválido ou expirado' });
                }

                // Gerar hash da nova senha
                const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

                // Atualiza a senha no banco de dados
                await repo.alterarSenha(novaSenhaHash, funcionario.id);

                // Limpa o token de recuperação
                await repo.removerToken(funcionario.id);

                res.json({ mensagem: 'Senha redefinida com sucesso!' });
            } else {
                res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

}