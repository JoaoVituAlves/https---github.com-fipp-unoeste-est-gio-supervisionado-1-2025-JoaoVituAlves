import BaseEntity from "./baseEntity.js";

export default class PedidoItemEntity extends BaseEntity {
    
    #id;
    #id_pedido;
    #id_produto;
    #quantidade;
    #valor_unitario;
    #produto;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get id_pedido() {
        return this.#id_pedido;
    }
    set id_pedido(value) {
        this.#id_pedido = value;
    }

    get id_produto() {
        return this.#id_produto;
    }
    set id_produto(value) {
        this.#id_produto = value;
    }

    get quantidade() {
        return this.#quantidade;
    }
    set quantidade(value) {
        this.#quantidade = value;
    }

    get valor_unitario() {
        return this.#valor_unitario;
    }
    set valor_unitario(value) {
        this.#valor_unitario = value;
    }

    get produto() {
        return this.#produto;
    }
    set produto(value) {
        this.#produto = value;
    }

    constructor(id, id_pedido, id_produto, quantidade, valor_unitario, produto) {
        super();
        this.#id = id;
        this.#id_pedido = id_pedido;
        this.#id_produto = id_produto;
        this.#quantidade = quantidade;
        this.#valor_unitario = valor_unitario;
        this.#produto = produto;
    }
}
