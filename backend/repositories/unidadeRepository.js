import UnidadeEntity from "../entities/unidadeEntity.js";
import BaseRepository from "./baseRepository.js";

export default class UnidadeRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_unidades";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_unidades WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async gravar(entidade) {
        let sql = `INSERT INTO tb_unidades (descricao, sigla) VALUES (?, ?)`;
        let valores = [entidade.descricao, entidade.sigla];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_unidades SET descricao = ?, sigla = ? WHERE id = ?`;
        let valores = [entidade.descricao, entidade.sigla, entidade.id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_unidades WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new UnidadeEntity(
                row.id,
                row.descricao,
                row.sigla
            ));
        } else {
            return new UnidadeEntity(
                rows.id,
                rows.descricao,
                rows.sigla
            );
        }
    }
}
