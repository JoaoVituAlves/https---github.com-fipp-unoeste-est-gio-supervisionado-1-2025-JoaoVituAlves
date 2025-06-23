import CategoriaEntity from "../entities/categoriaEntity.js";
import FornecedorEntity from "../entities/fornecedorEntity.js";
import ProdutoEntity from "../entities/produtoEntity.js";
import BaseRepository from "./baseRepository.js";
import ImagemProdutoRepository from "./imagemProdutoRepository.js";

export default class ProdutoRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async validarEstoque(id_produto, quantidade_desejada) {
        const sql = `SELECT quantidade FROM tb_produtos WHERE id = ?`;
        const valores = [id_produto];
        const resultado = await this.db.ExecutaComando(sql, valores);

        if (resultado.length === 0) {
            throw new Error(`Produto com ID ${id_produto} não encontrado.`);
        }

        const quantidadeAtual = resultado[0].quantidade;
        return quantidadeAtual >= quantidade_desejada;
    }

    async atualizarEstoque(id_produto, novaQuantidade) {
        const sql = `UPDATE tb_produtos SET quantidade = ? WHERE id = ?`;
        const valores = [novaQuantidade, id_produto];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async listar() {
        const sql = `SELECT p.*,
                     c.id AS categoria_id, c.descricao AS categoria_descricao,
                     f.id AS fornecedor_id, f.razao_social AS fornecedor_razao
                     FROM tb_produtos p
                     JOIN tb_categoria c ON p.id_categoria = c.id
                     LEFT JOIN tb_fornecedores f ON p.id_fornecedor = f.id
                     ORDER BY p.id`;
        const rows = await this.db.ExecutaComando(sql);
        return await this.toMap(rows);
    }

    async obter(id) {
        const sql = `SELECT * FROM tb_produtos WHERE id = ?`;
        const valores = [id];
        const row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? await this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        const sql = `
            INSERT INTO tb_produtos
            (nome, descricao, id_categoria, marca, preco, quantidade, data_validade, id_fornecedor, status_web, ativo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            entidade.nome, entidade.descricao, entidade.id_categoria, entidade.marca,
            entidade.preco, entidade.quantidade, entidade.data_validade,
            entidade.id_fornecedor, entidade.status_web, entidade.ativo
        ];

        const produtoId = await this.db.ExecutaComandoLastInserted(sql, valores);
        let result = produtoId > 0;

        if (result && entidade.imagens?.length > 0) {
            for (let imagem of entidade.imagens) {
                const sqlImg = "INSERT INTO tb_imagemproduto (imagem_blob, tipo, id_produto) VALUES (?, ?, ?)";
                const valoresImg = [imagem.blob, imagem.tipo, produtoId];
                const imgResult = await this.db.ExecutaComandoNonQuery(sqlImg, valoresImg);
                if (!imgResult) {
                    throw new Error("Uma ou mais imagens não foram inseridas!");
                }
            }
        }

        return result;
    }

    async alterar(entidade) {
        const sql = `
            UPDATE tb_produtos SET
                nome = ?, descricao = ?, id_categoria = ?, marca = ?, preco = ?, quantidade = ?,
                data_validade = ?, id_fornecedor = ?, status_web = ?, ativo = ?
            WHERE id = ?
        `;
        const valores = [
            entidade.nome, entidade.descricao, entidade.id_categoria, entidade.marca,
            entidade.preco, entidade.quantidade, entidade.data_validade,
            entidade.id_fornecedor, entidade.status_web,
            entidade.ativo, entidade.id
        ];

        const result = await this.db.ExecutaComandoNonQuery(sql, valores);

        if (result && entidade.imagens?.length > 0) {
            // Deleta imagens antigas
            await this.db.ExecutaComandoNonQuery("DELETE FROM tb_imagemproduto WHERE id_produto = ?", [entidade.id]);

            // Insere novas
            for (let imagem of entidade.imagens) {
                const sqlImg = "INSERT INTO tb_imagemproduto (imagem_blob, tipo, id_produto) VALUES (?, ?, ?)";
                const valoresImg = [imagem.blob, imagem.tipo, entidade.id];
                const imgResult = await this.db.ExecutaComandoNonQuery(sqlImg, valoresImg);
                if (!imgResult) {
                    throw new Error("Uma ou mais imagens não foram inseridas!");
                }
            }
        }

        return result;
    }

    async alteracaoParcial(entidade) {
        const campos = [];
        const valores = [];

        if (entidade.nome !== undefined) { campos.push("nome = ?"); valores.push(entidade.nome); }
        if (entidade.descricao !== undefined) { campos.push("descricao = ?"); valores.push(entidade.descricao); }
        if (entidade.id_categoria !== undefined) { campos.push("id_categoria = ?"); valores.push(entidade.id_categoria); }
        if (entidade.marca !== undefined) { campos.push("marca = ?"); valores.push(entidade.marca); }
        if (entidade.preco !== undefined) { campos.push("preco = ?"); valores.push(entidade.preco); }
        if (entidade.quantidade !== undefined) { campos.push("quantidade = ?"); valores.push(entidade.quantidade); }
        if (entidade.data_validade !== undefined) { campos.push("data_validade = ?"); valores.push(entidade.data_validade); }
        if (entidade.id_fornecedor !== undefined) { campos.push("id_fornecedor = ?"); valores.push(entidade.id_fornecedor); }
        if (entidade.imagem !== undefined) { campos.push("imagem = ?"); valores.push(entidade.imagem); }
        if (entidade.status_web !== undefined) { campos.push("status_web = ?"); valores.push(entidade.status_web); }
        if (entidade.ativo !== undefined) { campos.push("ativo = ?"); valores.push(entidade.ativo); }

        if (campos.length === 0) return false;

        const sql = `UPDATE tb_produtos SET ${campos.join(", ")} WHERE id = ?`;
        valores.push(entidade.id);

        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        await this.db.ExecutaComandoNonQuery("DELETE FROM tb_imagemproduto WHERE id_produto = ?", [id]);
        const sql = `DELETE FROM tb_produtos WHERE id = ?`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async oculto(id) {
        const sql = `UPDATE tb_produtos SET status_web = 0 WHERE id = ? AND status_web != 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async visivel(id) {
        let sql = `UPDATE tb_produtos SET status_web = 1 WHERE id = ? AND status_web = 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async inativar(id) {
        const sql = `UPDATE tb_produtos SET ativo = 0 WHERE id = ? AND ativo != 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async ativar(id) {
        let sql = `UPDATE tb_produtos SET ativo = 1 WHERE id = ? AND ativo = 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async toMap(rows) {
        const imgRepo = new ImagemProdutoRepository(this.db);

        if (Array.isArray(rows)) {
            const lista = [];
            for (let row of rows) {
                const entidade = new ProdutoEntity(
                    row.id, row.nome, row.descricao, row.id_categoria, row.marca,
                    row.preco, row.quantidade, row.data_validade,
                    row.id_fornecedor, row.imagens, row.status_web, row.ativo,
                    new CategoriaEntity(row.categoria_id, row.categoria_descricao),
                    new FornecedorEntity(row.fornecedor_id, row.fornecedor_razao)
                );
                entidade.imagens = await imgRepo.obter(row.id);
                lista.push(entidade);
            }
            return lista;
        } else {
            const entidade = new ProdutoEntity(
                rows.id, rows.nome, rows.descricao, rows.id_categoria, rows.marca,
                rows.preco, rows.quantidade, rows.data_validade,
                rows.id_fornecedor, rows.imagens, rows.status_web, rows.ativo,
                new CategoriaEntity(rows.categoria_id, rows.categoria_descricao),
                new FornecedorEntity(rows.fornecedor_id, rows.fornecedor_razao)
            );
            entidade.imagens = await imgRepo.obter(rows.id);
            return entidade;
        }
    }
}