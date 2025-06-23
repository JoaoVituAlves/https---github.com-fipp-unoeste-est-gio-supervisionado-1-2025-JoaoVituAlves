"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import httpClient from "../../../utils/httpClient";
import { formatCurrency, formatDate } from "../../../utils/formatters";

export default function DetalhesPedido({ params }) {
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/pedidos/detalhes/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setPedido(data);
          console.log(data)
        } else {
          const errorData = await response.json();
          setError(errorData.msg || "Erro ao carregar detalhes do pedido");
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do pedido:", error);
        setError("Ocorreu um erro ao carregar os detalhes do pedido");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarPedido();
    }
  }, [id]);

  const cancelarPedido = async () => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      const response = await httpClient.put(`/pedidos/cancelar/${id}`);
      
      if (response.ok) {
        setPedido({
          ...pedido,
          status: 5,
          status_descricao: "Cancelado"
        });
        alert("Pedido cancelado com sucesso!");
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Erro ao cancelar pedido");
      }
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      alert("Ocorreu um erro ao cancelar o pedido");
    }
  };

  const gerarPagamento = async () => {
    try {
      const response = await httpClient.post("/pagamentos/gerarPagamento", {
        id_pedido: id
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = data.init_point;
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Erro ao gerar pagamento");
      }
    } catch (error) {
      console.error("Erro ao gerar pagamento:", error);
      alert("Ocorreu um erro ao gerar o pagamento");
    }
  };

  // Função para obter a classe de cor com base no status
  const getStatusClass = (status) => {
    switch (status) {
      case 1: return "bg-warning text-dark"; // Pendente
      case 2: return "bg-success text-white"; // Aprovado
      case 3: return "bg-info text-white"; // Em preparo
      case 4: return "bg-primary text-white"; // Em entrega
      case 5: return "bg-danger text-white"; // Cancelado
      case 6: return "bg-secondary text-white"; // Finalizado
      default: return "bg-light text-dark";
    }
  };

  // Função para obter o nome do método de pagamento
  const getMetodoPagamento = (metodo) => {
    switch (metodo) {
      case 1: return "PIX";
      case 2: return "Cartão";
      case 3: return "Boleto";
      case 4: return "Outro";
      default: return "Não definido";
    }
  };

  // Função para obter o nome da situação do pagamento
  const getSituacaoPagamento = (situacao) => {
    switch (situacao) {
      case 1: return "Pendente";
      case 2: return "Aprovado";
      case 3: return "Rejeitado";
      case 4: return "Cancelado";
      default: return "Desconhecido";
    }
  };

  // Função para obter a classe de cor com base na situação do pagamento
  const getSituacaoPagamentoClass = (situacao) => {
    switch (situacao) {
      case 1: return "bg-warning text-dark"; // Pendente
      case 2: return "bg-success text-white"; // Aprovado
      case 3: return "bg-danger text-white"; // Rejeitado
      case 4: return "bg-secondary text-white"; // Cancelado
      default: return "bg-light text-dark";
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Detalhes do Pedido #{id}</h1>
        <Link href="/home/meus-pedidos" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Meus Pedidos
        </Link>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando detalhes do pedido...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      ) : pedido ? (
        <div className="row g-4">
          {/* Informações do Pedido */}
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Informações do Pedido</h5>
                  <span className={`badge ${getStatusClass(pedido.status)}`}>
                    {pedido.status_descricao}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Número do Pedido</p>
                    <p className="mb-0 fw-bold">#{pedido.id}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Data do Pedido</p>
                    <p className="mb-0">{formatDate(pedido.data_pedido)}</p>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Forma de Recebimento</p>
                    <p className="mb-0">
                      {pedido.opcao === 1 ? (
                        <span><i className="fas fa-truck me-1"></i> Entrega</span>
                      ) : (
                        <span><i className="fas fa-store me-1"></i> Retirada na Loja</span>
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1 text-muted">Valor Total</p>
                    <p className="mb-0 fw-bold">{formatCurrency(pedido.valor_total)}</p>
                  </div>
                </div>
                
                {pedido.opcao === 1 ? (
                  <div className="mt-3">
                    <h6 className="mb-2">Endereço de Entrega</h6>
                    <p className="mb-0">
                      {pedido.rua}, {pedido.numero} - {pedido.bairro}<br />
                      {pedido.cidade} - CEP: {pedido.cep}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3">
                    <h6 className="mb-2">Endereço para Retirada</h6>
                    <p className="mb-0">
                      Rua Emílio Trevisan, 400 - Jardim Bela Dária<br />
                      Presidente Prudente - SP - CEP: 19013-200
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Itens do Pedido */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Itens do Pedido</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Produto</th>
                      <th className="text-center">Quantidade</th>
                      <th className="text-end">Preço Unit.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.itens && pedido.itens.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.imagem && (
                              <img 
                                src={item.imagem} 
                                alt={item.nome} 
                                className="me-3"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                              />
                            )}
                            <div>
                              <p className="mb-0 fw-medium">{item.nome}</p>
                              <small className="text-muted">Cód: {item.id_produto}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{item.quantidade}</td>
                        <td className="text-end">{formatCurrency(item.valor_unitario)}</td>
                        <td className="text-end fw-bold">
                          {formatCurrency(item.quantidade * item.valor_unitario)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td colSpan="3" className="text-end">Subtotal:</td>
                      <td className="text-end">
                        {formatCurrency(Number(pedido.valor_total) + Number(pedido.valor_desconto) - Number(pedido.taxa_entrega))}
                      </td>
                    </tr>
                    {pedido.taxa_entrega > 0 && (
                      <tr>
                        <td colSpan="3" className="text-end text-success">Taxa de Entrega:</td>
                        <td className="text-end text-success">
                          +{formatCurrency(pedido.taxa_entrega)}
                        </td>
                      </tr>
                    )}
                    {pedido.valor_desconto > 0 && (
                      <tr>
                        <td colSpan="3" className="text-end text-danger">Desconto:</td>
                        <td className="text-end text-danger">
                          -{formatCurrency(pedido.valor_desconto)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="3" className="text-end fw-bold">Total:</td>
                      <td className="text-end fw-bold fs-5">
                        {formatCurrency(pedido.valor_total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          {/* Pagamento e Ações */}
          <div className="col-lg-4">
            {/* Informações de Pagamento */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Pagamento</h5>
              </div>
              <div className="card-body">
                {pedido.pagamento ? (
                  <>
                    <div className="mb-3">
                      <p className="mb-1 text-muted">Status do Pagamento</p>
                      <span className={`badge ${getSituacaoPagamentoClass(pedido.pagamento.situacao)}`}>
                        {getSituacaoPagamento(pedido.pagamento.situacao)}
                      </span>
                    </div>
                    
                    {pedido.pagamento.metodo_pagamento && (
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Método de Pagamento</p>
                        <p className="mb-0">
                          {getMetodoPagamento(pedido.pagamento.metodo_pagamento)}
                          {pedido.pagamento.parcelas > 1 && (
                            <span className="ms-2 badge bg-light text-dark">
                              {pedido.pagamento.parcelas}x de {formatCurrency(pedido.pagamento.valor_parcela)}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {pedido.pagamento.valor_pago && (
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Valor Pago</p>
                        <p className="mb-0 fw-bold">{formatCurrency(pedido.pagamento.valor_pago)}</p>
                      </div>
                    )}
                    
                    {pedido.pagamento.data && (
                      <div className="mb-3">
                        <p className="mb-1 text-muted">Data do Pagamento</p>
                        <p className="mb-0">{formatDate(pedido.pagamento.data)}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="mb-3">
                      <i className="fas fa-exclamation-circle fa-3x text-warning"></i>
                    </div>
                    <h6>Pagamento Pendente</h6>
                    <p className="text-muted small">
                      Este pedido ainda não possui pagamento registrado.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Ações do Pedido */}
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Ações</h5>
              </div>
              <div className="card-body">
                {pedido.status === 1 ? (
                  <div className="d-grid gap-2">
                    <Link 
                      href={`/home/meus-pedidos/editar/${pedido.id}`}
                      className="btn btn-outline-primary"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Editar Pedido
                    </Link>
                    
                    <button 
                      className="btn btn-outline-danger"
                      onClick={cancelarPedido}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancelar Pedido
                    </button>
                    
                    <button 
                      className="btn btn-success"
                      onClick={gerarPagamento}
                    >
                      <i className="fas fa-credit-card me-2"></i>
                      Finalizar Pagamento
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="mb-3">
                      Este pedido está com status <strong>{pedido.status_descricao}</strong> e 
                      não pode ser modificado.
                    </p>
                    
                    {pedido.status === 5 && (
                      <div className="alert alert-danger" role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        Este pedido foi cancelado.
                      </div>
                    )}
                    
                    {pedido.status >= 2 && pedido.status <= 4 && (
                      <div className="alert alert-info" role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        Seu pedido está em processamento.
                      </div>
                    )}
                    
                    {pedido.status === 6 && (
                      <div className="alert alert-success" role="alert">
                        <i className="fas fa-check-circle me-2"></i>
                        Este pedido foi finalizado com sucesso.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Pedido não encontrado.
        </div>
      )}
    </div>
  );
}