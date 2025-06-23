import CategoriaEntity from "../entities/categoriaEntity.js";
import CategoriaRepository from "../repositories/categoriaRepository.js";

export default class CategoriaController {

    async listar(req, res) {
        try {
            let repo = new CategoriaRepository();
            let lista = await repo.listar();
            if (lista != null && lista != "") {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhuma categoria cadastrada!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new CategoriaRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Categoria não encontrada!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let { descricao } = req.body;

            if (descricao) {   
                let entidade = new CategoriaEntity(0, descricao);
                let repo = new CategoriaRepository();
                let result = await repo.gravar(entidade);

                if (result) {
                    res.status(201).json({ msg: "Categoria cadastrada com sucesso!" });
                } else {
                    throw new Error("Erro ao inserir categoria no banco de dados");
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
            let { id, descricao } = req.body;

            if (id && descricao) {
                let entidade = new CategoriaEntity(id, descricao);
                let repo = new CategoriaRepository();

                if (await repo.obter(id)) {
                    let result = await repo.alterar(entidade);

                    if (result) {
                        res.status(200).json({ msg: "Alteração realizada com sucesso!" });
                    } else {
                        throw new Error("Erro ao executar a atualização no banco de dados");
                    }
                } else {
                    res.status(404).json({ msg: "Categoria não encontrada para alteração" });
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
        let repo = new CategoriaRepository();

        if (await repo.obter(id)) {
            let result = await repo.deletar(id);
            if (result) {
                res.status(200).json({ msg: "Categoria deletada com sucesso!" });
            } else {
                throw new Error("Erro ao executar a deleção no banco de dados");
            }
        } else {
            res.status(404).json({ msg: "Categoria não encontrada para deleção" });
        }
    } catch (ex) {
        // Tratamento específico do erro FK 1451
        if (ex.code === "ER_ROW_IS_REFERENCED_2" || ex.errno === 1451) {
            res.status(400).json({
                msg: "Não é possível excluir esta categoria porque há produtos vinculados a ela."
            });
        } else {
            res.status(500).json({ msg: ex.message });
        }
    }
}

}
