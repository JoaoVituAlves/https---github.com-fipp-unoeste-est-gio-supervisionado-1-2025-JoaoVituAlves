import BaseEntity from "./baseEntity.js";

export default class OrcamentoEntity extends BaseEntity {

    #id;
    #cidade;
    #prazo_validade;
    #prazo_entrega;
    #id_funcionario;
    #status;
    #data;
    #funcionario;
    #itens;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get cidade() {
        return this.#cidade;
    }
    set cidade(value) {
        this.#cidade = value;
    }

    get prazo_validade() {
        return this.#prazo_validade;
    }
    set prazo_validade(value) {
        this.#prazo_validade = value;
    }

    get prazo_entrega() {
        return this.#prazo_entrega;
    }
    set prazo_entrega(value) {
        this.#prazo_entrega = value;
    }

    get id_funcionario() {
        return this.#id_funcionario;
    }
    set id_funcionario(value) {
        this.#id_funcionario = value;
    }

    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    get data() {
        return this.#data;
    }
    set data(value) {
        this.#data = value;
    }

    get funcionario() {
        return this.#funcionario;
    }
    set funcionario(value) {
        this.#funcionario = value;
    }

    get itens() {
        return this.#itens;
    }
    set itens(value) {
        this.#itens = value;
    }

    constructor(id, cidade, prazo_validade = '10 dias', prazo_entrega = '5 dias', id_funcionario, status, data, funcionario, itens) {
        super();
        this.#id = id;
        this.#cidade = cidade;
        this.#prazo_validade = prazo_validade;
        this.#prazo_entrega = prazo_entrega;   
        this.#id_funcionario = id_funcionario;
        this.#status = status;
        this.#data = data;
        this.#funcionario = funcionario;
        this.#itens = itens;
    }
}
