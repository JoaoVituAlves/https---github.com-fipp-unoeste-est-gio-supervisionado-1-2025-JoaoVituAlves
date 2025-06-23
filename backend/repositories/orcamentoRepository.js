import FuncionarioEntity from "../entities/funcionarioEntity.js";
import OrcamentoEntity from "../entities/orcamentoEntity.js";
import OrcamentoItemEntity from "../entities/orcamentoItemEntity.js";
import BaseRepository from "./baseRepository.js";

export default class OrcamentoRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = `
            SELECT o.*,
            f.id AS funcionario_id, f.nome AS funcionario_nome
            FROM tb_orcamentos o
            JOIN tb_funcionarios f ON o.id_funcionario = f.id
            ORDER BY id;
        `;
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = `
            SELECT 
                o.*,
                f.id AS funcionario_id,
                f.nome AS funcionario_nome,
                i.id AS item_id,
                i.descricao AS item_descricao,
                i.marca AS item_marca,
                i.valor_unitario AS item_valor_unitario,
                i.id_unidade AS item_id_unidade,
                i.quantidade AS item_quantidade,
                u.sigla AS item_sigla_unidade
            FROM tb_orcamentos o
            JOIN tb_funcionarios f ON o.id_funcionario = f.id
            LEFT JOIN tb_orcamento_itens i ON o.id = i.id_orcamento
            LEFT JOIN tb_unidades u ON i.id_unidade = u.id
            WHERE o.id = ?
            ORDER BY i.id;
        `;

        let rows = await this.db.ExecutaComando(sql, [id]);

        if (!rows || rows.length === 0) return null;

        const primeiro = rows[0];

        const itens = rows
            .filter(row => row.item_descricao !== null) 
            .map(row => ({
            id: row.item_id,
            descricao: row.item_descricao,
            marca: row.item_marca,
            valor_unitario: row.item_valor_unitario,
            id_unidade: row.item_id_unidade,
            quantidade: row.item_quantidade,
            sigla: row.item_sigla_unidade
            }));

        return {
            id: primeiro.id,
            cidade: primeiro.cidade,
            prazo_validade: primeiro.prazo_validade,
            prazo_entrega: primeiro.prazo_entrega,
            id_funcionario: primeiro.id_funcionario,
            status: primeiro.status,
            data: primeiro.data,
            funcionario: {
            id: primeiro.funcionario_id,
            nome: primeiro.funcionario_nome
            },
            itens
        };
    }


    async gravar(entidade) {
        let sql = `
            INSERT INTO tb_orcamentos 
            (cidade, prazo_validade, prazo_entrega, id_funcionario, status, data)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        let valores = [
            entidade.cidade, entidade.prazo_validade, entidade.prazo_entrega,
            entidade.id_funcionario, entidade.status, entidade.data
        ];
        const result = await this.db.ExecutaComando(sql, valores);
        return result.insertId; 
    }

    async alterar(entidade) {
        let sql = `
            UPDATE tb_orcamentos SET 
                cidade = ?, 
                prazo_validade = ?, 
                prazo_entrega = ?, 
                id_funcionario = ?,
                status = ?,
                data = ?
            WHERE id = ?
        `;
        let valores = [
            entidade.cidade, entidade.prazo_validade, entidade.prazo_entrega,
            entidade.id_funcionario, entidade.status, entidade.data, entidade.id
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_orcamentos WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (!rows) return null;

        if (Array.isArray(rows)) {
            return rows.map(row => new OrcamentoEntity(
                row.id, row.cidade, row.prazo_validade, row.prazo_entrega,
                row.id_funcionario, row.status, row.data, new FuncionarioEntity(row.funcionario_id, row.funcionario_nome),
                new OrcamentoItemEntity(row.id, row.id_orcamento, row.item_descricao, row.item_marca,
                    row.item_valor_unitario, row.item_id_unidade, row.item_quantidade)
            ));
        } else {
            return new OrcamentoEntity(
                rows.id, rows.cidade, rows.prazo_validade, rows.prazo_entrega,
                rows.id_funcionario, rows.status, rows.data, new FuncionarioEntity(rows.funcionario_id, rows.funcionario_nome),
                new OrcamentoItemEntity(rows.id, rows.id_orcamento, rows.item_descricao, rows.item_marca,
                    rows.item_valor_unitario, rows.item_id_unidade, rows.item_quantidade)
            );
        }
    }
}
