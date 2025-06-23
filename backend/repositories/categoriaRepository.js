import CategoriaEntity from "../entities/categoriaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class CategoriaRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_categoria";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_categoria WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `INSERT INTO tb_categoria (descricao) VALUES (?)`;
        let valores = [entidade.descricao];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_categoria SET descricao = ? WHERE id = ?`;
        let valores = [entidade.descricao, entidade.id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_categoria WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new CategoriaEntity(
                row.id, row.descricao
            ));
        } else {
            return new CategoriaEntity(
                rows.id, rows.descricao
            );
        }
    }
}
