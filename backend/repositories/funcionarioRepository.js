import CargoEntity from "../entities/cargoEntity.js";
import FuncionarioEntity from "../entities/funcionarioEntity.js";
import TipoEntity from "../entities/tipoEntity.js";
import BaseRepository from "./baseRepository.js";
import bcrypt from 'bcrypt';

export default class FuncionarioRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async validarAcesso(cpf, senhaDigitada) {
        let sql = "SELECT * FROM tb_funcionarios WHERE cpf = ?";
        let valores = [cpf];

        let rows = await this.db.ExecutaComando(sql, valores);
        if (rows.length === 0) return null;

        let funcionario = this.toMap(rows[0]);

        const senhaCorreta = await bcrypt.compare(senhaDigitada, funcionario.senha);
        if (!senhaCorreta) return null;

        return funcionario;
    }
    
    async listar() {
        let sql = `
            SELECT f.*, 
                c.id AS cargo_id, c.descricao AS cargo_descricao,
                t.id AS tipo_id, t.descricao AS tipo_descricao
            FROM tb_funcionarios f
            JOIN tb_cargo c ON f.id_cargo = c.id
            JOIN tb_tipo t ON f.id_tipo = t.id;
        `;
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }    

    async obter(id) {
        let sql = "SELECT * FROM tb_funcionarios WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async buscarPorCpf(cpf) {
        const sql = 'SELECT * FROM tb_funcionarios WHERE cpf = ? LIMIT 1';
        const valores = [cpf];
        const row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null; 
    }

    async buscarPorEmail(email) {
        const sql = 'SELECT * FROM tb_funcionarios WHERE email = ? LIMIT 1';
        const valores = [email];
        const row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null; 
    }

    async gravar(entidade) {
        let sql = `INSERT INTO tb_funcionarios 
                    (nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        let valores = [
            entidade.nome, entidade.cpf, entidade.telefone, entidade.email,
            entidade.data_admissao, entidade.id_cargo, entidade.salario,
            entidade.status, entidade.id_tipo, entidade.senha
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_funcionarios SET 
                    nome = ?, 
                    cpf = ?, 
                    telefone = ?, 
                    email = ?, 
                    data_admissao = ?, 
                    id_cargo = ?, 
                    salario = ?, 
                    status = ?, 
                    id_tipo = ?, 
                    senha = ? 
                    WHERE id = ?`;
        
        let valores = [
            entidade.nome, entidade.cpf, entidade.telefone, entidade.email,
            entidade.data_admissao, entidade.id_cargo, entidade.salario,
            entidade.status, entidade.id_tipo, entidade.senha,
            entidade.id
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alteracaoParcial(entidade) {
        let sql = `UPDATE tb_funcionarios SET 
                    nome = COALESCE(?, nome),
                    cpf = COALESCE(?, cpf),
                    telefone = COALESCE(?, telefone),
                    email = COALESCE(?, email),
                    data_admissao = COALESCE(?, data_admissao),
                    id_cargo = COALESCE(?, id_cargo),
                    salario = COALESCE(?, salario),
                    status = COALESCE(?, status),
                    id_tipo = COALESCE(?, id_tipo),
                    senha = COALESCE(?, senha)
                    WHERE id = ?`;
        
        let valores = [
            entidade.nome, entidade.cpf, entidade.telefone, entidade.email,
            entidade.data_admissao, entidade.id_cargo, entidade.salario,
            entidade.status, entidade.id_tipo, entidade.senha,
            entidade.id
        ];
        
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async criarNovaSenha(senha, id) {
        let sql = "UPDATE tb_funcionarios SET senha = ? WHERE id = ?";
        let valores = [senha, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }    

    async inativar(id) {
        const sql = `UPDATE tb_funcionarios SET status = 0 WHERE id = ? AND status != 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async reativar(id) {
        let sql = `UPDATE tb_funcionarios SET status = 1 WHERE id = ? AND status = 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_funcionarios WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async buscarPorEmail(email) {
        let sql = "SELECT * FROM tb_funcionarios WHERE email = ?";
        let valores = [email];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async salvarTokenReset(id, token, validade) {
        let sql = `UPDATE tb_funcionarios SET token_reset = ?, validade_token = ? WHERE id = ?`;
        let valores = [token, validade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
      
    async buscarPorToken(token) {
        let sql = `SELECT * FROM tb_funcionarios WHERE token_reset = ?`;
        let valores = [token];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }
      
    async removerToken(id) {
        let sql = `UPDATE tb_funcionarios SET token_reset = NULL, validade_token = NULL WHERE id = ?`;
        await this.db.ExecutaComandoNonQuery(sql, [id]);
    }
      
    async alterarSenha(novaSenha, id) {
        let sql = `UPDATE tb_funcionarios SET senha = ? WHERE id = ?`;
        await this.db.ExecutaComandoNonQuery(sql, [novaSenha, id]);
    }

    async buscarTokenValidoPorFuncionario(id) {
        let sql = `
            SELECT * FROM tb_funcionarios 
            WHERE id = ? 
              AND token_reset IS NOT NULL 
              AND validade_token > NOW()
        `;
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new FuncionarioEntity(
                row.id, row.nome, row.cpf, row.telefone, row.email,
                row.data_admissao, row.id_cargo, row.salario,
                row.status, row.id_tipo, row.senha,
                new CargoEntity(row.cargo_id, row.cargo_descricao),
                new TipoEntity(row.tipo_id, row.tipo_descricao)
            ));
        } else {
            return new FuncionarioEntity(
                rows.id, rows.nome, rows.cpf, rows.telefone, rows.email,
                rows.data_admissao, rows.id_cargo, rows.salario,
                rows.status, rows.id_tipo, rows.senha,
                new CargoEntity(rows.cargo_id, rows.cargo_descricao),
                new TipoEntity(rows.tipo_id, rows.tipo_descricao)
            );
        }
    }

}
