import BaseEntity from "./baseEntity.js";

export default class PedidoEntity extends BaseEntity {
    
    #id;
    #id_cliente;
    #data_pedido;
    #status;
    #num_parcelas;
    #taxa_entrega;
    #valor_desconto;
    #valor_total;
    #id_funcionario;
    #opcao;
    #cep;
    #rua;
    #bairro;
    #cidade;
    #numero;
    #cliente;
    #pagamento;
    #itens;

    get id() {
        return this.#id;
    }
    set id(value) {
        this.#id = value;
    }

    get id_cliente() {
        return this.#id_cliente;
    }
    set id_cliente(value) {
        this.#id_cliente = value;
    }

    get data_pedido() {
        return this.#data_pedido;
    }
    set data_pedido(value) {
        this.#data_pedido = value;
    }

    get status() {
        return this.#status;
    }
    set status(value) {
        this.#status = value;
    }

    get num_parcelas() {
        return this.#num_parcelas;
    }
    set num_parcelas(value) {
        this.#num_parcelas = value;
    }

    get taxa_entrega() {
        return this.#taxa_entrega;
    }
    set taxa_entrega(value) {
        this.#taxa_entrega = value;
    }

    get valor_desconto() {
        return this.#valor_desconto;
    }
    set valor_desconto(value) {
        this.#valor_desconto = value;
    }

    get valor_total() {
        return this.#valor_total;
    }
    set valor_total(value) {
        this.#valor_total = value;
    }

    get id_funcionario() {
        return this.#id_funcionario;
    }
    set id_funcionario(value) {
        this.#id_funcionario = value;
    }

    get opcao() {
        return this.#opcao;
    }
    set opcao(value) {
        this.#opcao = value;
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

    get cliente() {
        return this.#cliente;
    }
    set cliente(value) {
        this.#cliente = value;
    }

    get pagamento() {
        return this.#pagamento;
    }
    set pagamento(value) {
        this.#pagamento = value;
    }

    get itens() {
        return this.#itens;
    }
    set itens(value) {
        this.#itens = value;
    }

    constructor(id, id_cliente, data_pedido, status, num_parcelas, taxa_entrega, valor_desconto, valor_total, id_funcionario, opcao, cep, rua, bairro, cidade, numero, cliente, pagamento, itens) {
        super();
        this.#id = id;
        this.#id_cliente = id_cliente;
        this.#data_pedido = data_pedido;
        this.#status = status;
        this.#num_parcelas = num_parcelas;
        this.#taxa_entrega = taxa_entrega;
        this.#valor_desconto = valor_desconto;
        this.#valor_total = valor_total;
        this.#id_funcionario = id_funcionario;
        this.#opcao = opcao;
        this.#cep = cep;
        this.#rua = rua;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#numero = numero;
        this.#cliente = cliente;
        this.#pagamento = pagamento;
        this.#itens = itens;
    }
}
