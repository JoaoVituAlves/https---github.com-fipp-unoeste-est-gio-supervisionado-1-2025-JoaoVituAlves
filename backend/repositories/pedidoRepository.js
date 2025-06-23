import ClienteEntity from "../entities/clienteEntity.js";
import PagamentoEntity from "../entities/pagamentoEntity.js";
import PedidoEntity from "../entities/pedidoEntity.js";
import PedidoItemEntity from "../entities/pedidoItemEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PedidoRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = `
            SELECT
            p.*,
            c.id AS cliente_id,
            c.nome AS cliente_nome
            FROM tb_pedidos p
            JOIN tb_clientes c ON p.id_cliente = c.id
            ORDER BY p.id;
        `;
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = `
            SELECT 
            p.*,
            c.id AS cliente_id, 
            c.nome AS cliente_nome,
            pg.metodo_pagamento
            FROM tb_pedidos p
            JOIN tb_clientes c ON p.id_cliente = c.id
            LEFT JOIN tb_pagamentos pg ON pg.id_pedido = p.id
            WHERE p.id = ?
            ORDER BY pg.data DESC
            LIMIT 1;
        `;
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? { ...row[0] } : null;
    }

    async gravar(entidade) {
        let sql = `
            INSERT INTO tb_pedidos 
            (id_cliente, data_pedido, status, num_parcelas, taxa_entrega, valor_desconto, valor_total, id_funcionario, opcao, cep, rua, bairro, cidade, numero)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        let valores = [
            entidade.id_cliente, entidade.data_pedido, entidade.status, entidade.num_parcelas,
            entidade.taxa_entrega, entidade.valor_desconto, entidade.valor_total, entidade.id_funcionario,
            entidade.opcao, entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero
        ];
        const result = await this.db.ExecutaComando(sql, valores);
        return result.insertId;
    }

    async atualizarStatus(id, status) {
        let sql = `UPDATE tb_pedidos SET status = ? WHERE id = ?`;
        let valores = [status, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `
            UPDATE tb_pedidos SET 
                id_cliente = ?, 
                data_pedido = ?, 
                status = ?, 
                num_parcelas = ?, 
                taxa_entrega = ?, 
                valor_desconto = ?, 
                valor_total = ?, 
                id_funcionario = ?, 
                opcao = ?, 
                cep = ?, 
                rua = ?, 
                bairro = ?, 
                cidade = ?, 
                numero = ?
            WHERE id = ?
        `;
        let valores = [
            entidade.id_cliente, entidade.data_pedido, entidade.status, entidade.num_parcelas,
            entidade.taxa_entrega, entidade.valor_desconto, entidade.valor_total, entidade.id_funcionario,
            entidade.opcao, entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero,
            entidade.id
        ];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_pedidos WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    // Adicionar novos métodos ao repositório

    // Listar pedidos de um cliente específico
    async listarPorCliente(idCliente) {
        const sql = `
            SELECT p.*, 
                CASE 
                    WHEN p.status = 1 THEN 'Pendente'
                    WHEN p.status = 2 THEN 'Aprovado'
                    WHEN p.status = 3 THEN 'Em preparo'
                    WHEN p.status = 4 THEN 'Em entrega'
                    WHEN p.status = 5 THEN 'Cancelado'
                    WHEN p.status = 6 THEN 'Finalizado'
                    ELSE 'Desconhecido'
                END AS status_descricao,
                DATE_FORMAT(p.data_pedido, '%d/%m/%Y') AS data_formatada
            FROM tb_pedidos p
            WHERE p.id_cliente = ?
            ORDER BY p.id DESC
        `;
        const valores = [idCliente];
        const rows = await this.db.ExecutaComando(sql, valores);
        return rows;
    }

    // Listar itens de um pedido específico
    async listarItensPedido(idPedido) {
        const sql = `
            SELECT i.*, p.nome, p.descricao, p.imagem
            FROM tb_pedido_itens i
            LEFT JOIN tb_produtos p ON i.id_produto = p.id
            WHERE i.id_pedido = ?
        `;
        const valores = [idPedido];
        const rows = await this.db.ExecutaComando(sql, valores);
        return rows;
    }

    // Remover itens de um pedido
    async removerItensPedido(idPedido) {
        const sql = 'DELETE FROM tb_pedido_itens WHERE id_pedido = ?';
        const valores = [idPedido];
        await this.db.ExecutaComandoNonQuery(sql, valores);
        return true;
    }

    // Adicionar item ao pedido
    async adicionarItemPedido(idPedido, item) {
        const sql = `
            INSERT INTO tb_pedido_itens 
            (id_pedido, id_produto, quantidade, valor_unitario) 
            VALUES (?, ?, ?, ?)
        `;
        const valores = [idPedido, item.id_produto, item.quantidade, item.preco_unitario];
        await this.db.ExecutaComandoNonQuery(sql, valores);
        return true;
    }

    // Atualizar pedido
    async atualizar(id, pedido) {
        const sql = `
            UPDATE tb_pedidos SET 
                taxa_entrega = ?,
                valor_desconto = ?,
                valor_total = ?,
                opcao = ?,
                cep = ?,
                rua = ?,
                bairro = ?,
                cidade = ?,
                numero = ?
            WHERE id = ?
        `;
        const valores = [
            pedido.taxa_entrega,
            pedido.valor_desconto,
            pedido.valor_total,
            pedido.opcao,
            pedido.cep,
            pedido.rua,
            pedido.bairro,
            pedido.cidade,
            pedido.numero,
            id
        ];
        await this.db.ExecutaComandoNonQuery(sql, valores);
        return true;
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new PedidoEntity(
                row.id, row.id_cliente, row.data_pedido, row.status, row.num_parcelas,
                row.taxa_entrega, row.valor_desconto, row.valor_total, row.id_funcionario,
                row.opcao, row.cep, row.rua, row.bairro, row.cidade, row.numero,
                new ClienteEntity(row.cliente_id, row.cliente_nome), new PagamentoEntity(row.id, row.metodo_pagamento),
                new PedidoItemEntity(row.id, "", row.produto_id, row.quantidade)
            ));
        } else {
            return new PedidoEntity(
                rows.id, rows.id_cliente, rows.data_pedido, rows.status, rows.num_parcelas,
                rows.taxa_entrega, rows.valor_desconto, rows.valor_total, rows.id_funcionario,
                rows.opcao, rows.cep, rows.rua, rows.bairro, rows.cidade, rows.numero,
                new ClienteEntity(rows.cliente_id, rows.cliente_nome), new PagamentoEntity(rows.id, rows.metodo_pagamento),
                new PedidoItemEntity(rows.id, "", rows.produto_id, rows.quantidade)
            );
        }
    }
}