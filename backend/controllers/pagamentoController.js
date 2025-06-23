import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import PagamentoRepository from "../repositories/pagamentoRepository.js";
import PedidoRepository from "../repositories/pedidoRepository.js";

// Inicialização do SDK v2
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-1653455944956950-060209-661bf8fa373e8c9f55eca76baf13f8aa-151224598'  // alterar token eduardo
});

export default class PagamentoController {
    
    async gerarPagamento(req, res) {
        try {
            const { id_pedido } = req.body;

            const pedidoRepo = new PedidoRepository();
            const pedido = await pedidoRepo.obter(id_pedido);

            if (!pedido) {
                return res.status(404).json({ msg: "Pedido não encontrado!" });
            }

            const valorTotal = parseFloat(pedido.valor_total);
            const dataAtual = new Date();
            const vencimento = new Date();
            vencimento.setHours(vencimento.getHours() + 1);

            // Configuração simplificada para o Checkout Pro
            const preferenceBody = {
                items: [
                    {
                        title: `Pedido #${id_pedido}`,
                        quantity: 1,
                        unit_price: valorTotal,
                        currency_id: "BRL"
                    }
                ],
                external_reference: `${id_pedido}`,
                notification_url: "https://bb6e-2804-7f0-90b2-85b9-fdb0-ce10-2530-957b.ngrok-free.app/pagamentos/webhook",
                back_urls: {
                    success: "https://bb6e-2804-7f0-90b2-85b9-fdb0-ce10-2530-957b.ngrok-free.app/home/pagamento/sucesso",
                    failure: "https://bb6e-2804-7f0-90b2-85b9-fdb0-ce10-2530-957b.ngrok-free.app/home/pagamento/erro",
                    pending: "https://bb6e-2804-7f0-90b2-85b9-fdb0-ce10-2530-957b.ngrok-free.app/home/pagamento/pendente"
                },
                auto_return: "approved",
                payment_methods: {
                excluded_payment_types: [
                    { id: "ticket" },   // boleto
                    { id: "atm" },      // pagamento em caixa eletrônico
                ],
                excluded_payment_methods: [
                    { id: "paypal" },
                ],
                installments: 12 // ou o máximo desejado
                },
            };

            console.log("Enviando configuração para o Mercado Pago:", JSON.stringify(preferenceBody, null, 2));

            // Criação da preferência
            const preference = new Preference(client);
            const response = await preference.create({ body: preferenceBody });

            console.log("Resposta do Mercado Pago:", JSON.stringify(response, null, 2));

            // Gravar o pagamento no banco de dados como pendente
            const pagamentoRepo = new PagamentoRepository();
            await pagamentoRepo.gravar({
                metodo_pagamento: 0, // Será definido quando o pagamento for concluído
                situacao: 1, // Pendente
                id_pedido,
                parcelas: null, // Será definido quando o pagamento for concluído
                valor_parcela: null, // Será definido quando o pagamento for concluído
                valor_pago: null, // Será definido quando o pagamento for concluído
                data: dataAtual,
                data_vencimento: vencimento
            });

            // Retornar a URL de redirecionamento
            res.status(201).json({
                msg: "Pagamento criado com sucesso!",
                init_point: response.init_point
            });

        } catch (erro) {
            console.error("Erro ao gerar pagamento:", erro);
            console.error("Detalhes do erro:", JSON.stringify(erro, null, 2));
            res.status(500).json({ msg: "Erro ao criar pagamento." });
        }
    }
    
