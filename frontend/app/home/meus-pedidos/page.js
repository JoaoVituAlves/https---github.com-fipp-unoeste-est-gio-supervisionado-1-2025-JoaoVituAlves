"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import httpClient from "../../utils/httpClient";
import { formatCurrency } from "../../utils/formatters";
import "../../../public/template/css/modalCustom.css";

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idCliente, setIdCliente] = useState(null);
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Pega o cliente do localStorage
    const clienteStr = localStorage.getItem('cliente');
    if (clienteStr) {
      const cliente = JSON.parse(clienteStr);
      setIdCliente(cliente.id); // Supondo que o objeto cliente tenha a propriedade 'id'
    } else {
      // Se não tiver cliente logado, pode redirecionar ou exibir mensagem
      alert('Cliente não está logado!');
    }
  }, []);

  useEffect(() => {
    if (!idCliente) return;

    async function fetchPedidos() {
      try {
        const res = await httpClient.get(`/pedidos/cliente/${idCliente}`);
        if (!res.ok) throw new Error('Erro ao buscar pedidos');
        const data = await res.json();
        setPedidos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [idCliente]);

  const cancelarPedido = async (id) => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
      return;
    }

    try {
      const response = await httpClient.put(`/pedidos/cancelar/${id}`);
      
      if (response.ok) {
        // Atualizar a lista de pedidos
        setPedidos(pedidos.map(pedido => 
          pedido.id === id 
            ? { ...pedido, status: 5, status_descricao: "Cancelado" } 
            : pedido
        ));
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

  const gerarPagamento = async (id) => {
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
  const getMetodoPagamento = (metodo_pagamento) => {
    switch (metodo_pagamento) {
      case 1: return "PIX";
      case 2: return "Cartão";
      case 3: return "Boleto";
      case 4: return "Outro";
      default: return "Não definido";
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Meus Pedidos
        <button
          type="button"
          onClick={() => setMostrarAjuda(true)}
          title="Ajuda"
          style={{
            background: 'none',
            border: 'none',
            color: '#0d6efd',
            marginLeft: '10px',
            cursor: 'pointer',
            fontSize: '1.2rem',
          }}
          aria-label="Abrir ajuda"
        >
          <i className="fas fa-question-circle"></i>
        </button>
      </h1>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando seus pedidos...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center my-5">
          <div className="mb-4">
            <i className="fas fa-shopping-bag fa-4x text-muted"></i>
          </div>
          <h3>Você ainda não realizou nenhum pedido</h3>
          <p className="text-muted">Que tal começar a comprar agora?</p>
          <Link href="/home/produtos" className="btn btn-primary mt-3">
            <i className="fas fa-shopping-cart me-2"></i>
            Ver Produtos
          </Link>
        </div>
      ) : (
        <>
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <div className="row align-items-center">
                <div className="col">
                  <h5 className="mb-0">Seus Pedidos Recentes</h5>
                </div>
                <div className="col-auto">
                  <span className="badge bg-primary rounded-pill">
                    {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th>Nº Pedido</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Valor Total</th>
                    <th>Pagamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>
                        <strong>#{pedido.id}</strong>
                      </td>
                      <td>{pedido.data_formatada}</td>
                      <td>
                        <span className={`badge ${getStatusClass(pedido.status)}`}>
                          {pedido.status_descricao}
                        </span>
                      </td>
                      <td>{formatCurrency(pedido.valor_total)}</td>
                      <td>
                        {pedido.pagamento ? (
                          <>
                            <span className="badge bg-info text-white me-1">
                              {getMetodoPagamento(pedido.pagamento.metodo_pagamento)}
                            </span>
                            {pedido.pagamento.parcelas > 1 && (
                              <small className="text-muted">
                                {pedido.pagamento.parcelas}x
                              </small>
                            )}
                          </>
                        ) : (
                          <span className="badge bg-warning text-dark">Sem pagamento</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            href={`/home/meus-pedidos/${pedido.id}`}
                            className="btn btn-sm btn-outline-primary me-1"
                            title="Ver detalhes"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          
                          {pedido.status === 1 && (
                            <>
                              <Link 
                                href={`/home/meus-pedidos/editar/${pedido.id}`}
                                className="btn btn-sm btn-outline-secondary me-1"
                                title="Editar pedido"
                              >
                                <i className="fas fa-edit"></i>
                              </Link>
                              
                              <button 
                                className="btn btn-sm btn-outline-danger me-1"
                                onClick={() => cancelarPedido(pedido.id)}
                                title="Cancelar pedido"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              
                              <button 
                                className="btn btn-sm btn-success me-1"
                                onClick={() => gerarPagamento(pedido.id)}
                                title="Finalizar pagamento"
                              >
                                <i className="fas fa-credit-card"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Legenda de Status</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-warning text-dark me-2">Pendente</span>
                    <small>Aguardando pagamento</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success text-white me-2">Aprovado</span>
                    <small>Pagamento confirmado</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info text-white me-2">Em preparo</span>
                    <small>Pedido sendo preparado</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary text-white me-2">Em entrega</span>
                    <small>Pedido a caminho</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-danger text-white me-2">Cancelado</span>
                    <small>Pedido cancelado</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center">
                    <span className="badge bg-secondary text-white me-2">Finalizado</span>
                    <small>Pedido entregue</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de Ajuda */}
      {mostrarAjuda && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content animate__animated animate__fadeInDown">
                      <div className="modal-header">
                          <h5 className="modal-title">Ajuda: Como usar esta página</h5>
                          <button type="button" className="btn-close" onClick={() => setMostrarAjuda(false)}></button>
                      </div>
                      <div className="modal-body">
                        <p>Esta página exibe todos os pedidos que você realizou na loja. Aqui estão algumas dicas de como utilizá-la:</p>
                        <ul>
                          <li><strong>Lista de Pedidos:</strong> Veja todos os seus pedidos com informações como número, data, status, valor total e forma de pagamento.</li>
                          <li><strong>Status do Pedido:</strong> Um selo colorido indica a situação atual do seu pedido, como <em>Pendente</em>, <em>Aprovado</em>, <em>Em entrega</em>, etc.</li>
                          <li><strong>Ações Disponíveis:</strong>
                            <ul>
                              <li><i className="fas fa-eye"></i> <strong>Ver detalhes:</strong> Acesse informações completas do pedido.</li>
                              <li><i className="fas fa-edit"></i> <strong>Editar pedido:</strong> (Disponível enquanto estiver pendente) Altere os itens ou informações do pedido.</li>
                              <li><i className="fas fa-times"></i> <strong>Cancelar pedido:</strong> Cancele o pedido se ele ainda não foi processado.</li>
                              <li><i className="fas fa-credit-card"></i> <strong>Finalizar pagamento:</strong> Gere um link para efetuar o pagamento pendente.</li>
                            </ul>
                          </li>
                          <li><strong>Legenda de Status:</strong> Um painel ao final da página ajuda a entender o significado de cada status.</li>
                        </ul>
                      </div>
                      <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={() => setMostrarAjuda(false)}>Fechar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}