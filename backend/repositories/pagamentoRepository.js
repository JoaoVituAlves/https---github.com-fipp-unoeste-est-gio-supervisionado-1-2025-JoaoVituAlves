import PagamentoEntity from "../entities/pagamentoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PagamentoRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_pagamentos";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_pagamentos WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `
            INSERT INTO tb_pagamentos 
            (metodo_pagamento, situacao, id_pedido, parcelas, valor_parcela, valor_pago, data, data_vencimento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        let valores = [
            entidade.metodo_pagamento, entidade.situacao, entidade.id_pedido, entidade.parcelas,
            entidade.valor_parcela, entidade.valor_pago, entidade.data, entidade.data_vencimento
        ];
        const result = await this.db.ExecutaComando(sql, valores);
        return result.insertId;
    }

    async listarPorPedido(idPedido) {
        let sql = "SELECT * FROM tb_pagamentos WHERE id_pedido = ?";
        let valores = [idPedido];
        let rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async atualizarStatus(entidade) {
        let sql = `
            UPDATE tb_pagamentos 
            SET situacao = ?, valor_pago = ?
            WHERE id = ?
        `;
        let valores = [
            entidade.situacao,
            entidade.valor_pago,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_pagamentos WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new PagamentoEntity(
                row.id, row.metodo_pagamento, row.situacao, row.id_pedido, row.parcelas,
                row.valor_parcela, row.valor_pago, row.data, row.data_vencimento
            ));
        } else {
            return new PagamentoEntity(
                rows.id, rows.metodo_pagamento, rows.situacao, rows.id_pedido, rows.parcelas,
                rows.valor_parcela, rows.valor_pago, rows.data, rows.data_vencimento
            );
        }
    }
}