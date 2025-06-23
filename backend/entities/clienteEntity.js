import BaseEntity from "./baseEntity.js";

export default class ClienteEntity extends BaseEntity {

    #id;
    #nome;
    #email;
    #cpf;
    #telefone;
    #senha;
    #tipo;
    #cnpj;
    #razao_social;
    #insc_estadual;
    #cep;
    #rua;
    #bairro;
    #cidade;
    #numero;
    #status;

    constructor(id, nome, email, cpf, telefone, senha, tipo, cnpj, razao_social, insc_estadual, cep, rua, bairro, cidade, numero, status) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#cpf = cpf;
        this.#telefone = telefone;
        this.#senha = senha;
        this.#tipo = tipo;
        this.#cnpj = cnpj;
        this.#razao_social = razao_social;
        this.#insc_estadual = insc_estadual;
        this.#cep = cep;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#numero = numero;
        this.#status = status;
    }

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

    get email() {
        return this.#email; 
    }
    set email(value) {
         this.#email = value; 
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

    get senha() {
         return this.#senha; 
    }
    set senha(value) {
         this.#senha = value; 
    }

    get tipo() {
         return this.#tipo; 
    }
    set tipo(value) {
         this.#tipo = value; 
    }

    get cnpj() {
         return this.#cnpj; 
    }
    set cnpj(value) { 
        this.#cnpj = value; 
    }

    get razao_social() {
         return this.#razao_social; 
    }
    set razao_social(value) {
         this.#razao_social = value; 
    }

    get insc_estadual() { 
        return this.#insc_estadual; 
     }
    set insc_estadual(value) 
    { 
        this.#insc_estadual = value; 
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
}
