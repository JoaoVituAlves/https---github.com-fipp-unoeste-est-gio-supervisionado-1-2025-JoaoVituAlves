import TipoEntity from "../entities/tipoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class TipoRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_tipo";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_tipo WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `INSERT INTO tb_tipo (descricao) VALUES (?)`;
        let valores = [entidade.descricao];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_tipo SET descricao = ? WHERE id = ?`;
        let valores = [entidade.descricao, entidade.id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_tipo WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new TipoEntity(
                row.id, row.descricao
            ));
        } else {
            return new TipoEntity(
                rows.id, rows.descricao
            );
        }
    }
}
