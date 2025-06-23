'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import "../../../public/template/css/modalCustom.css"

export default function Clientes() {
  const [lista, setLista] = useState([]);
  const [ordemNome, setOrdemNome] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('cpf');
  const [filtroTipoPessoa, setFiltroTipoPessoa] = useState('');
  const [mostrarAjuda, setMostrarAjuda] = useState(false);

  const formatarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  };

  const formatarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
    if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
    if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
  };

  function carregarClientes() {
    httpClient.get("/clientes/listar")
      .then(r => r.json())
      .then(setLista)
      .catch(console.error);
  }

  async function excluirCliente(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmacao) return;

    try {
      const resposta = await httpClient.delete(`/clientes/deletar/${id}`);
      const dados = await resposta.json();
      alert(dados.msg);
      carregarClientes();
    } catch (erro) {
      console.error("Erro ao excluir cliente:", erro);
    }
  }

  async function alterarStatusCliente(id, statusAtual) {
    const acao = statusAtual ? 'Inativar' : 'Ativar';
    const confirmacao = window.confirm(`Tem certeza que deseja ${acao} este cliente?`);
    if (!confirmacao) return;

    try {
      const endpoint = statusAtual ? "/clientes/inativar" : "/clientes/ativar";
      const resposta = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const dados = await resposta.json();
      alert(dados.msg);
      carregarClientes();
    } catch (erro) {
      console.error("Erro ao alterar status do cliente:", erro);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const limparFiltros = () => {
    setOrdemNome('');
    setFiltroDocumento('');
    setTipoDocumento('cpf');
    setFiltroTipoPessoa('');
  };

  const handleDocumentoChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (tipoDocumento === 'cpf') {
      value = formatarCPF(value);
    } else {
      value = formatarCNPJ(value);
    }
    setFiltroDocumento(value);
  };

  function handleExportarExcel() {
    const dados = lista.map(c => ({
      ID: c.id,
      Nome: c.nome,
      Documento: c.tipo === 1 ? formatarCPF(c.cpf) : formatarCNPJ(c.cnpj),
      Telefone: c.telefone,
      Email: c.email,
      Tipo: c.tipo === 1 ? "Física" : "Jurídica"
    }));

    exportarParaExcel(dados, "clientes");
  }

  function handleExportarPDF() {
    const dados = lista.map(c => [
      c.id,
      c.nome,
      c.tipo === 1 ? formatarCPF(c.cpf) : formatarCNPJ(c.cnpj),
      c.telefone,
      c.email,
      c.tipo === 1 ? "Física" : "Jurídica"
    ]);

    const colunas = ["ID", "Nome", "Documento", "Telefone", "Email", "Tipo"];

    exportarParaPDF(dados, colunas, "clientes");
  }

  const listaFiltradaOrdenada = lista
    .filter(c => {
      const doc = c.tipo === 1 ? formatarCPF(c.cpf) : formatarCNPJ(c.cnpj);
      const docOk = filtroDocumento === '' || doc.includes(filtroDocumento);
      const tipoOk = filtroTipoPessoa === '' || String(c.tipo) === filtroTipoPessoa;
      return docOk && tipoOk;
    })
    .sort((a, b) => {
      if (ordemNome === 'asc') return a.nome.localeCompare(b.nome);
      if (ordemNome === 'desc') return b.nome.localeCompare(a.nome);
      return 0;
    });

  return (
    <div>
      <div>
        <h2 className="mb-4">Clientes Cadastrados
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
        </h2>
      </div>

      {/* Filtros */}
      <div className="mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="ordenarNome" className="form-label">Ordenar por Nome</label>
            <select
              id="ordenarNome"
              title="Ordene os clientes por nome (A-Z ou Z-A)"
              className="form-select"
              onChange={e => setOrdemNome(e.target.value)}
              value={ordemNome}
            >
              <option value="">Selecione</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="tipoDocumento" className="form-label">Tipo de Documento</label>
            <select
              id="tipoDocumento"
              title="Escolha CPF para pessoa física ou CNPJ para pessoa jurídica"
              className="form-select"
              value={tipoDocumento}
              onChange={e => {
                setTipoDocumento(e.target.value);
                setFiltroDocumento('');
              }}
            >
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="filtroDocumento" className="form-label">Documento</label>
            <input
              id="filtroDocumento"
              type="text"
              className="form-control"
              placeholder={tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
              value={filtroDocumento}
              onChange={handleDocumentoChange}
              maxLength={tipoDocumento === 'cpf' ? 14 : 18}
              inputMode="numeric"
              title={tipoDocumento === 'cpf' ? 'Digite o CPF' : 'Digite o CNPJ'}
              aria-label="Campo de documento"
            />
          </div>

          <div className="col-md-2">
            <label htmlFor="tipoPessoa" className="form-label">Tipo de Pessoa</label>
            <select
              id="tipoPessoa"
              title="Filtrar clientes por tipo de pessoa"
              className="form-select"
              value={filtroTipoPessoa}
              onChange={e => setFiltroTipoPessoa(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="1">Física</option>
              <option value="2">Jurídica</option>
            </select>
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button
              type="button"
              title="Limpar todos os filtros aplicados"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={limparFiltros}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <div>
        <Link href="/admin/clientes/cadastrar" className="btn btn-success btn-animado" title="Cadastrar novo cliente">
          <i className="fas fa-user-plus me-1"></i> Cadastrar Cliente
        </Link>
      </div>

      <br />

      {/* Tabela */}
      <div className="table-responsive">
        {listaFiltradaOrdenada.length > 0 ? (
          <table className="table table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Documento</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {listaFiltradaOrdenada.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.tipo === 1 ? formatarCPF(cliente.cpf) : formatarCNPJ(cliente.cnpj)}</td>
                  <td>{cliente.telefone}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.tipo === 1 ? 'Física' : 'Jurídica'}</td>
                  <td>
                     <button onClick={() => alterarStatusCliente(cliente.id, cliente.status)} className={`btn btn-sm ${cliente.status ? 'btn-outline-success' : 'btn-outline-danger'}`} title={cliente.status ? 'Cliente está ativo, clique para inativá-lo' : 'Cliente está inativo, clique para ativá-lo'}>
                        <i className={`fas ${cliente.status ? 'fa-check-circle' : 'fa-times-circle'}`} />
                      </button>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link href={`/admin/clientes/obter/${cliente.id}`} className="btn btn-sm btn-outline-info btn-animado" title="Visualizar cliente" >
                        <i className="fas fa-search" />
                      </Link>
                      <Link href={`/admin/clientes/alterar/${cliente.id}`} className="btn btn-outline-primary btn-sm" title="Editar cliente">
                        <i className="fas fa-pen" />
                      </Link>
                      <button onClick={() => excluirCliente(cliente.id)} className="btn btn-outline-danger btn-sm" title="Excluir cliente">
                        <i className="fas fa-trash"></i>
                      </button>
                     
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">Nenhum cliente cadastrado.</p>
        )}
      </div>

      {/* Botões Exportar */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button onClick={handleExportarExcel} className="btn btn-outline-success btn-sm btn-animado" title="Exportar para Excel">
          <i className="bi bi-file-earmark-excel me-1"></i> Excel
        </button>
        <button onClick={handleExportarPDF} className="btn btn-outline-danger btn-sm btn-animado" title="Exportar para PDF">
          <i className="bi bi-file-earmark-pdf me-1"></i> PDF
        </button>
      </div>

      {mostrarAjuda && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content animate__animated animate__fadeInDown">
              <div className="modal-header">
                <h5 className="modal-title">Ajuda: Como usar esta página</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarAjuda(false)}></button>
              </div>
              <div className="modal-body">
                <p>Use os filtros e botões abaixo para gerenciar os clientes:</p>
                <ul>
                  <li><strong>Ordenar por Nome:</strong> Classifica a lista de clientes de A-Z ou Z-A.</li>
                  <li><strong>Tipo de Documento:</strong> Alterna entre busca por CPF ou CNPJ.</li>
                  <li><strong>Documento:</strong> Digite um número para filtrar clientes.</li>
                  <li><strong>Tipo de Pessoa:</strong> Filtra por pessoa física ou jurídica.</li>
                  <li><strong>Limpar:</strong> Remove todos os filtros aplicados.</li>
                  <li><strong>Exportar:</strong> Gere relatórios da lista em Excel ou PDF.</li>
                  <li><strong>Ações na Tabela:</strong>
                    <ul>
                      <li><i className="fas fa-search"></i> <strong>Visualizar:</strong> Detalhes do cliente.</li>
                      <li><i className="fas fa-pen"></i> <strong>Editar:</strong> Alterar dados do cliente.</li>
                      <li><i className="fas fa-trash"></i> <strong>Excluir:</strong> Remove o cliente da base.</li>
                      <li><i className="fas fa-check-circle"></i> / <i className="fas fa-times-circle"></i> <strong>Ativar/Inativar:</strong> Alterna o status do cliente.</li>
                    </ul>
                  </li>
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
