import BaseEntity from "./baseEntity.js";

export default class OrcamentoItemEntity extends BaseEntity {

    #id;
    #id_orcamento;
    #descricao;
    #marca;
    #valor_unitario;
    #id_unidade;
    #quantidade;
    #sigla_unidade;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get id_orcamento() {
        return this.#id_orcamento;
    }
    set id_orcamento(value) {
        this.#id_orcamento = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }

    get marca() {
        return this.#marca;
    }
    set marca(value) {
        this.#marca = value;
    }

    get valor_unitario() {
        return this.#valor_unitario;
    }
    set valor_unitario(value) {
        this.#valor_unitario = value;
    }

    get id_unidade() {
        return this.#id_unidade;
    }
    set id_unidade(value) {
        this.#id_unidade = value;
    }

    get quantidade() {
        return this.#quantidade;
    }
    set quantidade(value) {
        this.#quantidade = value;
    }

    get sigla_unidade() {
        return this.#sigla_unidade;
    }
    set sigla_unidade(value) {
        this.#sigla_unidade = value;
    }

    constructor(id, id_orcamento, descricao, marca, valor_unitario, id_unidade, quantidade, sigla_unidade) {
        super();
        this.#id = id;
        this.#id_orcamento = id_orcamento;
        this.#descricao = descricao;
        this.#marca = marca;
        this.#valor_unitario = valor_unitario;
        this.#id_unidade = id_unidade;
        this.#quantidade = quantidade;
        this.#sigla_unidade = sigla_unidade;
    }
}
