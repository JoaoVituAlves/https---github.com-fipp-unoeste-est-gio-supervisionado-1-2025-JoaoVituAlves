import BaseEntity from "./baseEntity.js";

export default class PagamentoEntity extends BaseEntity {
    
    #id;
    #metodo_pagamento;
    #situacao;
    #id_pedido;
    #parcelas;
    #valor_parcela;
    #valor_pago;
    #data;
    #data_vencimento;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get metodo_pagamento() {
        return this.#metodo_pagamento;
    }
    set metodo_pagamento(value) {
        this.#metodo_pagamento = value;
    }

    get situacao() {
        return this.#situacao;
    }
    set situacao(value) {
        this.#situacao = value;
    }

    get id_pedido() {
        return this.#id_pedido;
    }
    set id_pedido(value) {
        this.#id_pedido = value;
    }

    get parcelas() {
        return this.#parcelas;
    }
    set parcelas(value) {
        this.#parcelas = value;
    }

    get valor_parcela() {
        return this.#valor_parcela;
    }
    set valor_parcela(value) {
        this.#valor_parcela = value;
    }

    get valor_pago() {
        return this.#valor_pago;
    }
    set valor_pago(value) {
        this.#valor_pago = value;
    }

    get data() {
        return this.#data;
    }
    set data(value) {
        this.#data = value;
    }

    get data_vencimento() {
        return this.#data_vencimento;
    }
    set data_vencimento(value) {
        this.#data_vencimento = value;
    }

    constructor(id, metodo_pagamento, situacao, id_pedido, parcelas, valor_parcela, valor_pago, data, data_vencimento) {
        super();
        this.#id = id;
        this.#metodo_pagamento = metodo_pagamento;
        this.#situacao = situacao;
        this.#id_pedido = id_pedido;
        this.#parcelas = parcelas;
        this.#valor_parcela = valor_parcela;
        this.#valor_pago = valor_pago;
        this.#data = data;
        this.#data_vencimento = data_vencimento;
    }
}