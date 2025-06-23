'use client';
import { useContext, useState, useEffect } from 'react';
import CartContext from '../../context/cartContext';
import { useRouter } from 'next/navigation';
import httpClient from '../../utils/httpClient';
import Link from 'next/link';
import './styles.css';

export default function ConfirmacaoPedido() {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: revisão, 2: confirmação, 3: sucesso
  const [opcao, setOpcao] = useState(1); // 1 = entrega, 2 = retirada
  const [metodoPagamento, setMetodoPagamento] = useState(1); // 1 = PIX, 2 = Cartão
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');
  const [idCliente, setIdCliente] = useState(null);
  const [pagamentoUrl, setPagamentoUrl] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState('');
  const [pixCopiaECola, setPixCopiaECola] = useState('');

  useEffect(() => {
    const clienteStr = localStorage.getItem('cliente');
    if (clienteStr) {
      const cliente = JSON.parse(clienteStr);
      setIdCliente(cliente.id);

      // Preenche os campos de endereço com base no cliente
      setCep(cliente.cep || '');
      setRua(cliente.rua || '');
      setNumero(cliente.numero || '');
      setBairro(cliente.bairro || '');
      setCidade(cliente.cidade || '');
    }
  }, []);

  const total = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });
  
  // Modificar a função confirmarPedido para remover a seleção de método de pagamento
  const confirmarPedido = async () => {
    if (cart.length === 0 || !idCliente) return;

    setLoading(true);
    try {
      const desconto = metodoPagamento === 1 ? total * 0.05 : 0;
      const taxaEntrega = 0;
      const valorFinal = total + taxaEntrega - desconto;

      const pedidoData = {
        pedido: ({
          id_cliente: idCliente,
          data_pedido: new Date().toISOString().slice(0, 10),
          status: 1,
          num_parcelas: 1,
          taxa_entrega: taxaEntrega,
          valor_desconto: desconto,
          valor_total: total + taxaEntrega - desconto,
          id_funcionario: 9,
          opcao,
          cep: opcao === 1 ? cep : null,
          rua: opcao === 1 ? rua : null,
          bairro: opcao === 1 ? bairro : null,
          cidade: opcao === 1 ? cidade : null,
          numero: opcao === 1 ? numero : null,
        }),
        itens: cart.map(item => ({
          id_produto: item.id,
          quantidade: item.quantidade,
          preco_unitario: item.preco
        }))
      };

      const response = await httpClient.post('/pedidos/gravar', pedidoData);
      const data = await response.json();

      if (response.ok) {
        // Gerar pagamento no Mercado Pago (simplificado, sem escolha prévia de método)
        const pagamentoResponse = await httpClient.post('/pagamentos/gerarPagamento', {
          id_pedido: data.id
        });
        
        const pagamentoData = await pagamentoResponse.json();
        
        if (pagamentoResponse.ok) {
          clearCart();
          
          // Redirecionar para o checkout do Mercado Pago
          window.location.href = pagamentoData.init_point;
        } else {
          alert(pagamentoData.msg || 'Erro ao gerar pagamento');
        }
      } else {
        alert(data.msg || 'Erro ao confirmar pedido');
      }
    } catch (error) {
      console.error('Erro ao confirmar pedido:', error);
      alert('Ocorreu um erro ao processar seu pedido');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-warning">
          <h4>Seu carrinho está vazio</h4>
          <p>Adicione produtos ao carrinho antes de finalizar o pedido.</p>
          <Link href="/home" className="btn btn-primary mt-3">Voltar às compras</Link>
        </div>
      </div>
    );
  }

  // Função para consultar CEP e atualizar estados de endereço
  function consultarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido! Deve conter 8 dígitos.");
      return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          alert("CEP não encontrado!");
          setRua("");
          setBairro("");
          setCidade("");
          return;
        }

        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
      })
      .catch((error) => {
        console.error("Erro ao consultar CEP:", error);
        alert("Erro ao consultar o CEP.");
      });
  }

  return (
    <div className="container my-5">
      {/* Indicador de progresso */}
      <div className="mb-5">
        <div className="d-flex justify-content-between position-relative mb-4">
          <div className="step-item active">
            <div className="step-circle">1</div>
            <div className="step-text">Revisão</div>
          </div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-text">Pagamento</div>
          </div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-text">Confirmação</div>
          </div>
          
          {/* Linha de progresso */}
          <div className="progress-line"></div>
          <div 
            className="progress-line-fill" 
            style={{width: `${(step-1) * 50}%`}}
          ></div>
        </div>
      </div>

      {step === 1 && (
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Revisão do Pedido</h3>
          </div>
          <div className="card-body">
            <h4 className="mb-3">Itens do Pedido</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th className="text-end">Preço Unit.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imagem || "/img/produto-semimagem.jpg"} 
                            alt={item.titulo}
                            style={{ width: 50, height: 50, objectFit: 'contain', marginRight: 10 }}
                          />
                          <span>{item.titulo}</span>
                        </div>
                      </td>
                      <td>{item.quantidade}</td>
                      <td className="text-end">{formatar.format(item.preco)}</td>
                      <td className="text-end">{formatar.format(Number(item.preco) * item.quantidade)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="3" className="text-end">Total:</th>
                    <th className="text-end">{formatar.format(total)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4">
              <h4 className="mb-3">Forma de Recebimento</h4>
              <div className="mb-3">
                <div className="form-check form-check-inline">
                  <input 
                    type="radio" 
                    id="entrega" 
                    name="opcao" 
                    value="1" 
                    className="form-check-input"
                    checked={opcao === 1}
                    onChange={() => setOpcao(1)}
                  />
                  <label htmlFor="entrega" className="form-check-label">Entrega</label>
                </div>

                <div className="form-check form-check-inline">
                  <input 
                    type="radio" 
                    id="retirada" 
                    name="opcao" 
                    value="2" 
                    className="form-check-input"
                    checked={opcao === 2}
                    onChange={() => setOpcao(2)}
                  />
                  <label htmlFor="retirada" className="form-check-label">Retirada no Local</label>
                </div>

                {opcao === 2 && (
                  <div className="mt-2 ms-1">
                    <small className="text-muted">
                      Rua Emílio Trevisan, 400, Jardim Bela Daria - Pres. Prudente/SP
                    </small>
                  </div>
                )}

              </div>

              {opcao === 1 && (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CEP</label>
                    <input type="text" className="form-control" value={cep} onChange={e => setCep(e.target.value)} onBlur={() => consultarCep(cep)} maxLength={8} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Rua</label>
                    <input type="text" className="form-control" value={rua} onChange={e => setRua(e.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Número</label>
                    <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Bairro</label>
                    <input type="text" className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Cidade</label>
                    <input type="text" className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

          </div>
          <div className="card-footer d-flex justify-content-between">
            <Link href="/home/carrinho" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>Voltar ao Carrinho
            </Link>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (opcao === 1) {
                  if (!cep || !rua || !numero || !bairro || !cidade) {
                    alert("Preencha todos os campos de endereço para prosseguir.");
                    return;
                  }
                }
                setStep(2);
              }}
            >
              Prosseguir<i className="fas fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Confirmar Pedido</h3>
          </div>
          <div className="card-body">
            <div className="mt-4">
              <h4 className="mb-3">Forma de Pagamento</h4>
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  id="pagamento-pix" 
                  name="pagamento" 
                  value="1" 
                  className="form-check-input"
                  checked={metodoPagamento === 1}
                  onChange={() => setMetodoPagamento(1)}
                />
                <label htmlFor="pagamento-pix" className="form-check-label">PIX (5% de desconto)</label>
              </div>
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  id="pagamento-cartao" 
                  name="pagamento" 
                  value="2" 
                  className="form-check-input"
                  checked={metodoPagamento === 2}
                  onChange={() => setMetodoPagamento(2)}
                />
                <label htmlFor="pagamento-cartao" className="form-check-label">Cartão de Crédito</label>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-3">Resumo do Pagamento</h4>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total dos Produtos</span>
                  <strong>{formatar.format(total)}</strong>
                </li>
                {metodoPagamento === 1 && (
                  <li className="list-group-item d-flex justify-content-between text-danger">
                    <span>Desconto PIX (5%)</span>
                    <strong>-{formatar.format(total * 0.05)}</strong>
                  </li>
                )}
                {opcao === 1 && (
                  <>
                    <li className="list-group-item d-flex justify-content-between text-warning">
                      <span>Taxa de Entrega</span>
                      <strong>A combinar</strong>
                    </li>
                    <li className="list-group-item">
                      <small>
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Após finalizar o pedido, entraremos em contato para informar o valor do frete.<br/>
                        Para mais informações, fale conosco: (18) 3222-0827 | dumed@dumedhospitalar.com.br
                      </small>
                    </li>
                  </>
                )}
                <li className="list-group-item d-flex justify-content-between">
                  <span><strong>Valor Final</strong></span>
                  <strong>{formatar.format(total - (metodoPagamento === 1 ? total * 0.05 : 0))}</strong>
                </li>
              </ul>
            </div>

            <br/>

            <div className="alert alert-warning">
              <p className="mb-0">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Ao confirmar, você concorda com os termos de compra e com a{' '}
              <a href="/home/privacidade" className="text-decoration-underline text-dark">
              política de privacidade
              </a>.
               </p>
             </div>

          </div>
          <div className="card-footer d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <i className="fas fa-arrow-left me-2"></i>Voltar à Revisão
            </button>
            <button 
              className="btn btn-success" 
              onClick={confirmarPedido}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processando...
                </>
              ) : (
                <>
                  Ir para Pagamento<i className="fas fa-credit-card ms-2"></i>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h3 className="mb-0">Pedido Confirmado!</h3>
          </div>
          <div className="card-body text-center py-5">
            <div className="success-animation mb-4">
              <i className="fas fa-check-circle fa-5x text-success"></i>
            </div>
            <h4>Seu pedido foi realizado com sucesso!</h4>
            <p className="lead mb-4">Obrigado por comprar conosco.</p>
            
            {/* Exibir QR Code do PIX se for o método escolhido */}
            {metodoPagamento === 1 && pixQrCodeBase64 && (
              <div className="mt-4 pix-container">
                <h5>Pague com PIX</h5>
                <p>Escaneie o QR Code abaixo ou use o código para pagar:</p>
                <div className="qrcode-container mb-3">
                  <img 
                    src={`data:image/png;base64,${pixQrCodeBase64}`} 
                    alt="QR Code PIX" 
                    className="img-fluid"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
                <div className="copy-paste-container mb-3">
                  <p className="small">Código PIX copia e cola:</p>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={pixCopiaECola} 
                      readOnly 
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(pixCopiaECola);
                        alert('Código PIX copiado!');
                      }}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
                <p className="mt-3">O pagamento será confirmado automaticamente.</p>
              </div>
            )}
            
            {/* Link para pagamento se for cartão */}
            {metodoPagamento === 2 && pagamentoUrl && (
              <div className="mt-4">
                <p>Se você não foi redirecionado automaticamente para o pagamento, clique no botão abaixo:</p>
                <a href={pagamentoUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-credit-card me-2"></i>Ir para o Pagamento
                </a>
              </div>
            )}
          </div>
          <div className="card-footer text-center">
            <Link href="/home" className="btn btn-primary">
              <i className="fas fa-home me-2"></i>Voltar à Página Inicial
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}