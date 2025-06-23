import OrcamentoItemEntity from "../entities/orcamentoItemEntity.js";
import BaseRepository from "./baseRepository.js";

export default class OrcamentoItemRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_orcamento_itens";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async listarPorOrcamento(id_orcamento) {
        let sql = "SELECT * FROM tb_orcamento_itens WHERE id_orcamento = ?";
        let valores = [id_orcamento];
        let rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_orcamento_itens WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `
            INSERT INTO tb_orcamento_itens 
            (id_orcamento, descricao, marca, valor_unitario, id_unidade, quantidade)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        let valores = [
            entidade.id_orcamento, entidade.descricao, entidade.marca,
            entidade.valor_unitario, entidade.id_unidade, entidade.quantidade
        ];
        const result = await this.db.ExecutaComando(sql, valores);
        return result.insertId;
    }

    async alterar(entidade) {
        let sql = `
            UPDATE tb_orcamento_itens SET 
                id_orcamento = ?, 
                descricao = ?, 
                marca = ?, 
                valor_unitario = ?, 
                id_unidade = ?, 
                quantidade = ?
            WHERE id = ?
        `;
        let valores = [
            entidade.id_orcamento, entidade.descricao, entidade.marca,
            entidade.valor_unitario, entidade.id_unidade, entidade.quantidade,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_orcamento_itens WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new OrcamentoItemEntity(
                row.id, row.id_orcamento, row.descricao, row.marca,
                row.valor_unitario, row.id_unidade, row.quantidade
            ));
        } else {
            return new OrcamentoItemEntity(
                rows.id, rows.id_orcamento, rows.descricao, rows.marca,
                rows.valor_unitario, rows.id_unidade, rows.quantidade
            );
        }
    }
}
