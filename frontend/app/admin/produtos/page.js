'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import "../../../public/template/css/modalCustom.css";
import Loading from "../../components/loading";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('');
  const [filtroStatusWeb, setFiltroStatusWeb] = useState('');
  const [ordemNome, setOrdemNome] = useState('');
  const [mostrarAjuda, setMostrarAjuda] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  async function alterarStatusWebProduto(id, statusWebAtual) {
    const acao = statusWebAtual ? 'oculto' : 'visível';
    const confirmacao = window.confirm(`Tem certeza que deseja deixar ${acao} este produto?`);
    if (!confirmacao) return;

    try {
      const endpoint = statusWebAtual ? "/produtos/oculto" : "/produtos/visivel";
      const resposta = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const dados = await resposta.json();
      alert(dados.msg);
      carregarProdutos();
    } catch (erro) {
      console.error("Erro ao alterar status web do produto:", erro);
    }
  }

  async function alterarStatusProduto(id, statusAtual) {
    const acao = statusAtual ? 'Inativar' : 'Ativar';
    const confirmacao = window.confirm(`Tem certeza que deseja ${acao} este produto?`);
    if (!confirmacao) return;

    try {
      const endpoint = statusAtual ? "/produtos/inativar" : "/produtos/ativar";
      const resposta = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      });
      const dados = await resposta.json();
      alert(dados.msg);
      carregarProdutos();
    } catch (erro) {
      console.error("Erro ao alterar status do produto:", erro);
    }
  }

  function carregarProdutos() {
    setLoading(true);
    httpClient.get("/produtos/listar")
      .then(r => r.json())
      .then(data => {
          setProdutos(data);
          setLoading(false);
      })
      .catch((err) => {
          console.error(err);
          setLoading(false);
      });
  }

  useEffect(() => { carregarProdutos(); }, []);

  function limparFiltros() {
    setFiltroNome('');
    setFiltroMarca('');
    setFiltroStatusWeb('');
    setOrdemNome('');
  }

  const produtosFiltrados = Array.isArray(produtos)
    ? produtos.filter(p => {
        const nomeOk = p.nome.toLowerCase().includes(filtroNome.toLowerCase());
        const marcaOk = filtroMarca === '' || (p.marca && p.marca.toLowerCase().includes(filtroMarca.toLowerCase()));
        const statusWebOk = filtroStatusWeb === '' ||
          (filtroStatusWeb === 'visivel' && p.status_web) ||
          (filtroStatusWeb === 'oculto' && !p.status_web);
        return nomeOk && marcaOk && statusWebOk;
      }).sort((a, b) => {
        if (ordemNome === 'asc') return a.nome.localeCompare(b.nome);
        if (ordemNome === 'desc') return b.nome.localeCompare(a.nome);
        return 0;
      })
    : [];

  function handleExportarExcel() {
    const dados = produtosFiltrados.map(p => ({
      ID: p.id,
      Nome: p.nome,
      Marca: p.marca,
      Categoria: p.categoria?.descricao || "",
      Fornecedor: p.fornecedor?.razao_social || "Nenhum",
      Validade: new Date(p.data_validade).toLocaleDateString("pt-BR"),
      Vitrine: p.status_web ? "Visível" : "Oculto",
      Ativo: p.ativo ? "Sim" : "Não",
      Preço: `R$ ${p.preco}`,
      Estoque: p.quantidade
    }));
    exportarParaExcel(dados, "produtos");
  }

  function handleExportarPDF() {
    const dados = produtosFiltrados.map(p => [
      p.id,
      p.nome,
      p.marca,
      p.categoria?.descricao || "",
      p.fornecedor?.razao_social || "Nenhum",
      new Date(p.data_validade).toLocaleDateString("pt-BR"),
      p.status_web ? "Visível" : "Oculto",
      p.ativo ? "Sim" : "Não",
      `R$ ${p.preco}`,
      p.quantidade
    ]);
    const colunas = ["ID", "Nome", "Marca", "Categoria", "Fornecedor", "Validade", "Vitrine", "Ativo", "Preço", "Estoque"];
    exportarParaPDF(dados, colunas, "produtos");
  }

  if (loading) return <Loading />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Lista de Produtos
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

      {/* Filtros */}
      <div className="mb-4">
        <div className="row align-items-end g-2">
          <div className="col-md-3">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" value={filtroNome}
              onChange={e => setFiltroNome(e.target.value)} placeholder="Filtrar por nome" title="Digite o nome do produto para filtrar" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Marca</label>
            <input type="text" className="form-control" value={filtroMarca}
              onChange={e => setFiltroMarca(e.target.value)} placeholder="Filtrar por marca" title="Digite a marca do produto para filtrar" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Status Vitrine</label>
            <select className="form-select" value={filtroStatusWeb}
              onChange={e => setFiltroStatusWeb(e.target.value)} title="Filtrar produtos por status da vitrine">
              <option value="">Todos</option>
              <option value="visivel">Visível</option>
              <option value="oculto">Oculto</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Ordenar por Nome</label>
            <select className="form-select" value={ordemNome}
              onChange={e => setOrdemNome(e.target.value)} title="Ordene os produtos por nome (A-Z ou Z-A)">
              <option value="">Nenhuma</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-secondary btn-sm w-100 btn-animado" onClick={limparFiltros} title="Limpar todos os filtros aplicados">
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Botão cadastrar */}
      <div>
        <Link href="/admin/produtos/cadastrar" className="btn btn-success btn-animado" title="Cadastrar novo produto">
          <i className="fas fa-plus me-1"></i> Cadastrar Produto
        </Link>
      </div>
      <br />

      {/* Tabela */}
      <div>
        {produtosFiltrados.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Marca</th>
                  <th>Categoria</th>
                  <th>Fornecedor</th>
                  <th>Vitrine</th>
                  <th>Ativo</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.map(produto => (
                  <tr key={produto.id}>
                    <td>{produto.id}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.marca}</td>
                    <td>{produto.categoria?.descricao}</td>
                    <td>{produto.fornecedor?.razao_social || "Nenhum"}</td>
                    <td>
                      <button onClick={() => alterarStatusWebProduto(produto.id, produto.status_web)}
                          className={`btn btn-sm ${produto.status_web ? 'btn-outline-success' : 'btn-outline-danger'}`}
                          title={produto.status_web ? 'Produto visível na vitrine, clique para ocultá-lo' : 'Produto oculto na vitrine, clique para deixá-lo visível'}>
                          <i className={`fas ${produto.status_web ?  'fa-eye' : 'fa-eye-slash'}`} />
                        </button>
                    </td>
                    <td>
                       <button onClick={() => alterarStatusProduto(produto.id, produto.ativo)}
                          className={`btn btn-sm ${produto.ativo ? 'btn-outline-success' : 'btn-outline-danger'} btn-anim`}
                          title={produto.ativo ? 'Produto está ativo, clique para inativá-lo' : 'Ativar Produto'}>
                          <i className={`fas ${produto.ativo ? 'fa-check-circle' : 'fa-times-circle'}`} />
                        </button>
                    </td>
                    <td>{formatar.format(produto.preco)}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Link href={`/admin/produtos/obter/${produto.id}`}
                          className="btn btn-sm btn-outline-info btn-animado"
                          title="Visualizar produto">
                          <i className="fas fa-search" />
                        </Link>
                        <Link href={`/admin/produtos/alterar/${produto.id}`}
                          className="btn btn-outline-primary btn-sm me-1"
                          title="Editar produto">
                          <i className="fas fa-pen" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Nenhum produto encontrado.</p>
        )}
      </div>

      {/* Botões Exportar */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button onClick={handleExportarExcel}
          className="btn btn-outline-success btn-sm btn-animado" title="Exportar para Excel">
          <i className="bi bi-file-earmark-excel me-1"></i> Excel
        </button>
        <button onClick={handleExportarPDF}
          className="btn btn-outline-danger btn-sm btn-animado" title="Exportar para PDF">
          <i className="bi bi-file-earmark-pdf me-1"></i> PDF
        </button>
      </div>
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
                <p>Esta página permite a <strong>visualização/gestão dos produtos cadastrados</strong> no sistema. Veja abaixo como utilizá-la:</p>
                <ul>
                  <li><strong>Nome e Marca:</strong> Digite para filtrar produtos por esses campos.</li>
                  <li><strong>Status Vitrine:</strong> Escolha entre visível ou oculto.</li>
                  <li><strong>Ordenar:</strong> Altere a ordem alfabética pelo nome do produto.</li>
                  <li><strong>Limpar:</strong> Remove todos os filtros ativos.</li>
                  <li><strong>Cadastrar Produto:</strong> Vai para o formulário de cadastro.</li>
                  <li><strong>Ações:</strong>
                    <ul>
                      <li><i className="fas fa-search"></i> Visualizar detalhes</li>
                      <li><i className="fas fa-pen"></i> Editar dados</li>
                      <li><i className="fas fa-eye-slash"></i>/<i className="fas fa-eye"></i> Alternar visibilidade na vitrine</li>
                      <li><i className="fas fa-times-circle"></i>/<i className="fas fa-check-circle"></i> Inativar ou Ativar o produto</li>
                    </ul>
                  </li>
                  <li><strong>Exportar:</strong> Baixa os dados da tabela em formato PDF ou Excel.</li>
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
