import UnidadeEntity  from "../entities/unidadeEntity.js";
import UnidadeRepository from "../repositories/unidadeRepository.js";

export default class UnidadeController {

    async listar(req, res) {
        try {
            let repo = new UnidadeRepository();
            let lista = await repo.listar();
            if (lista != null && lista.length > 0) {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhuma unidade cadastrada!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new UnidadeRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Unidade não encontrada!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let { descricao, sigla } = req.body;

            if (descricao && sigla) {
                let entidade = new UnidadeEntity (0, descricao, sigla);
                let repo = new UnidadeRepository();
                let result = await repo.gravar(entidade);

                if (result) {
                    res.status(201).json({ msg: "Unidade cadastrada com sucesso!" });
                } else {
                    throw new Error("Erro ao inserir unidade no banco de dados");
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
            let { id, descricao, sigla } = req.body;

            if (id && descricao && sigla) {
                let entidade = new UnidadeEntity(id, descricao, sigla);
                let repo = new UnidadeRepository();

                if (await repo.obter(id)) {
                    let result = await repo.alterar(entidade);

                    if (result) {
                        res.status(200).json({ msg: "Alteração realizada com sucesso!" });
                    } else {
                        throw new Error("Erro ao executar a atualização no banco de dados");
                    }
                } else {
                    res.status(404).json({ msg: "Unidade não encontrada para alteração" });
                }
            } else {
                res.status(400).json({ msg: "Informe os parâmetros corretamente!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async deletar(req, res) {
        try {
            let { id } = req.params;
            let repo = new UnidadeRepository();

            if (await repo.obter(id)) {
                let result = await repo.deletar(id);

                if (result) {
                    res.status(200).json({ msg: "Unidade deletada com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a deleção no banco de dados");
                }
            } else {
                res.status(404).json({ msg: "Unidade não encontrada para deleção" });
            }
        } catch (ex) {
            if (ex.code === "ER_ROW_IS_REFERENCED_2" || ex.errno === 1451) {
                res.status(400).json({
                    msg: "Não é possível excluir esta unidade porque há registros vinculados a ela."
                });
            } else {
                res.status(500).json({ msg: ex.message });
            }
        }
    }
}
