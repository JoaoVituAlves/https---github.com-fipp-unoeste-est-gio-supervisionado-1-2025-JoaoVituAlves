import FornecedorEntity from "../entities/fornecedorEntity.js";
import BaseRepository from "./baseRepository.js";

export default class FornecedorRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "SELECT * FROM tb_fornecedores";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_fornecedores WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async buscarCnpj(cnpj) {
        let sql = `
            SELECT * FROM tb_fornecedores 
            WHERE cnpj = ?
        `;
        let valores = [cnpj];
    
        let rows = await this.db.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }       

    async gravar(entidade) {
        let sql = `INSERT INTO tb_fornecedores 
                    (nome_fantasia, razao_social, cnpj, telefone, email, cep, rua, bairro, cidade, numero, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;
        
        let valores = [
            entidade.nome_fantasia, entidade.razao_social, entidade.cnpj, entidade.telefone,
            entidade.email, entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_fornecedores SET 
                    nome_fantasia = ?, 
                    razao_social = ?, 
                    cnpj = ?, 
                    telefone = ?, 
                    email = ?, 
                    cep = ?, 
                    rua = ?, 
                    bairro = ?, 
                    cidade = ?, 
                    numero = ?,
                    status = ?
                    WHERE id = ?`;
        
        let valores = [
            entidade.nome_fantasia, entidade.razao_social, entidade.cnpj, entidade.telefone,
            entidade.email, entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero, entidade.status,
            entidade.id
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async inativar(id) {
    const sql = `UPDATE tb_fornecedores SET status = 0 WHERE id = ? AND status != 0`;
    return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async reativar(id) {
        const sql = `UPDATE tb_fornecedores SET status = 1 WHERE id = ? AND status = 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }


    async deletar(id) {
        let sql = "DELETE FROM tb_fornecedores WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alteracaoParcial(entidade) {
        let sql = `UPDATE tb_fornecedores SET 
                    nome_fantasia = COALESCE(?, nome_fantasia), 
                    razao_social = COALESCE(?, razao_social), 
                    cnpj = COALESCE(?, cnpj), 
                    telefone = COALESCE(?, telefone), 
                    email = COALESCE(?, email), 
                    cep = COALESCE(?, cep), 
                    rua = COALESCE(?, rua), 
                    bairro = COALESCE(?, bairro), 
                    cidade = COALESCE(?, cidade), 
                    numero = COALESCE(?, numero),
                    status = COALESCE(?, status)
                    WHERE id = ?`;
        
        let valores = [
            entidade.nome_fantasia, entidade.razao_social, entidade.cnpj, entidade.telefone,
            entidade.email, entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero, entidade.status,
            entidade.id
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new FornecedorEntity(
                row.id, row.razao_social, row.nome_fantasia, row.cnpj, row.telefone,
                row.email, row.cep, row.rua, row.bairro, row.cidade, row.numero, row.status
            ));
        } else {
            return new FornecedorEntity(
                rows.id, rows.razao_social, rows.nome_fantasia, rows.cnpj, rows.telefone,
                rows.email, rows.cep, rows.rua, rows.bairro, rows.cidade, rows.numero, rows.status
            );
        }
    }
}