'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import httpClient from '../../utils/httpClient';
import { useRouter } from "next/navigation";

export default function FormOrcamento({ dadosIniciais = null }) {
  const [cidade, setCidade] = useState('');
  const [prazoValidade, setPrazoValidade] = useState('');
  const [prazoEntrega, setPrazoEntrega] = useState('');
  const [idFuncionario, setIdFuncionario] = useState('');
  const [status, setStatus] = useState(1);
  const [data, setData] = useState('');
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaUnidades, setListaUnidades] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [itens, setItens] = useState([
    { descricao: '', marca: '', valor_unitario: '', id_unidade: '', quantidade: '' }
  ]);

  const router = useRouter();

  // Carrega dados auxiliares (funcionários e unidades)
  useEffect(() => {
    async function carregarDados() {
      try {
        const funcionarioLogado = JSON.parse(localStorage.getItem('funcionario'));
        if (funcionarioLogado?.id) setIdFuncionario(funcionarioLogado.id);

        const [resFunc, resUni] = await Promise.all([
          httpClient.get('/funcionarios/listar'),
          httpClient.get('/unidades/listar'),
        ]);

        const dataFunc = await resFunc.json();
        const dataUni = await resUni.json();

        setListaFuncionarios(Array.isArray(dataFunc) ? dataFunc : []);
        setListaUnidades(Array.isArray(dataUni) ? dataUni : []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, []);

  // Atualiza os campos quando dadosIniciais mudar (modo edição)
  useEffect(() => {
    if (dadosIniciais && dadosIniciais.id) {
      setModoEdicao(true);
      setCidade(dadosIniciais.cidade || '');
      setPrazoValidade(dadosIniciais.prazo_validade || '');
      setPrazoEntrega(dadosIniciais.prazo_entrega || '');
      setIdFuncionario(dadosIniciais.id_funcionario || '');
      setStatus(dadosIniciais.status || 1);
      setData(dadosIniciais.data ? new Date(dadosIniciais.data).toISOString().substring(0, 10) : '');

      if (Array.isArray(dadosIniciais.itens)) {
        setItens(dadosIniciais.itens.map(item => ({
          id: item.id || 0,
          descricao: item.descricao || '',
          marca: item.marca || '',
          valor_unitario: item.valor_unitario || '',
          id_unidade: item.id_unidade || '',
          quantidade: item.quantidade || '',
        })));
      }
    } else {
      // Quando for novo orçamento, define data atual
      const hoje = new Date().toISOString().substring(0, 10);
      setData(hoje);
    }
  }, [dadosIniciais]);

  const atualizarItem = (index, campo, valor) => {
    setItens(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  };

  const adicionarItem = () => {
    setItens(prev => [...prev, { descricao: '', marca: '', valor_unitario: '', id_unidade: '', quantidade: '' }]);
  };

  const removerItem = (index) => {
    setItens(prev => prev.filter((_, i) => i !== index));
  };

  function gravarOrcamento() {
    if (!itens.length || itens.every(item => !item.descricao.trim())) {
      alert('Adicione ao menos um item com descrição');
      return;
    }

    const dados = {
      orcamento: {
        cidade,
        prazo_validade: prazoValidade,
        prazo_entrega: prazoEntrega,
        id_funcionario: idFuncionario,
        status,
        data
      },
      itens: itens.map(item => ({
        descricao: item.descricao.trim(),
        marca: item.marca.trim(),
        valor_unitario: parseFloat(item.valor_unitario) || 0,
        id_unidade: item.id_unidade,
        quantidade: parseInt(item.quantidade) || 0,
      }))
    };

    httpClient.post("/orcamentos/gravar", dados)
      .then(async r => {
        const resposta = await r.json();
        if (!r.ok) return alert(resposta.msg || "Erro ao gravar orçamento");
        alert(resposta.msg || "Orçamento gravado com sucesso");
        router.push("/admin/orcamentos");
      })
      .catch(err => {
        console.error(err);
        alert("Erro inesperado ao gravar orçamento");
      });
  }

  function alterarOrcamento() {
  if (
    dadosIniciais?.id &&
    cidade.trim() &&
    prazoValidade.trim() &&
    prazoEntrega.trim() &&
    idFuncionario &&
    itens.length &&
    itens.every(item =>
      item.descricao.trim() &&
      item.marca.trim() &&
      item.valor_unitario &&
      item.id_unidade &&
      item.quantidade
    )
  ) {
    const dados = {
      orcamento: {
        id: dadosIniciais.id,  // <- ID enviado no body
        cidade,
        prazo_validade: prazoValidade,
        prazo_entrega: prazoEntrega,
        id_funcionario: idFuncionario,
        status,
        data
      },
      itens: itens.map(item => ({
        id: item.id || 0,
        descricao: item.descricao.trim(),
        marca: item.marca.trim(),
        valor_unitario: parseFloat(item.valor_unitario) || 0,
        id_unidade: item.id_unidade,
        quantidade: parseInt(item.quantidade) || 0,
      }))
    };


    httpClient.put("/orcamentos/alterar", dados)
      .then(async r => {
        const resposta = await r.json();

        if (!r.ok) {
          alert(resposta.msg || "Erro ao alterar orçamento");
          return;
        }

        alert(resposta.msg || "Orçamento alterado com sucesso");
        router.push("/admin/orcamentos");
      })
      .catch(err => {
        console.error(err);
        alert("Erro inesperado ao alterar orçamento");
      });
    } else {
      alert("Preencha todos os campos corretamente e adicione ao menos um item válido.");
    } 
  }


  if (!dadosIniciais && modoEdicao) return <p>Carregando orçamento para edição...</p>;

  return (
    <div>
      <h1>{modoEdicao ? "Alteração de Orçamento" : "Cadastro de Orçamento"}</h1>
      <div className="mb-3">
        <label htmlFor="cidade" className="form-label">Cidade</label>
        <input
          type="text"
          id="cidade"
          className="form-control"
          placeholder="Ex: Presidente Prudente - SP"
          value={cidade}
          onChange={e => setCidade(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="prazoValidade" className="form-label">Prazo de Validade</label>
        <input
          type="text"
          id="prazoValidade"
          className="form-control"
          placeholder="Ex padrão: 5 DIAS"
          value={prazoValidade}
          onChange={e => setPrazoValidade(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="prazoEntrega" className="form-label">Prazo de Entrega</label>
        <input
          type="text"
          id="prazoEntrega"
          className="form-control"
          placeholder="Ex padrão: 10 DIAS, Imediato"
          value={prazoEntrega}
          onChange={e => setPrazoEntrega(e.target.value)}
          required
        />
      </div>

      {listaFuncionarios.length > 0 && idFuncionario && (
        <div className="mb-3">
          <label className="form-label">Funcionário Responsável</label>
          <input
            type="text"
            className="form-control"
            value={listaFuncionarios.find(f => f.id == idFuncionario)?.nome || 'Funcionário não encontrado'}
            disabled
          />
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={e => setStatus(parseInt(e.target.value))}
        >
          <option value={1}>Pendente</option>
          <option value={2}>Enviado</option>
          <option value={3}>Aprovado</option>
          <option value={0}>Cancelado</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Data do Orçamento</label>
        <input
          type="date"
          className="form-control"
          value={data}
          max={"2025-12-30"}
          onChange={e => setData(e.target.value)}
          disabled={modoEdicao} 
        />
      </div>

      <hr />
      <h5>Itens do Orçamento</h5>

      {itens.map((item, i) => (
        <div key={i} className="border p-3 mb-3">
          <div className="mb-2 d-flex justify-content-between align-items-center">
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
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              value={item.descricao}
              onChange={e => atualizarItem(i, 'descricao', e.target.value)}
              required
              rows={2}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Marca</label>
            <input
              type="text"
              className="form-control"
              value={item.marca}
              onChange={e => atualizarItem(i, 'marca', e.target.value)}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Valor Unitário</label>
            <input
              type="number"
              className="form-control"
              value={item.valor_unitario}
              onChange={e => atualizarItem(i, 'valor_unitario', e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Unidade</label>
            <select
              className="form-select"
              value={item.id_unidade}
              onChange={e => atualizarItem(i, 'id_unidade', e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {listaUnidades.map(unidade => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.descricao || unidade.id}
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
              onChange={e => atualizarItem(i, 'quantidade', e.target.value)}
              min="1"
              required
            />
          </div>
        </div>
      ))}

      <button type="button" className="btn btn-secondary mb-3" onClick={adicionarItem}>
        + Adicionar Item
      </button>

      <div className="mt-3">
        <button
          onClick={() => modoEdicao ? alterarOrcamento(dadosIniciais.id) : gravarOrcamento()}
          className="btn btn-primary me-2"
        >
          {modoEdicao ? 'Alterar' : 'Cadastrar'}
        </button>
        <Link className="btn btn-secondary" href="/admin/orcamentos">Voltar</Link>
      </div>
    </div>
  );
}