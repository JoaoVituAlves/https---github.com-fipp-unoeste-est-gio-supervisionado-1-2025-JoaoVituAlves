import BaseEntity from "./baseEntity.js";

export default class UnidadeEntity extends BaseEntity {
    
    #id;
    #descricao;
    #sigla;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get descricao() {
        return this.#descricao;
    }
    set descricao(value) {
        this.#descricao = value;
    }
        get sigla() {
        return this.#sigla;
    }
    set sigla(value) {
        this.#sigla = value;
    }

    constructor(id, descricao, sigla) {
        super();
        this.#id = id;
        this.#descricao = descricao;
        this.#sigla = sigla;
    }
}