    // Método para processar webhooks
    async webhook(req, res) {
        try {
            const { type, data } = req.query;

            console.log('Webhook recebido:', { type, data });

            if (type === 'payment' && data && data.id) {
            const payment = new Payment(client);
            const paymentInfo = await payment.get({ id: data.id });

            console.log('Informações do pagamento:', paymentInfo);

            const idPedido = paymentInfo.external_reference;

            let situacao;
            switch (paymentInfo.status) {
                case 'approved': situacao = 2; break;
                case 'rejected': situacao = 3; break;
                case 'cancelled': situacao = 4; break;
                default: situacao = 1; // pendente/in_process/pending
            }

            let metodoPagamento;
            switch (paymentInfo.payment_method_id) {
                case 'pix': metodoPagamento = 1; break;
                case 'credit_card':
                case 'debit_card': metodoPagamento = 2; break;
                case 'ticket': metodoPagamento = 3; break;
                default: metodoPagamento = 4; // outro
            }

            const pagamentoRepo = new PagamentoRepository();
            const pagamentos = await pagamentoRepo.listarPorPedido(idPedido);

            if (pagamentos.length > 0) {
                const pagamento = pagamentos[0];
                await pagamentoRepo.atualizarStatus({
                id: pagamento.id,
                situacao,
                metodo_pagamento: metodoPagamento,
                parcelas: paymentInfo.installments || 1,
                valor_parcela: paymentInfo.installments
                    ? (paymentInfo.transaction_amount / paymentInfo.installments).toFixed(2)
                    : paymentInfo.transaction_amount,
                valor_pago: paymentInfo.transaction_amount,
                });

                if (situacao === 2) {
                const pedidoRepo = new PedidoRepository();
                await pedidoRepo.atualizarStatus(idPedido, 2); // pedido pago
                }
            }
            }

            res.status(200).send('OK');
        } catch (error) {
            console.error('Erro ao processar webhook:', error);
            res.status(200).send('OK'); // Retorna OK para evitar reenvio
        }
    }

    // Adicionar método para gerar novo pagamento para pedido editado
    async gerarNovoPagamento(req, res) {
        try {
            const { id_pedido } = req.body;
            
            // Verificar se já existe um pagamento pendente
            const pagamentoRepo = new PagamentoRepository();
            const pagamentos = await pagamentoRepo.listarPorPedido(id_pedido);
            
            // Se existir pagamento pendente, cancelar
            if (pagamentos.length > 0) {
                const pagamento = pagamentos[0];
                // Atualizar status para cancelado (4)
                await pagamentoRepo.atualizarStatus({
                    id: pagamento.id,
                    situacao: 4 // Cancelado
                });
            }
            
            // Gerar novo pagamento
            const pedidoRepo = new PedidoRepository();
            const pedido = await pedidoRepo.obter(id_pedido);
            
            if (!pedido) {
                return res.status(404).json({ msg: "Pedido não encontrado!" });
            }
            
            const valorTotal = parseFloat(pedido.valor_total);
            const dataAtual = new Date();
            const vencimento = new Date();
            vencimento.setHours(vencimento.getHours() + 1);
            
            // Configuração para o Checkout Pro
            const preferenceBody = {
                items: [
                    {
                        title: `Pedido #${id_pedido} (Atualizado)`,
                        quantity: 1,
                        unit_price: valorTotal,
                        currency_id: "BRL"
                    }
                ],
                external_reference: `${id_pedido}`,
                notification_url: "https://381d-2804-7f0-90b2-a334-8ce-7bc6-adf2-f140.ngrok-free.app/pagamentos/webhook",
                back_urls: {
                    success: "https://381d-2804-7f0-90b2-a334-8ce-7bc6-adf2-f140.ngrok-free.app/home/pagamento/sucesso",
                    failure: "https://381d-2804-7f0-90b2-a334-8ce-7bc6-adf2-f140.ngrok-free.app/home/pagamento/erro",
                    pending: "https://381d-2804-7f0-90b2-a334-8ce-7bc6-adf2-f140.ngrok-free.app/home/pagamento/pendente"
                },
                auto_return: "approved"
            };
            
            // Criação da preferência
            const preference = new Preference(client);
            const response = await preference.create({ body: preferenceBody });
            
            // Gravar o novo pagamento no banco de dados como pendente
            await pagamentoRepo.gravar({
                metodo_pagamento: 0, // Será definido quando o pagamento for concluído
                situacao: 1, // Pendente
                id_pedido,
                parcelas: null,
                valor_parcela: null,
                valor_pago: null,
                data: dataAtual,
                data_vencimento: vencimento
            });
            
            // Retornar a URL de redirecionamento
            res.status(201).json({
                msg: "Novo pagamento criado com sucesso!",
                init_point: response.init_point
            });
            
        } catch (erro) {
            console.error("Erro ao gerar novo pagamento:", erro);
            res.status(500).json({ msg: "Erro ao criar novo pagamento." });
        }
    }
}