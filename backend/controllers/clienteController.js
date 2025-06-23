import ClienteEntity from "../entities/clienteEntity.js";
import ClienteRepository from "../repositories/clienteRepository.js";
import { formatarCPF, validarEmail, validarNome, validarCPF, validarTelefone, formatarTelefone, validarSenha, validarSenhas, validarCNPJ, formatarCNPJ, validarInscricaoEstadual, validarCep, validarRua, validarBairro, validarCidade, validarNumeroEndereco, validarNovaSenha, validarNovasSenhas, validarSenhasRedefinidas } from "../utils/clienteValidacao.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { enviarEmailRecuperacao } from "../utils/emailService.js";

export default class ClienteController {

    async listar(req, res) {
        try {
            let repo = new ClienteRepository();
            let lista = await repo.listar();
            if (lista && lista.length > 0) {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhum cliente cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new ClienteRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Cliente não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async listarTopClientesPedidos(req, res) {
        try {
            const repo = new ClienteRepository();
            const lista = await repo.listarTopClientesPedidos();

            if (lista && lista.length > 0) {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhum pedido cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let {
                nome, email, cpf, telefone, senha, confmSenha, tipo,
                cnpj, razao_social, insc_estadual,
                cep, rua, bairro, cidade, numero
            } = req.body;
    
            if (tipo == null || tipo <= 0 || tipo >= 3) {
                return res.status(400).json({ msg: "Tipo inválido!" });
            }
    
            // Verificação para Pessoa Física
            if (tipo == 1) {
                if (!nome || !email || !cpf || !telefone || !senha || !cep || !rua || !bairro || !cidade || !numero) {
                    return res.status(400).json({ msg: "Parâmetros obrigatórios não informados para Pessoa Física!" });
                }
            }
    
            // Verificação para Pessoa Jurídica
            if (tipo == 2) {
                if (!nome || !email || !cpf || !telefone || !senha || !cnpj || !razao_social || !insc_estadual || !cep || !rua || !bairro || !cidade || !numero) {
                    return res.status(400).json({ msg: "Parâmetros obrigatórios não informados para Pessoa Jurídica!" });
                }
            }

            // Validações antes de continuar
            if (!validarNome(nome)) {
                return res.status(400).json({ msg: "Nome inválido! Apenas letras" });
            }
            if(!validarEmail(email)) {
                return res.status(400).json({ msg: "E-mail inválido! Formato (email@exemplo.com)" });
            }
            if(!validarCPF(cpf)) {
                return res.status(400).json({ msg: "CPF inválido! Formato (000.000.000-00) ou (00000000000)" });
            }
            cpf = formatarCPF(cpf);
            if (!validarTelefone(telefone)) {
                return res.status(400).json({ msg: "Telefone inválido (deve conter 10 ou 11 números)" });
            }
            telefone = formatarTelefone(telefone);
            if(!validarSenha(senha)) {
                return res.status(400).json({ msg: "Senha inválida! Deve conter pelo menos 6 caracteres, 1 maiúsculo e 1 especial" });
            }
            if (!validarSenhas(senha, confmSenha)) {
                return res.status(400).json({ msg: "A confirmação da senha não é igual à senha cadastrada" });
            } 
            if (tipo == 1) {
                cnpj = "";
                razao_social = "";
                insc_estadual = "";
            }
            if(tipo == 2) {
                if (!validarCNPJ(cnpj)) {
                    return res.status(400).json({ msg: "CNPJ inválido! Formato (00.000.000/0001-00)" });
                } 
                cnpj = formatarCNPJ(cnpj);
                if (!validarInscricaoEstadual(insc_estadual)) {
                    return res.status(400).json({ msg: "Inscrição Estadual inválida! Apenas números" });
                } 
            }
            if (!validarCep(cep)) {
                return res.status(400).json({ msg: "CEP inválido! Apenas números" });
            } 
            if (!validarRua(rua)) {
                return res.status(400).json({ msg: "Rua inválida! Apenas letras" });
            } 
            if (!validarBairro(bairro)) {
                return res.status(400).json({ msg: "Bairro inválido! Apenas letras" });
            } 
            if (!validarCidade(cidade)) {
                return res.status(400).json({ msg: "Cidade inválida! Apenas letras" });
            } 
            if (!validarNumeroEndereco(numero) || numero == 0) {
                return res.status(400).json({ msg: "Número inválido! Não pode conter letras ou ser menor ou igual a zero" });
            } 
            let status = 1;
            const hashSenha = await bcrypt.hash(senha, 10);
            let entidade = new ClienteEntity(
                0, nome, email, cpf, telefone, hashSenha, tipo,
                cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero, status
            );
    
            let repo = new ClienteRepository();
            let jaExiste = await repo.buscarCpfCnpjGravar(cpf, cnpj);
            if (jaExiste) {
                return res.status(400).json({ msg: "Já existe um cadastro com esse CPF ou CNPJ!" });
            }

            let existeEmail = await repo.buscarEmail(email);
            if(existeEmail) {
                return res.status(400).json({ msg: "Já existe um cadastro com esse E-mail!" });
            }
    
            let result = await repo.gravar(entidade);
    
            if (result) {
                return res.status(201).json({ msg: "Cliente cadastrado com sucesso!" });
            } else {
                throw new Error("Erro ao inserir cliente no banco de dados");
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }    

    async alterar(req, res) {
        try {
            let { id, nome, email, cpf, telefone, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero } = req.body;

            if (tipo == null || tipo <= 0 || tipo >= 3) {
                return res.status(400).json({ msg: "Tipo inválido!" });
            }
    
            // Verificação para Pessoa Física
            if (tipo == 1) {
                if (!nome || !email || !cpf || !telefone || !cep || !rua || !bairro || !cidade || !numero ) {
                    return res.status(400).json({ msg: "Parâmetros obrigatórios não informados para Pessoa Física!" });
                }
            }
    
            // Verificação para Pessoa Jurídica
            if (tipo == 2) {
                if (!nome || !email || !cpf || !telefone || !cnpj || !razao_social || !insc_estadual || !cep || !rua || !bairro || !cidade || !numero ) {
                    return res.status(400).json({ msg: "Parâmetros obrigatórios não informados para Pessoa Jurídica!" });
                }
            }

            // Validações antes de continuar
            if (!validarNome(nome)) {
                return res.status(400).json({ msg: "Nome inválido! Apenas letras" });
            }
            if(!validarEmail(email)) {
                return res.status(400).json({ msg: "E-mail inválido! Formato (email@exemplo.com)" });
            }
            if(!validarCPF(cpf)) {
                return res.status(400).json({ msg: "CPF inválido! Formato (000.000.000-00) ou (00000000000)" });
            }
            cpf = formatarCPF(cpf);
            if(!validarTelefone(telefone)) {
                return res.status(400).json({ msg: "Telefone inválido! Formato ((00) 00000-0000) ou ((00) 0000-0000)" });
            }
            telefone = formatarTelefone(telefone);
            if (tipo == 1) {
                cnpj = "";
                razao_social = "";
                insc_estadual = "";
            }
            if(tipo == 2) {
                if (!validarCNPJ(cnpj)) {
                    return res.status(400).json({ msg: "CNPJ inválido! Formato (00.000.000/0001-00)" });
                } 
                cnpj = formatarCNPJ(cnpj);
                if (!validarInscricaoEstadual(insc_estadual)) {
                    return res.status(400).json({ msg: "Inscrição Estadual inválida! Apenas números" });
                } 
            }
            if (!validarCep(cep)) {
                return res.status(400).json({ msg: "CEP inválido! Apenas números" });
            } 
            if (!validarRua(rua)) {
                return res.status(400).json({ msg: "Rua inválida! Apenas letras" });
            } 
            if (!validarBairro(bairro)) {
                return res.status(400).json({ msg: "Bairro inválido! Apenas letras" });
            } 
            if (!validarCidade(cidade)) {
                return res.status(400).json({ msg: "Cidade inválida! Apenas letras" });
            } 
            if (!validarNumeroEndereco(numero) || numero == 0) {
                return res.status(400).json({ msg: "Número inválido! Não pode conter letras ou ser menor ou igual a zero" });
            } 
            let status = 1;

            let repo = new ClienteRepository();
            let clienteAtual = await repo.obter(id);
            let senha = clienteAtual.senha;
            let entidade = new ClienteEntity(id, nome, email, cpf, telefone, senha, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero, status);

            if(cpf != clienteAtual.cpf || (cnpj && cnpj != clienteAtual.cnpj) ) {
                let jaExiste = await repo.buscarCpfCnpj(cpf, cnpj, id);
                if (jaExiste) {
                    return res.status(400).json({ msg: "Já existe um cadastro com esse CPF ou CNPJ!" });
                }
            }

            if(email != clienteAtual.email) {
                let existeEmail = await repo.buscarEmail(email);
                if(existeEmail) {
                    return res.status(400).json({ msg: "Já existe um cadastro com esse E-mail!" });
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
                res.status(404).json({ msg: "Cliente não encontrado para alteração" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async alterarParcialmente(req, res) {
        try {
            let { id, nome, email, cpf, telefone, senha, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero } = req.body;

            if (id && (nome || email || cpf || telefone || senha || tipo != null || cnpj || razao_social || insc_estadual || cep || rua || bairro || cidade || numero )) {
                let entidade = new ClienteEntity(id, nome, email, cpf, telefone, senha, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero);
                let repo = new ClienteRepository();
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
    
                let repo = new ClienteRepository();
                let cliente = await repo.obter(id);

                if (!cliente) {
                    return res.status(404).json({ msg: "Funcionário não encontrado!" });
                }
                const senhaConfere = await bcrypt.compare(senhaAtual, cliente.senha);
                if (!senhaConfere) {
                    return res.status(403).json({ msg: "Senha atual incorreta!" });
                }
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

    async deletar(req, res) {
        try {
            let { id } = req.params;
            let repo = new ClienteRepository();

            if (await repo.obter(id)) {
                let result = await repo.deletar(id);

                if (result) {
                    res.status(200).json({ msg: "Cliente deletado com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a deleção no banco de dados");
                }
            } else {
                res.status(404).json({ msg: "Cliente não encontrado para deleção" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async recuperarSenha(req, res) {
        const { email } = req.body;
    
        try {
            const repo = new ClienteRepository();
            const cliente = await repo.buscarEmail(email);

            if (!cliente) {
                return res.status(404).json({ erro: 'Cliente não encontrado' });
            }
    
            const token = crypto.randomBytes(32).toString('hex');
            const validade = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validade

            const tokenValido = await repo.buscarTokenValidoPorCliente(cliente.id);
            if (tokenValido) {
                return res.status(400).json({ erro: 'Já foi enviado um e-mail de recuperação. Aguarde ele expirar para solicitar outro.' });
            }            
    
            await repo.salvarTokenReset(cliente.id, token, validade);
            await enviarEmailRecuperacao(email, token);
    
            res.json({ mensagem: 'E-mail enviado com sucesso!' });
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }    

    async redefinirSenha(req, res) {
        const { token, novaSenha, confmNovaSenha } = req.body;

        try {
            if(token && novaSenha && confmNovaSenha) {

                if (!validarNovaSenha(novaSenha)) {
                    return res.status(400).json({ msg: "Nova senha inválida! Deve conter pelo menos 6 caracteres, 1 maiúsculo e 1 especial" });
                }
                if (!validarSenhasRedefinidas(novaSenha, confmNovaSenha)) {
                    return res.status(400).json({ msg: "A confirmação da senha não é igual à senha informada!" });
                }  

                let repo = new ClienteRepository();
                let cliente = await repo.buscarPorToken(token);
    
                if (!cliente || new Date(cliente.validade_token) < new Date()) {
                    return res.status(400).json({ erro: 'Token inválido ou expirado' });
                }
    
                // Atualiza a senha no banco de dados
                const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
                await repo.alterarSenha(novaSenhaHash, cliente.id);
    
                // Limpa o token de recuperação
                await repo.removerToken(cliente.id);
    
                res.json({ mensagem: 'Senha redefinida com sucesso!' });
            }else {
                res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            } 
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async ativar(req, res) {
        try {
            let { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ msg: "ID do cliente é obrigatório!" });
            }
    
            let repo = new ClienteRepository();
            let cliente = await repo.obter(id);
            if(cliente) {
                let linhasAfetadas = await repo.ativar(id);
    
                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Cliente ativado!" });
                } else {
                    res.status(400).json({ msg: "Cliente já está ativo!" });
                }
            }
            else {
                return res.status(404).json({ msg: "Cliente não encontrado para ação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    } 

    async inativar(req, res) {
        try {
            let { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ msg: "ID do cliente é obrigatório!" });
            }
    
            let repo = new ClienteRepository();
            let cliente = await repo.obter(id);
            if(cliente) {
                let linhasAfetadas = await repo.inativar(id);
    
                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Cliente inativado!" });
                } else {
                    res.status(400).json({ msg: "Cliente já está inativo!" });
                }
            }
            else {
                return res.status(404).json({ msg: "Cliente não encontrado para ação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    } 
}