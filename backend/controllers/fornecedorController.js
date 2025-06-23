import FornecedorEntity from "../entities/fornecedorEntity.js";
import FornecedorRepository from "../repositories/fornecedorRepository.js";
import { formatarCNPJ, formatarTelefone, validarBairro, validarCep, validarCidade, validarCNPJ, validarEmail, validarNomeFantasia, validarNumeroEndereco, validarRua, validarTelefone } from "../utils/fornecedorValidacao.js";

export default class FornecedorController {

    async listar(req, res) {
        try {
            let repo = new FornecedorRepository();
            let lista = await repo.listar();
            if(lista!=null && lista != "") {
                res.status(200).json(lista);
            }
            else {
                res.status(404).json({ msg: "Nenhum fornecedor cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new FornecedorRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Fornecedor não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let { nome_fantasia, razao_social, cnpj, telefone, email, cep, rua, bairro, cidade, numero } = req.body;

            if (nome_fantasia && razao_social && cnpj && telefone && email && cep && rua && bairro && cidade && numero) {

                if (!validarNomeFantasia(nome_fantasia)) {
                    return res.status(400).json({ msg: "Nome fantasia inválido! Apenas letras" });
                }
                if (!validarCNPJ(cnpj)) {
                    return res.status(400).json({ msg: "CNPJ inválido! Formato (00.000.000/0001-00)" });
                } 
                cnpj = formatarCNPJ(cnpj);
                if (!validarTelefone(telefone)) {
                    return res.status(400).json({ msg: "Telefone inválido (deve conter 10 ou 11 números)" });
                }
                telefone = formatarTelefone(telefone);
                if(!validarEmail(email)) {
                    return res.status(400).json({ msg: "E-mail inválido! Formato (email@exemplo.com)" });
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

                let entidade = new FornecedorEntity(0, razao_social, nome_fantasia, cnpj, telefone, email, cep, rua, bairro, cidade, numero);
                let repo = new FornecedorRepository();
                let jaExiste = await repo.buscarCnpj(cnpj);
    
                if (jaExiste) {
                    return res.status(400).json({ msg: "Já existe um cadastro com esse CNPJ!" });
                }

                let result = await repo.gravar(entidade);

                if (result) {
                    res.status(201).json({ msg: "Fornecedor cadastrado com sucesso!" });
                } else {
                    throw new Error("Erro ao inserir fornecedor no banco de dados");
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
            let { id, nome_fantasia, razao_social, cnpj, telefone, email, cep, rua, bairro, cidade, numero } = req.body;

            if (id && nome_fantasia && razao_social && cnpj && telefone && email && cep && rua && bairro && cidade && numero) {

                if (!validarNomeFantasia(nome_fantasia)) {
                    return res.status(400).json({ msg: "Nome fantasia inválido! Apenas letras" });
                }
                if (!validarCNPJ(cnpj)) {
                    return res.status(400).json({ msg: "CNPJ inválido! Formato (00.000.000/0001-00)" });
                } 
                cnpj = formatarCNPJ(cnpj);
                if(!validarTelefone(telefone)) {
                    return res.status(400).json({ msg: "Telefone inválido! Formato ((00) 00000-0000) ou ((00) 0000-0000)" });
                }
                telefone = formatarTelefone(telefone);
                if(!validarEmail(email)) {
                    return res.status(400).json({ msg: "E-mail inválido! Formato (email@exemplo.com)" });
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

                let entidade = new FornecedorEntity(id, razao_social, nome_fantasia, cnpj, telefone, email, cep, rua, bairro, cidade, numero);
                let repo = new FornecedorRepository();
                let fornecedorAtual = await repo.obter(id);

                if (cnpj !== fornecedorAtual.cnpj) {
                    let jaExiste = await repo.buscarCnpj(cnpj);
                    if (jaExiste) {
                        return res.status(400).json({ msg: "Já existe um cadastro com esse CNPJ!" });
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
                    res.status(404).json({ msg: "Fornecedor não encontrado para alteração" });
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
            let { id, nome_fantasia, razao_social, cnpj, telefone, email, cep, rua, bairro, cidade, numero } = req.body;

            if (id && (nome_fantasia || razao_social || cnpj || telefone || email || cep || rua || bairro || cidade || numero)) {
                let entidade = new FornecedorEntity(id, razao_social, nome_fantasia, cnpj, telefone, email, cep, rua, bairro, cidade, numero);
                let repo = new FornecedorRepository();
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

    async deletar(req, res) {
        try {
            let { id } = req.params;
            let repo = new FornecedorRepository();

            if (await repo.obter(id)) {
                let result = await repo.deletar(id);

                if (result) {
                    res.status(200).json({ msg: "Fornecedor deletado com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a deleção no banco de dados");
                }
            } else {
                res.status(404).json({ msg: "Fornecedor não encontrado para deleção" });
            }
        } catch (ex) {
            if (ex.code === "ER_ROW_IS_REFERENCED_2" || ex.errno === 1451) {
                res.status(400).json({
                    msg: "Não é possível excluir este fornecedor porque há registros vinculados a ele."
                });
            } else {
                res.status(500).json({ msg: ex.message });
            }
        }
    }

    async inativar(req, res) {
        try {
            let { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "ID do fornecedor é obrigatório!" });
            }

            let repo = new FornecedorRepository();
            let fornecedor = await repo.obter(id);
            if (fornecedor) {
                let linhasAfetadas = await repo.inativar(id);

                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Fornecedor inativado com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Fornecedor já está inativo!" });
                }
            } else {
                return res.status(404).json({ msg: "Fornecedor não encontrado para inativação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async reativar(req, res) {
        try {
            let { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "ID do fornecedor é obrigatório!" });
            }

            let repo = new FornecedorRepository();
            let fornecedor = await repo.obter(id);
            if (fornecedor) {
                let linhasAfetadas = await repo.reativar(id);

                if (linhasAfetadas > 0) {
                    res.status(200).json({ msg: "Fornecedor reativado com sucesso!" });
                } else {
                    res.status(400).json({ msg: "Fornecedor já está ativo!" });
                }
            } else {
                return res.status(404).json({ msg: "Fornecedor não encontrado para reativação!" });
            }

        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

}