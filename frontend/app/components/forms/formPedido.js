'use client';
import { useState, useEffect } from "react";
import httpClient from "../../utils/httpClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FormPedido({ pedidoId }) {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [dataPedido, setDataPedido] = useState('');
  const [status, setStatus] = useState(1);
  const [numParcelas, setNumParcelas] = useState(1);
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [idFuncionario, setIdFuncionario] = useState('');
  const [opcao, setOpcao] = useState(1); // 1 Entrega, 2 Retirada

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  // Endereço para entrega
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [numero, setNumero] = useState('');

  // Itens do pedido
  const [itens, setItens] = useState([
    { id_produto: '', quantidade: 1, preco: 0 }
  ]);

  const router = useRouter();

  useEffect(() => {
    async function carregarDados() {
      try {
        const funcionarioLogado = JSON.parse(localStorage.getItem('funcionario'));
        if (funcionarioLogado?.id) setIdFuncionario(funcionarioLogado.id);

        const [resClientes, resProdutos] = await Promise.all([
          httpClient.get('/clientes/listar'),
          httpClient.get('/produtos/listar')
        ]);

        const clientesData = await resClientes.json();
        const produtosData = await resProdutos.json();

        setClientes(Array.isArray(clientesData) ? clientesData : []);
        setProdutos(Array.isArray(produtosData) ? produtosData : []);

        if (pedidoId) {
          const resPedido = await httpClient.get(`/pedidos/detalhes/${pedidoId}`);
          if (!resPedido.ok) {
            alert('Pedido não encontrado');
            router.push('/admin/pedidos');
            return;
          }
          const pedidoData = await resPedido.json();

          setIdCliente(pedidoData.id_cliente || '');
          setDataPedido(pedidoData.data_pedido ? pedidoData.data_pedido.substring(0,10) : '');
          setStatus(pedidoData.status || 1);
          setNumParcelas(pedidoData.num_parcelas || 1);
          setTaxaEntrega(pedidoData.taxa_entrega || 0);
          setValorDesconto(pedidoData.valor_desconto || 0);
          setValorTotal(pedidoData.valor_total || 0);
          setIdFuncionario(pedidoData.id_funcionario || funcionarioLogado?.id || '');
          setOpcao(pedidoData.opcao || 1);
          setCep(pedidoData.cep || '');
          setRua(pedidoData.rua || '');
          setBairro(pedidoData.bairro || '');
          setCidade(pedidoData.cidade || '');
          setNumero(pedidoData.numero || '');

          if (Array.isArray(pedidoData.itens) && pedidoData.itens.length > 0) {
            const itensFormatados = pedidoData.itens.map(i => {
              const prod = produtosData.find(p => p.id == i.id_produto);
              return {
                id_produto: i.id_produto,
                quantidade: i.quantidade,
                preco: prod ? prod.preco : i.preco
              };
            });
            setItens(itensFormatados);
          }
        } else {
          setDataPedido(new Date().toISOString().substring(0, 10));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados do formulário');
      }
    }
    carregarDados();
  }, [pedidoId, router]);

  useEffect(() => {
    if (opcao === 1) { // entrega
      const clienteSelecionado = clientes.find(c => c.id == idCliente);
      if (clienteSelecionado) {
        setCep(clienteSelecionado.cep || '');
        setRua(clienteSelecionado.rua || '');
        setBairro(clienteSelecionado.bairro || '');
        setCidade(clienteSelecionado.cidade || '');
        setNumero(clienteSelecionado.numero || '');
      }
    } else {
      setCep('');
      setRua('');
      setBairro('');
      setCidade('');
      setNumero('');
    }
  }, [idCliente, opcao, clientes]);

  const atualizarItem = (index, campo, valor) => {
    setItens(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };

      if (campo === 'id_produto') {
        const produto = produtos.find(p => p.id == valor);
        copia[index].preco = produto ? produto.preco : 0;
      }

      return copia;
    });
  };

  const adicionarItem = () => {
    setItens(prev => [...prev, { id_produto: '', quantidade: 1, preco: 0 }]);
  };

  const removerItem = (index) => {
    setItens(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let totalItens = itens.reduce((acc, item) => {
      return acc + (item.preco * (parseInt(item.quantidade) || 0));
    }, 0);

    let total = totalItens + (parseFloat(taxaEntrega) || 0) - (parseFloat(valorDesconto) || 0);
    setValorTotal(total > 0 ? total : 0);
  }, [itens, taxaEntrega, valorDesconto]);

  async function gravarPedido() {
    if (!idCliente) return alert('Selecione um cliente');
    if (!itens.length || itens.some(i => !i.id_produto || i.quantidade < 1)) {
      return alert('Adicione ao menos um item válido');
    }

    const pedido = {
      id_cliente: idCliente,
      data_pedido: dataPedido,
      status,
      num_parcelas: parseInt(numParcelas) || 1,
      taxa_entrega: parseFloat(taxaEntrega) || 0,
      valor_desconto: parseFloat(valorDesconto) || 0,
      valor_total: valorTotal,
      id_funcionario: idFuncionario,
      opcao,
      cep,
      rua,
      bairro,
      cidade,
      numero,
    };

    const dados = {
      pedido,
      itens: itens.map(i => ({
        id_produto: i.id_produto,
        quantidade: parseInt(i.quantidade),
        preco: i.preco
      }))
    };

    try {
      const response = await httpClient.post('/pedidos/gravar', dados);
      const json = await response.json();

      if (!response.ok) {
        alert(json.msg || 'Erro ao gravar pedido');
        return;
      }

      alert(json.msg || 'Pedido gravado com sucesso!');
      router.push('/admin/pedidos');
    } catch (err) {
      console.error(err);
      alert('Erro inesperado ao gravar pedido');
    }
  }

  async function alterarPedido() {
    if (!pedidoId) {
      alert('ID do pedido inválido para alteração');
      return;
    }
    if (!idCliente) return alert('Selecione um cliente');
    if (!itens.length || itens.some(i => !i.id_produto || i.quantidade < 1)) {
      return alert('Adicione ao menos um item válido');
    }

    const pedido = {
      id: pedidoId,
      id_cliente: idCliente,
      data_pedido: dataPedido,
      status,
      num_parcelas: parseInt(numParcelas) || 1,
      taxa_entrega: parseFloat(taxaEntrega) || 0,
      valor_desconto: parseFloat(valorDesconto) || 0,
      valor_total: valorTotal,
      id_funcionario: idFuncionario,
      opcao,
      cep,
      rua,
      bairro,
      cidade,
      numero,
    };

    const dados = {
      pedido,
      itens: itens.map(i => ({
        id_produto: i.id_produto,
        quantidade: parseInt(i.quantidade),
        preco: i.preco
      }))
    };

    try {
      const response = await httpClient.put(`/pedidos/atualizar/${pedidoId}`, dados);
      const json = await response.json();

      if (!response.ok) {
        alert(json.msg || 'Erro ao alterar pedido');
        return;
      }

      alert(json.msg || 'Pedido alterado com sucesso!');
      router.push('/admin/pedidos');
    } catch (err) {
      console.error(err);
      alert('Erro inesperado ao alterar pedido');
    }
  }

  function consultarCep(cep, setRua, setBairro, setCidade) {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("CEP inválido! Deve conter 8 dígitos.");
      return;
    }

    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then(response => response.json())
      .then(data => {
        if (data.erro) {
          alert("CEP não encontrado!");
          setRua('');
          setBairro('');
          setCidade('');
          return;
        }

        setRua(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
      })
      .catch(error => {
        console.error("Erro ao consultar CEP:", error);
        alert("Erro ao consultar o CEP.");
      });
  }

  function apenasNumeros(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
  }

  return (
    <div className="container mt-3">
      <h1>{pedidoId ? 'Editar Pedido' : 'Cadastro de Pedido'}</h1>

      {/* Cliente */}
      <div className="mb-3">
        <label className="form-label">Cliente</label>
        <select
          className="form-select"
          value={idCliente}
          onChange={e => setIdCliente(e.target.value)}
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Data do pedido */}
      <div className="mb-3">
        <label className="form-label">Data do Pedido</label>
        <input
          type="date"
          className="form-control"
          value={dataPedido}
          max={"2025-12-30"}
          onChange={e => setDataPedido(e.target.value)}
          required
        />
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(parseInt(e.target.value))}
          required
        >
          <option value={1}>Pendente</option>
          <option value={2}>Aprovado</option>
          <option value={3}>Em preparo</option>
          <option value={4}>Em entrega</option>
          <option value={5}>Cancelado</option>
          <option value={6}>Finalizado</option>
        </select>
      </div>

      {/* Número de parcelas */}
      <div className="mb-3">
        <label className="form-label">Número de Parcelas</label>
        <input
          type="number"
          min="1"
          className="form-control"
          value={numParcelas}
          onChange={e => setNumParcelas(e.target.value)}
          required
        />
      </div>

      {/* Taxa de entrega */}
      <div className="mb-3">
        <label className="form-label">Taxa de Entrega</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="form-control"
          value={taxaEntrega}
          onChange={e => setTaxaEntrega(e.target.value)}
          disabled={opcao === 2} // desabilita se for retirada
          required
        />
      </div>

      {/* Valor do desconto */}
      <div className="mb-3">
        <label className="form-label">Valor do Desconto</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="form-control"
          value={valorDesconto}
          onChange={e => setValorDesconto(e.target.value)}
          required
        />
      </div>

      {/* Valor total */}
      <div className="mb-3">
        <label className="form-label">Valor Total</label>
        <input
          type="text"
          className="form-control"
          value={formatar.format(valorTotal)}
          readOnly
          disabled
        />
      </div>

      {/* Opção: Entrega ou Retirada */}
      <div className="mb-3">
        <label className="form-label">Opção</label>
        <select
          className="form-select"
          value={opcao}
          onChange={e => setOpcao(parseInt(e.target.value))}
          required
        >
          <option value={1}>Entrega</option>
          <option value={2}>Retirada</option>
        </select>
      </div>

      {/* Endereço (somente se entrega) */}
      {opcao === 1 && (
        <>
          <h5>Endereço para Entrega</h5><small className="text-primary">Se cliente selecionado, endereço preenche automático</small>

          <div className="mb-3">
            <label className="form-label">CEP</label>
            <input
              type="text"
              className="form-control"
              value={cep}
              onChange={e => setCep(e.target.value)}
              onBlur={() => consultarCep(cep, setRua, setBairro, setCidade)}
              onInput={apenasNumeros}
              maxLength={8}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rua</label>
            <input
              type="text"
              className="form-control"
              value={rua}
              onChange={e => setRua(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bairro</label>
            <input
              type="text"
              className="form-control"
              value={bairro}
              onChange={e => setBairro(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cidade</label>
            <input
              type="text"
              className="form-control"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Número</label>
            <input
              type="text"
              className="form-control"
              value={numero}
              onChange={e => setNumero(e.target.value)}
              onInput={apenasNumeros}
              required
            />
          </div>
        </>
      )}

      {/* Itens do pedido */}
      <hr />
      <h5>Itens do Pedido</h5>
      {itens.map((item, i) => {
        const precoUnitario = item.preco || 0;
        const quantidade = parseInt(item.quantidade) || 0;
        const totalItem = precoUnitario * quantidade;

        return (
          <div key={i} className="border p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong>Item {i + 1}</strong>
              {itens.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removerItem(i)}
                >
                  Remover
                </button>
              )}
            </div>

            <div className="mb-2">
              <label className="form-label">Produto</label>
              <select
                className="form-select"
                value={item.id_produto}
                onChange={e => atualizarItem(i, 'id_produto', e.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {formatar.format(produto.preco)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-control"
                value={item.quantidade}
                min="1"
                onChange={e => atualizarItem(i, 'quantidade', e.target.value)}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Preço Unitário</label>
              <input
                type="text"
                className="form-control"
                value={formatar.format(precoUnitario)}
                readOnly
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Total do Item</label>
              <input
                type="text"
                className="form-control"
                value={formatar.format(totalItem)}
                readOnly
              />
            </div>
          </div>
        );
      })}

      <button type="button" className="btn btn-secondary mb-3" onClick={adicionarItem}>
        + Adicionar Item
      </button>

      {/* Botão gravar ou alterar */}
      <div className="mt-3">
        {pedidoId ? (
          <button className="btn btn-warning me-2" onClick={alterarPedido}>
            Alterar Pedido
          </button>
        ) : (
          <button className="btn btn-primary me-2" onClick={gravarPedido}>
            Cadastrar Pedido
          </button>
        )}
        <Link className="btn btn-secondary" href="/admin/pedidos">Voltar</Link>
      </div>
    </div>
  );
}