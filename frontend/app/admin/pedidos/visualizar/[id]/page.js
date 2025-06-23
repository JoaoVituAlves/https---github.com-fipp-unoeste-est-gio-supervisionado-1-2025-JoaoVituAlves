'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import httpClient from '../../../../utils/httpClient';
import Link from 'next/link';
import { gerarPedidoPDF } from "../../../../utils/pedidoPdf";

export default function VisualizarPedido() {
    const { id } = useParams();
    const router = useRouter();
    const [pedido, setPedido] = useState(null);

    useEffect(() => {
        httpClient.get(`/pedidos/detalhes/${id}`)
            .then(r => r.json())
            .then(setPedido)
            .catch(console.error);
    }, [id]);

    const formatar = Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });

    if (!pedido) return <p>Carregando pedido...</p>;

    // Função para mapear o status para o texto e a classe da badge
    const obterStatus = (status) => {
        switch (status) {
            case 1:
                return { texto: 'Pendente', classe: 'bg-secondary' };
            case 2:
                return { texto: 'Aprovado', classe: 'bg-primary' };
            case 3:
                return { texto: 'Em Preparo', classe: 'bg-info' };
            case 4:
                return { texto: 'Em Entrega', classe: 'bg-warning' };
            case 5:
                return { texto: 'Cancelado', classe: 'bg-danger' };
            case 6:
                return { texto: 'Finalizado', classe: 'bg-success' };
            default:
                return { texto: 'Desconhecido', classe: 'bg-dark' };
        }
    };
    const statusInfo = obterStatus(pedido.status);

    const obterMetodoPagamento = (codigo) => {
        switch (codigo) {
            case 1:
                return "Pix";
            case 2:
                return "Cartão";
            case 0:
                return "Indefinido";
            default:
                return "Desconhecido";
        }
    };

    const totalItens = pedido.itens?.reduce((acc, item) => {
        return acc + (item.quantidade * item.valor_unitario);
    }, 0);


    return (
        <div className="container mt-4">
            <h2>Pedido #{pedido.id}</h2>

            <div className="mb-4">
                <p><strong>Cliente:</strong> {pedido.cliente_nome}</p>
                <p><strong>Data do Pedido:</strong> {new Date(pedido.data_pedido).toLocaleDateString()}</p>
                <p>
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${statusInfo.classe}`}>{statusInfo.texto}</span>
                </p>
                <p><strong>Número de Parcelas:</strong> {pedido.num_parcelas}</p>
                <p><strong>Método de Pagamento:</strong> {obterMetodoPagamento(pedido.metodo_pagamento)}</p>
                <p><strong>Opção de Entrega:</strong>{' '}
                    {pedido.opcao === 1 ? (
                        <span className="badge bg-info">Entrega</span>
                    ) : (
                        <span className="badge bg-success">Retirada no Local</span>
                    )}
                </p>

                {pedido.opcao === 1 && (
                    <div className="card mt-3 border-info shadow-sm">
                        <div className="card-header bg-info text-white">
                            <i className="fas fa-map-marker-alt me-2"></i> Endereço de Entrega
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-2">
                                    <strong>CEP:</strong> {pedido.cep}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Rua:</strong> {pedido.rua}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Número:</strong> {pedido.numero}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Bairro:</strong> {pedido.bairro}
                                </div>
                                <div className="col-md-6 mb-2">
                                    <strong>Cidade:</strong> {pedido.cidade}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <h4>Itens do Pedido</h4>
            {pedido.itens?.length > 0 ? (
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Produto</th>
                            <th>Quantidade</th>
                            <th>Preço Unitário</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedido.itens.map((item, index) => (
                            <tr key={index}>
                                <td>{item.nome}</td>
                                <td>{item.quantidade}</td>
                                <td>{formatar.format(item.valor_unitario)}</td>
                                <td>{formatar.format(item.quantidade * item.valor_unitario)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-muted">Nenhum item encontrado neste pedido.</p>
            )}

            {pedido.itens?.length > 0 && (
                <div className="card mt-4 shadow-sm">
                    <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">Resumo Financeiro</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Total dos Itens:</strong> {formatar.format(totalItens)}</p>
                                <p><strong>Desconto Aplicado:</strong> {formatar.format(pedido.valor_desconto)}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Taxa de Entrega:</strong> {formatar.format(pedido.taxa_entrega)}</p>
                                <p className="fs-5 fw-bold mt-3 border-top pt-2">
                                    <strong>Total Final:</strong>{' '}
                                    {formatar.format(pedido.valor_total)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <br/>
            <button className="btn btn-secondary" onClick={() => gerarPedidoPDF(pedido, pedido.id)}>
              <i className="fas fa-print"></i> Gerar PDF
            </button>
            <div className="mt-3">
                <button className="btn btn-outline-primary" onClick={() => router.back()}>
                    <i className="fas fa-arrow-left me-1"></i> Voltar
                </button>
            </div>
        </div>
    );
}