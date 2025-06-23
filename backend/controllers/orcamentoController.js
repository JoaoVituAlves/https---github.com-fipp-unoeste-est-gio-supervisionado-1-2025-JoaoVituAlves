import OrcamentoEntity from "../entities/orcamentoEntity.js";
import OrcamentoItemEntity from "../entities/orcamentoItemEntity.js";
import OrcamentoRepository from "../repositories/orcamentoRepository.js";
import OrcamentoItemRepository from "../repositories/orcamentoItemRepository.js";

export default class OrcamentoController {

    async listar(req, res) {
        try {
            const repo = new OrcamentoRepository();
            const lista = await repo.listar();

            if (lista && lista.length > 0) {
                res.status(200).json(lista);
            } else {
                res.status(404).json({ msg: "Nenhum orçamento cadastrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async obter(req, res) {
        try {
            const { id } = req.params;
            const repo = new OrcamentoRepository();
            const orcamento = await repo.obter(id);

            if (orcamento) {
                res.status(200).json(orcamento);
            } else {
                res.status(404).json({ msg: "Orçamento não encontrado!" });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async gravar(req, res) {
        try {
            const { orcamento: orcamentoBody, itens: itensBody } = req.body;

            if (!orcamentoBody || !Array.isArray(itensBody) || itensBody.length === 0) {
                return res.status(400).json({ msg: "Dados do orçamento ou itens estão inválidos ou ausentes." });
            }

            const orcamentoEntity = new OrcamentoEntity(
                0,
                orcamentoBody.cidade,
                orcamentoBody.prazo_validade,
                orcamentoBody.prazo_entrega,
                orcamentoBody.id_funcionario,
                orcamentoBody.status = 1,
                orcamentoBody.data = new Date()
            );

            const orcamentoRepo = new OrcamentoRepository();
            const orcamentoId = await orcamentoRepo.gravar(orcamentoEntity);

            if (!orcamentoId) {
                throw new Error("Erro ao gravar orçamento.");
            }

            const itemRepo = new OrcamentoItemRepository();

            for (const item of itensBody) {
                const itemEntity = new OrcamentoItemEntity(
                    0,
                    orcamentoId,
                    item.descricao,
                    item.marca,
                    item.valor_unitario,
                    item.id_unidade,
                    item.quantidade
                );

                await itemRepo.gravar(itemEntity);
            }

            res.status(201).json({ msg: "Orçamento gravado com sucesso!", id: orcamentoId });

        } catch (ex) {
            console.error("Erro ao gravar orçamento:", ex);
            res.status(500).json({ msg: ex.message });
        }
    }

    async alterar(req, res) {
        try {
            
            const { orcamento: orcamentoBody, itens: itensBody } = req.body;
            const id = orcamentoBody?.id;

            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({ msg: "ID inválido." });
            }

            if (!orcamentoBody || !Array.isArray(itensBody)) {
                return res.status(400).json({ msg: "Dados do orçamento ou itens estão inválidos ou ausentes." });
            }

            // Atualiza dados do orçamento
            const orcamentoEntity = new OrcamentoEntity(
                parseInt(id),
                orcamentoBody.cidade,
                orcamentoBody.prazo_validade,
                orcamentoBody.prazo_entrega,
                orcamentoBody.id_funcionario,
                orcamentoBody.status,
                orcamentoBody.data
            );

            const orcamentoRepo = new OrcamentoRepository();
            const result = await orcamentoRepo.alterar(orcamentoEntity);

            if (! await orcamentoRepo.obter(id)) {
                return res.status(404).json({ msg: "Orçamento não encontrado." });
            }

            // Atualiza os itens: deleta todos e insere os novos
            const itemRepo = new OrcamentoItemRepository();

            const orcamentoId = parseInt(id);

            // Deleta itens removidos no frontend
            const itensAtuais = await itemRepo.listarPorOrcamento(orcamentoId);
            const idsEnviados = itensBody.filter(i => i.id).map(i => parseInt(i.id));
            const idsExistentes = itensAtuais.map(i => i.id);
            const idsParaExcluir = idsExistentes.filter(id => !idsEnviados.includes(id));

            for (const idItem of idsParaExcluir) {
                await itemRepo.deletar(idItem);
            }

            for (const item of itensBody) {
                if (item.id && await itemRepo.obter(item.id)) {
                    // Alterar item existente
                    const itemEntity = new OrcamentoItemEntity(
                        item.id,
                        orcamentoId,
                        item.descricao,
                        item.marca,
                        item.valor_unitario,
                        item.id_unidade,
                        item.quantidade
                    );
                    await itemRepo.alterar(itemEntity);
                } else {
                    // Inserir novo item (sem ID)
                    const novoItemEntity = new OrcamentoItemEntity(
                        0,
                        orcamentoId,
                        item.descricao,
                        item.marca,
                        item.valor_unitario,
                        item.id_unidade,
                        item.quantidade
                    );
                    await itemRepo.gravar(novoItemEntity);
                }
            }

            res.status(200).json({ msg: "Orçamento e itens atualizados com sucesso." });

        } catch (ex) {
            console.error("Erro ao alterar orçamento:", ex);
            res.status(500).json({ msg: ex.message });
        }
    }


    async deletar(req, res) {
        try {
            let { id } = req.params;
            let repo = new OrcamentoRepository();

            if (await repo.obter(id)) {
                let result = await repo.deletar(id);

                if (result) {
                    res.status(200).json({ msg: "Orçamento deletado com sucesso!" });
                } else {
                    throw new Error("Erro ao executar a deleção no banco de dados");
                }
            } else {
                res.status(404).json({ msg: "Orçamento não encontrado para deleção" });
            }
        } catch (ex) {
            if (ex.code === "ER_ROW_IS_REFERENCED_2" || ex.errno === 1451) {
                res.status(400).json({
                    msg: "Não é possível excluir este orçamento porque há registros vinculados a ele."
                });
            } else {
                res.status(500).json({ msg: ex.message });
            }
        }
    }

}