import BaseEntity from "./baseEntity.js";

export default class ProdutoEntity extends BaseEntity {
    
    #id;
    #nome;
    #descricao;
    #id_categoria;
    #marca;
    #preco;
    #quantidade;
    #data_validade;
    #id_fornecedor;
    #imagens;
    #status_web;
    #ativo;
    #categoria;
    #fornecedor;

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

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }

    get id_categoria() {
        return this.#id_categoria;
    }
    set id_categoria(value) {
        this.#id_categoria = value;
    }

    get marca() {
        return this.#marca;
    }
    set marca(value) {
        this.#marca = value;
    }

    get preco() {
        return this.#preco;
    }
    set preco(value) {
        this.#preco = value;
    }

    get quantidade() {
        return this.#quantidade;
    }
    set quantidade(value) {
        this.#quantidade = value;
    }

    get data_validade() {
        return this.#data_validade;
    }
    set data_validade(value) {
        this.#data_validade = value;
    }

    get id_fornecedor() {
        return this.#id_fornecedor;
    }
    set id_fornecedor(value) {
        this.#id_fornecedor = value;
    }

    get imagens() {
        return this.#imagens;
    }
    set imagens(value) {
        this.#imagens = value;
    }

    get status_web() {
        return this.#status_web;
    }
    set status_web(value) {
        this.#status_web = value;
    }

    get ativo() {
        return this.#ativo;
    }
    set ativo(value) {
        this.#ativo = value;
    }

    get categoria() {
        return this.#categoria;
    }
    set categoria(value) {
        this.#categoria = value;
    }

    get fornecedor() {
        return this.#fornecedor;
    }
    set fornecedor(value) {
        this.#fornecedor = value;
    }

    constructor(
        id, nome, descricao, id_categoria, marca, preco,
        quantidade, data_validade, id_fornecedor,
        imagens, status_web, ativo, categoria, fornecedor
    ) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#descricao = descricao;
        this.#id_categoria = id_categoria;
        this.#marca = marca;
        this.#preco = preco;
        this.#quantidade = quantidade;
        this.#data_validade = data_validade;
        this.#id_fornecedor = id_fornecedor;
        this.#imagens = imagens;
        this.#status_web = status_web;
        this.#ativo = ativo;
        this.#categoria = categoria;
        this.#fornecedor = fornecedor;
    }
}