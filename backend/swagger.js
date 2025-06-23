import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "DUMED HOSPITALAR - API",
        description: "API criada utilizando o padrão REST para sistema ecommerce DUMED CARE"
    },
    host: 'localhost:5000',
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        },
        schemas: {
            Pedido: {
                id_cliente: 1,
                data_pedido: "2025-05-10",
                status: "aberto",
                num_parcelas: 3,
                taxa_entrega: 10.00,
                valor_desconto: 5.00,
                valor_total: 100.00,
                id_funcionario: 2,
                opcao: "entrega",
                cep: "12345678",
                rua: "Rua Exemplo",
                bairro: "Centro",
                cidade: "São Paulo",
                numero: 100
            },
            PedidoItem: {
                id_produto: 1,
                quantidade: 2
            },
            PedidoCompleto: {
                pedido: {
                    $ref: "#/components/schemas/Pedido"
                },
                itens: [
                    {
                        $ref: "#/components/schemas/PedidoItem"
                    }
                ]
            },
            Orcamento: {
                cidade: "Pres. Prudente",
                prazo_validade: "5 DIAS",
                prazo_entrega: "10 DIAS",
                id_funcionario: 9
            },
            OrcamentoItem: {
                id_orcamento: 6,
                descricao: "Pasta de dente",
                marca: "Dental Cream",
                valor_unitario: 10,
                id_unidade: 1,
                quantidade: 2
            },
            OrcamentoCompleto: {
                orcamento: {
                    $ref: "#/components/schemas/Orcamento"
                },
                itens: [
                    {
                        $ref: "#/components/schemas/OrcamentoItem"
                    }
                ]
            },
            Pagamento: {
                metodo_pagamento: 1,
                id_pedido: 1,
                parcelas: 3
            },
        },
        '@schemas': {
            produtoModel: {
                type: 'object',
                properties: {
                    id: {
                        type: "integer",
                        required: true,
                    },
                    nome: {
                        type: "string",
                        required: true,
                    },
                    descricao: {
                        type: "string",
                        required: true,
                    },
                    id_categoria: {
                        type: "integer",
                        required: true,
                    },
                    marca: {
                        type: "string",
                        required: true,
                    },
                    preco: {
                        type: "number",
                        required: true,
                    },
                    quantidade: {
                        type: "number",
                        required: true,
                    },
                    data_validade: {
                        type: "string",
                        required: true,
                    },
                    id_fornecedor: {
                        type: "integer",
                        required: true,
                    },
                    imagens: {
                        type: "array",
                        items: {
                            type: "string",
                            format: "binary"
                        }
                    },
                    status_web: {
                        type: "integer",
                        required: true,
                    },
                    ativo: {
                        type: "integer",
                        required: true,
                    }
                }
            },
        },
    }
};

const outputJson = "./swagger-output.json";
const routes = ['./server.js'];

swaggerAutogen({ openapi: '3.0.0' })(outputJson, routes, doc)
.then(async () => {
    await import('./server.js');
});