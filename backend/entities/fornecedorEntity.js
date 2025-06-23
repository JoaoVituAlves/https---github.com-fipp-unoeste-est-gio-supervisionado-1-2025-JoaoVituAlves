import BaseEntity from "./baseEntity.js";

export default class FornecedorEntity extends BaseEntity {
    
    #id;
    #nome_fantasia;
    #razao_social;
    #cnpj;
    #telefone;
    #email;
    #cep;
    #rua;
    #bairro;
    #cidade;
    #numero;
    #status;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get nome_fantasia() {
        return this.#nome_fantasia;
    }
    set nome_fantasia(value) {
        this.#nome_fantasia = value;
    }

    get razao_social() {
        return this.#razao_social;
    }
    set razao_social(value) {
        this.#razao_social = value;
    }

    get cnpj() {
        return this.#cnpj;
    }
    set cnpj(value) {
        this.#cnpj = value;
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

    get cep() {
        return this.#cep;
    }
    set cep(value) {
        this.#cep = value;
    }

    get rua() {
        return this.#rua;
    }
    set rua(value) {
        this.#rua = value;
    }

    get bairro() {
        return this.#bairro;
    }
    set bairro(value) {
        this.#bairro = value;
    }

    get cidade() {
        return this.#cidade;
    }
    set cidade(value) {
        this.#cidade = value;
    }

    get numero() {
        return this.#numero;
    }
    set numero(value) {
        this.#numero = value;
    }
    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    constructor(id, razao_social, nome_fantasia, cnpj, telefone, email, cep, rua, bairro, cidade, numero,status) {
        super();
        this.#id = id;
        this.#razao_social = razao_social;
        this.#nome_fantasia = nome_fantasia;
        this.#cnpj = cnpj;
        this.#telefone = telefone;
        this.#email = email;
        this.#cep = cep;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#numero = numero;
        this.#status = status;
    }
}