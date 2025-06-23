import PedidoItemEntity from "../entities/pedidoItemEntity.js";
import ProdutoEntity from "../entities/produtoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PedidoItemRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listarPorPedido(id_pedido) {
        let sql = `
            SELECT pi.*,
            p.id AS produto_id, p.nome AS produto_nome
            FROM tb_pedido_itens pi
            JOIN tb_produtos p ON pi.id_produto = p.id
            WHERE pi.id_pedido = ?;
        `;
        let valores = [id_pedido];
        let rows = await this.db.ExecutaComando(sql, valores);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_pedido_itens WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `
            INSERT INTO tb_pedido_itens 
            (id_pedido, id_produto, quantidade, valor_unitario)
            VALUES (?, ?, ?, ?)
        `;
        let valores = [
            entidade.id_pedido, entidade.id_produto, entidade.quantidade, entidade.valor_unitario
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `
            UPDATE tb_pedido_itens SET 
                id_pedido = ?, 
                id_produto = ?, 
                quantidade = ?, 
                valor_unitario = ?
            WHERE id = ?
        `;
        let valores = [
            entidade.id_pedido, entidade.id_produto, entidade.quantidade, entidade.valor_unitario,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_pedido_itens WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new PedidoItemEntity(
                row.id, row.id_pedido, row.id_produto, row.quantidade, row.valor_unitario,
                new ProdutoEntity(row.produto_id, row.produto_nome)
            ));
        } else {
            return new PedidoItemEntity(
                rows.id, rows.id_pedido, rows.id_produto, rows.quantidade, rows.valor_unitario,
                new ProdutoEntity(rows.produto_id, rows.produto_nome)
            );
        }
    }
}