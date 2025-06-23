import BaseEntity from "./baseEntity.js";

export default class FuncionarioEntity extends BaseEntity {
    
    #id;
    #nome;
    #cpf;
    #telefone;
    #email;
    #data_admissao;
    #id_cargo;
    #salario;
    #status;
    #id_tipo;
    #senha;
    #cargo;
    #tipo;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get nome() {
        return this.#nome;
    }
    set nome(value) {
        this.#nome = value;
    }

    get cpf() {
        return this.#cpf;
    }
    set cpf(value) {
        this.#cpf = value;
    }

    get telefone() {
        return this.#telefone;
    }
    set telefone(value) {
        this.#telefone = value;
    }

    get email() {
        return this.#email;
    }
    set email(value) {
        this.#email = value;
    }

    get data_admissao() {
        return this.#data_admissao;
    }
    set data_admissao(value) {
        this.#data_admissao = value;
    }

    get id_cargo() {
        return this.#id_cargo;
    }
    set id_cargo(value) {
        this.#id_cargo = value;
    }

    get salario() {
        return this.#salario;
    }
    set salario(value) {
        this.#salario = value;
    }

    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    get id_tipo() {
        return this.#id_tipo;
    }
    set id_tipo(value) {
        this.#id_tipo = value;
    }

    get senha() {
        return this.#senha;
    }
    set senha(value) {
        this.#senha = value;
    }

    get cargo() {
        return this.#cargo;
    }
    set cargo(value) {
        this.#cargo = value;
    }

    get tipo() {
        return this.#tipo;
    }
    set tipo(value) {
        this.#tipo = value;
    }

    constructor(id, nome, cpf, telefone, email, data_admissao, id_cargo, salario, status, id_tipo, senha, cargo, tipo) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#telefone = telefone;
        this.#email = email;
        this.#data_admissao = data_admissao;
        this.#id_cargo = id_cargo;
        this.#salario = salario;
        this.#status = status;
        this.#id_tipo = id_tipo;
        this.#senha = senha;
        this.#cargo = cargo;
        this.#tipo = tipo;
    }
}
