"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import httpClient from "../../../../utils/httpClient";
import { formatCurrency } from "../../../../utils/formatters";

export default function EditarPedido({ params }) {
  const [pedido, setPedido] = useState(null);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: ""
  });
  const [opcaoEntrega, setOpcaoEntrega] = useState(1); // 1: Entrega, 2: Retirada
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidadeAdicionar, setQuantidadeAdicionar] = useState(1);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await httpClient.get("/produtos/listar");
        if (res.ok) {
          const data = await res.json();
          setProdutosDisponiveis(data);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    };
    carregarProdutos();
  }, []);

  useEffect(() => {
    const carregarPedido = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/pedidos/detalhes/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          // Verificar se o pedido pode ser editado
          if (data.status !== 1) {
            setError("Este pedido não pode ser editado pois não está com status Pendente.");
            return;
          }
          
          setPedido(data);
          setItens(data.itens || []); 
          setOpcaoEntrega(data.opcao);
          setTaxaEntrega(data.taxa_entrega);
          
          // Preencher dados de endereço
          setEndereco({
            cep: data.cep || "",
            rua: data.rua || "",
            numero: data.numero || "",
            bairro: data.bairro || "",
            cidade: data.cidade || ""
          });
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

  const atualizarQuantidade = (itemId, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    
    setItens(itens.map(item => 
      item.id === itemId ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  const removerItem = (itemId) => {
    if (!confirm("Tem certeza que deseja remover este item?")) {
      return;
    }
    
    setItens(itens.filter(item => item.id !== itemId));
  };

  const calcularTotal = () => {
    const subtotal = itens.reduce(
      (total, item) => total + (Number(item.valor_unitario) * Number(item.quantidade)),
      0
    );

    //Adiciona taxa de entrega se for entrega
    const entrega = opcaoEntrega === 1 ? Number(taxaEntrega) : 0;
    const desconto = Number(pedido?.valor_desconto || 0);

    const total = subtotal + entrega - desconto;

    return total >= 0 ? total : 0; // Garante que o total não seja negativo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (itens.length === 0) {
      alert("O pedido deve ter pelo menos um item!");
      return;
    }
    
    try {
      setSaving(true);
      
      // Preparar dados do pedido
      const valorTotal = calcularTotal();
      const pedidoAtualizado = {
        opcao: opcaoEntrega,
        taxa_entrega: opcaoEntrega === 1 ? taxaEntrega : 0,
        valor_desconto: pedido.valor_desconto || 0,
        valor_total: valorTotal,
        ...endereco
      };
      
      // Preparar itens do pedido
      const itensPedido = itens.map(item => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario
      }));
      
      // Enviar atualização
      const response = await httpClient.put(`/pedidos/atualizar/${id}`, {
        pedido: pedidoAtualizado,
        itens: itensPedido
      });
      
      if (response.ok) {
        // Gerar novo pagamento
        const pagamentoResponse = await httpClient.post("/pagamentos/gerarNovoPagamento", {
          id_pedido: id,
          metodo_pagamento: pedido.metodo_pagamento || 0
        });
        
        if (pagamentoResponse.ok) {
          const pagamentoData = await pagamentoResponse.json();
          alert("Pedido atualizado com sucesso! Você será redirecionado para o pagamento.");
          window.location.href = pagamentoData.init_point;
        } else {
          alert("Pedido atualizado, mas houve um erro ao gerar o pagamento. Acesse 'Meus Pedidos' para finalizar o pagamento.");
          router.push(`/home/meus-pedidos/${id}`);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Erro ao atualizar pedido");
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      alert("Ocorreu um erro ao atualizar o pedido");
    } finally {
      setSaving(false);
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      alert("CEP inválido! Deve conter 8 dígitos.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado.");
        return;
      }

      setEndereco(prev => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || ""
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar endereço pelo CEP.");
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Editar Pedido #{id}</h1>
        <Link href={`/home/meus-pedidos/${id}`} className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Detalhes
        </Link>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando dados do pedido...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <div className="mt-3">
            <Link href="/home/meus-pedidos" className="btn btn-primary">
              Voltar para Meus Pedidos
            </Link>
          </div>
        </div>
      ) : pedido ? (
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Itens do Pedido */}
            <div className="col-lg-8">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Itens do Pedido</h5>
                </div>
                <div className="card-body p-0">
                  {itens.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="fas fa-shopping-cart fa-3x text-muted"></i>
                      </div>
                      <h6>Nenhum item no pedido</h6>
                      <p className="text-muted">
                        Você removeu todos os itens. Adicione pelo menos um item para continuar.
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Produto</th>
                            <th className="text-center">Quantidade</th>
                            <th className="text-end">Preço Unit.</th>
                            <th className="text-end">Subtotal</th>
                            <th className="text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map((item) => (
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
                              <td className="text-center">
                                <div className="input-group input-group-sm" style={{ width: "120px", margin: "0 auto" }}>
                                  <button 
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                                  >
                                    <i className="fas fa-minus"></i>
                                  </button>
                                  <input 
                                    type="number" 
                                    className="form-control text-center"
                                    value={item.quantidade}
                                    onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                  />
                                  <button 
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="text-end">{formatCurrency(item.valor_unitario)}</td>
                              <td className="text-end fw-bold">
                                {formatCurrency(item.quantidade * item.valor_unitario)}
                              </td>
                              <td className="text-center">
                                <button 
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removerItem(item.id)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              {/* Adicionar novo Item */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Adicionar Novo Item</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                      <label className="form-label">Produto</label>
                      <select 
                        className="form-select" 
                        value={produtoSelecionado || ""}
                        onChange={(e) => setProdutoSelecionado(e.target.value)}
                      >
                        <option value="">Selecione um produto</option>
                        {produtosDisponiveis.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Quantidade</label>
                      <input 
                        type="number" 
                        className="form-control"
                        min={1}
                        value={quantidadeAdicionar}
                        onChange={(e) => setQuantidadeAdicionar(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-md-3">
                      <button 
                        className="btn btn-success w-100"
                        onClick={() => {
                          const produto = produtosDisponiveis.find(p => p.id === parseInt(produtoSelecionado));
                          if (!produto) return;

                          const jaExiste = itens.find(i => i.id_produto === produto.id);
                          if (jaExiste) {
                            // Incrementar quantidade se já existe
                            setItens(itens.map(i => 
                              i.id_produto === produto.id 
                                ? { ...i, quantidade: i.quantidade + quantidadeAdicionar }
                                : i
                            ));
                          } else {
                            // Adicionar novo item
                            setItens([
                              ...itens,
                            {
                              id: Date.now(), // ou outra lógica
                              id_produto: produto.id,
                              nome: produto.nome, 
                              valor_unitario: produto.preco, 
                              imagem: produto.imagem,
                              quantidade: quantidadeAdicionar
                            }
                            ]);
                          }
                          setProdutoSelecionado(null);
                          setQuantidadeAdicionar(1);
                        }}
                        disabled={!produtoSelecionado}
                      >
                        <i className="fas fa-plus me-1"></i> Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opções de Entrega */}
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Opções de Entrega</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Forma de Recebimento</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="entrega" 
                          name="opcaoEntrega"
                          checked={opcaoEntrega === 1}
                          onChange={() => setOpcaoEntrega(1)}
                        />
                        <label className="form-check-label" htmlFor="entrega">
                          <i className="fas fa-truck me-1"></i> Entrega
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          type="radio" 
                          className="form-check-input" 
                          id="retirada" 
                          name="opcaoEntrega"
                          checked={opcaoEntrega === 2}
                          onChange={() => setOpcaoEntrega(2)}
                        />
                        <label className="form-check-label" htmlFor="retirada">
                          <i className="fas fa-store me-1"></i> Retirada na Loja
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {opcaoEntrega === 1 ? (
                    <div className="mt-4">
                      <h6 className="mb-3">Endereço de Entrega</h6>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">CEP</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={endereco.cep}
                            onChange={(e) => setEndereco({...endereco, cep: e.target.value})}
                            onBlur={() => buscarEnderecoPorCep(endereco.cep)}
                            maxLength={8}
                            required={opcaoEntrega === 1}
                          />
                        </div>
                        <div className="col-md-8">
                          <label className="form-label">Rua</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={endereco.rua}
                            onChange={(e) => setEndereco({...endereco, rua: e.target.value})}
                            required={opcaoEntrega === 1}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Número</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={endereco.numero}
                            onChange={(e) => setEndereco({...endereco, numero: e.target.value})}
                            required={opcaoEntrega === 1}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Bairro</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={endereco.bairro}
                            onChange={(e) => setEndereco({...endereco, bairro: e.target.value})}
                            required={opcaoEntrega === 1}
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Cidade</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={endereco.cidade}
                            onChange={(e) => setEndereco({...endereco, cidade: e.target.value})}
                            required={opcaoEntrega === 1}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <h6 className="mb-3">Endereço para Retirada</h6>
                      <div className="bg-light border rounded p-3">
                        <p className="mb-1"><strong>Rua:</strong> Emílio Trevisan</p>
                        <p className="mb-1"><strong>Número:</strong> 400</p>
                        <p className="mb-1"><strong>Bairro:</strong> Jardim Bela Dária</p>
                        <p className="mb-1"><strong>Cidade:</strong> Presidente Prudente</p>
                        <p className="mb-0"><strong>CEP:</strong> 19013-200</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Resumo e Ações */}
            <div className="col-lg-4">
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Resumo do Pedido</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>
                      {formatCurrency(itens.reduce((total, item) => 
                        total + (item.valor_unitario * item.quantidade), 0))}
                    </span>
                  </div>
                  
                  {opcaoEntrega === 1 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Taxa de Entrega:</span>
                      <span>{formatCurrency(taxaEntrega)}</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Desconto:</span>
                    <span>- {formatCurrency(pedido.valor_desconto || 0)}</span>
                  </div>
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2 fw-bold">
                    <span>Total:</span>
                    <span className="fs-5">{formatCurrency(calcularTotal())}</span>
                  </div>
                  
                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={saving || itens.length === 0}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Salvar Alterações
                        </>
                      )}
                    </button>
                    
                    <Link 
                      href={`/home/meus-pedidos/${id}`}
                      className="btn btn-outline-secondary"
                    >
                      Cancelar
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="card shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Informações</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    Ao salvar as alterações, um novo pagamento será gerado para este pedido.
                  </div>
                  
                  {itens.length === 0 && (
                    <div className="alert alert-warning mt-3" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Você precisa adicionar pelo menos um item para salvar o pedido.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="alert alert-warning" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Pedido não encontrado.
        </div>
      )}
    </div>
  );
}