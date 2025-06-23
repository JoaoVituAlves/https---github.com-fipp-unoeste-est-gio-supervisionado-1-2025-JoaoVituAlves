import CargoEntity from "../entities/cargoEntity.js";
import CargoRepository from "../repositories/cargoRepository.js";

export default class CargoController {

    async listar(req, res) {
        try {
            let repo = new CargoRepository();
            let lista = await repo.listar();
            if (lista != null && lista != "") {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhum cargo cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            let { id } = req.params;
            let repo = new CargoRepository();
            let entidade = await repo.obter(id);

            if (entidade) {
                res.status(200).json(entidade);
            } else {
                res.status(404).json({ msg: "Cargo não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            let { descricao } = req.body;

            if (descricao) {   

                let entidade = new CargoEntity(0, descricao);
                let repo = new CargoRepository();
                let result = await repo.gravar(entidade);

                if (result) {
                    res.status(201).json({ msg: "Cargo cadastrado com sucesso!" });
                } else {
                    throw new Error("Erro ao inserir cargo no banco de dados");
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
                let entidade = new CargoEntity(id, descricao);
                let repo = new CargoRepository();

                if (await repo.obter(id)) {
                    let result = await repo.alterar(entidade);

                    if (result) {
                        res.status(200).json({ msg: "Alteração realizada com sucesso!" });
                    } else {
                        throw new Error("Erro ao executar a atualização no banco de dados");
                    }
                } else {
                    res.status(404).json({ msg: "Cargo não encontrado para alteração" });
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
        let repo = new CargoRepository();

        if (await repo.obter(id)) {
            let result = await repo.deletar(id);

            if (result) {
                res.status(200).json({ msg: "Cargo deletado com sucesso!" });
            } else {
                throw new Error("Erro ao executar a deleção no banco de dados");
            }
        } else {
            res.status(404).json({ msg: "Cargo não encontrado para deleção" });
        }
    } catch (ex) {
        if (ex.code === "ER_ROW_IS_REFERENCED_2" || ex.errno === 1451) {
            res.status(400).json({
                msg: "Não é possível excluir este cargo porque há registros vinculados a ele."
            });
        } else {
            res.status(500).json({ msg: ex.message });
        }
    }
}


}