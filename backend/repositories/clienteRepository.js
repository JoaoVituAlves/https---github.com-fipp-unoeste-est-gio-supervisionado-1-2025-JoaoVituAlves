import ClienteEntity from "../entities/clienteEntity.js";
import BaseRepository from "./baseRepository.js";
import bcrypt from 'bcrypt';

export default class ClienteRepository extends BaseRepository {
    constructor(db) {
        super(db);
    }

    async validarAcesso(cpf, senhaDigitada) {
        let sql = "SELECT * FROM tb_clientes WHERE cpf = ?";
        let valores = [cpf];

        let rows = await this.db.ExecutaComando(sql, valores);
        if (rows.length === 0) return null;

        let cliente = this.toMap(rows[0]);

        const senhaCorreta = await bcrypt.compare(senhaDigitada, cliente.senha);
        if (!senhaCorreta) return null;

        return cliente;
    }

    async listar() {
        let sql = "SELECT * FROM tb_clientes";
        let rows = await this.db.ExecutaComando(sql);
        return this.toMap(rows);
    }

    async obter(id) {
        let sql = "SELECT * FROM tb_clientes WHERE id = ?";
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async listarTopClientesPedidos() {
        const sql = `
            SELECT c.nome, COUNT(p.id) AS total_pedidos
            FROM tb_clientes c
            JOIN tb_pedidos p ON p.id_cliente = c.id
            GROUP BY c.id, c.nome
            ORDER BY total_pedidos DESC
            LIMIT 5;
        `;
        let rows = await this.db.ExecutaComando(sql);
        return rows;
    }

    //gravar
    async buscarCpfCnpjGravar(cpf, cnpj) {
        let sql = `SELECT * FROM tb_clientes WHERE `;
        let valores = [];
    
        if (cpf) {
            sql += `cpf = ?`;
            valores.push(cpf);
        }
    
        if (cnpj) {
            if (valores.length > 0) sql += ` OR `;
            sql += `cnpj = ?`;
            valores.push(cnpj);
        }
    
        if (valores.length === 0)
            return null; 
    
        let rows = await this.db.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }
    

    //alterar
    async buscarCpfCnpj(cpf, cnpj, idAtual) {
        let sql = `
            SELECT * FROM tb_clientes 
            WHERE (cpf = ? OR cnpj = ?) AND id <> ?
        `;
        let valores = [cpf, cnpj, idAtual];
        
        let rows = await this.db.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }
    
    async buscarEmail(email) {
        let sql = `
            SELECT * FROM tb_clientes 
            WHERE email = ?
        `;
        let valores = [email];
        let rows = await this.db.ExecutaComando(sql, valores);
        return rows.length > 0 ? rows[0] : null;
    }   

    async gravar(entidade) {
        let sql = `INSERT INTO tb_clientes 
                    (nome, email, cpf, telefone, senha, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        let valores = [
            entidade.nome, entidade.email, entidade.cpf, entidade.telefone, entidade.senha,
            entidade.tipo, entidade.cnpj, entidade.razao_social, entidade.insc_estadual,
            entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero, entidade.status
        ];

        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alterar(entidade) {
        let sql = `UPDATE tb_clientes SET 
                    nome = ?, 
                    email = ?, 
                    cpf = ?, 
                    telefone = ?, 
                    senha = ?, 
                    tipo = ?, 
                    cnpj = ?, 
                    razao_social = ?, 
                    insc_estadual = ?, 
                    cep = ?, 
                    rua = ?, 
                    bairro = ?, 
                    cidade = ?, 
                    numero = ?,
                    status = ?
                    WHERE id = ?`;

        let valores = [
            entidade.nome, entidade.email, entidade.cpf, entidade.telefone, entidade.senha,
            entidade.tipo, entidade.cnpj, entidade.razao_social, entidade.insc_estadual,
            entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero, entidade.status,
            entidade.id
        ];

        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async alteracaoParcial(entidade) {
        let sql = `UPDATE tb_clientes SET 
                    nome = COALESCE(?, nome), 
                    email = COALESCE(?, email), 
                    cpf = COALESCE(?, cpf), 
                    telefone = COALESCE(?, telefone), 
                    senha = COALESCE(?, senha), 
                    tipo = COALESCE(?, tipo), 
                    cnpj = COALESCE(?, cnpj), 
                    razao_social = COALESCE(?, razao_social), 
                    insc_estadual = COALESCE(?, insc_estadual), 
                    cep = COALESCE(?, cep), 
                    rua = COALESCE(?, rua), 
                    bairro = COALESCE(?, bairro), 
                    cidade = COALESCE(?, cidade), 
                    numero = COALESCE(?, numero),
                    status = COALESCE(?, status),
                    WHERE id = ?`;

        let valores = [
            entidade.nome, entidade.email, entidade.cpf, entidade.telefone, entidade.senha,
            entidade.tipo, entidade.cnpj, entidade.razao_social, entidade.insc_estadual,
            entidade.cep, entidade.rua, entidade.bairro, entidade.cidade, entidade.numero, entidade.status,
            entidade.id
        ];

        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async deletar(id) {
        let sql = "DELETE FROM tb_clientes WHERE id = ?";
        let valores = [id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }

    async criarNovaSenha(senha, id) {
        let sql = "UPDATE tb_clientes SET senha = ? WHERE id = ?";
        let valores = [senha, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }   

    async salvarTokenReset(id, token, validade) {
        let sql = `UPDATE tb_clientes SET token_reset = ?, validade_token = ? WHERE id = ?`;
        let valores = [token, validade, id];
        return await this.db.ExecutaComandoNonQuery(sql, valores);
    }
      
    async buscarPorToken(token) {
        let sql = `SELECT * FROM tb_clientes WHERE token_reset = ?`;
        let valores = [token];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }
      
    async removerToken(id) {
        let sql = `UPDATE tb_clientes SET token_reset = NULL, validade_token = NULL WHERE id = ?`;
        await this.db.ExecutaComandoNonQuery(sql, [id]);
    }
      
    async alterarSenha(novaSenha, id) {
        let sql = `UPDATE tb_clientes SET senha = ? WHERE id = ?`;
        await this.db.ExecutaComandoNonQuery(sql, [novaSenha, id]);
    }

    async buscarTokenValidoPorCliente(id) {
        let sql = `
            SELECT * FROM tb_clientes 
            WHERE id = ? 
              AND token_reset IS NOT NULL 
              AND validade_token > NOW()
        `;
        let valores = [id];
        let row = await this.db.ExecutaComando(sql, valores);
        return row.length > 0 ? this.toMap(row[0]) : null;
    }

    async inativar(id) {
        const sql = `UPDATE tb_clientes SET status = 0 WHERE id = ? AND status != 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    async ativar(id) {
        let sql = `UPDATE tb_clientes SET status = 1 WHERE id = ? AND status = 0`;
        return await this.db.ExecutaComandoNonQuery(sql, [id]);
    }

    toMap(rows) {
        if (Array.isArray(rows)) {
            return rows.map(row => new ClienteEntity(
                row.id, row.nome, row.email, row.cpf, row.telefone, row.senha, row.tipo,
                row.cnpj, row.razao_social, row.insc_estadual, row.cep, row.rua,
                row.bairro, row.cidade, row.numero, row.status
            ));
        } else {
            return new ClienteEntity(
                rows.id, rows.nome, rows.email, rows.cpf, rows.telefone, rows.senha, rows.tipo,
                rows.cnpj, rows.razao_social, rows.insc_estadual, rows.cep, rows.rua,
                rows.bairro, rows.cidade, rows.numero, rows.status
            );
        }
    }
}
