'use client';

import { useState, useEffect } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import "../../../public/template/css/modalCustom.css"
import { gerarOrcamentoPDF } from "../../utils/orcamentoPdf";

export default function Orcamentos() {
    const [lista, setLista] = useState([]);
    const [ordemCidade, setOrdemCidade] = useState('');
    const [filtroCidade, setFiltroCidade] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function gerarPDFComDadosCompletos(id) {
        try {
            const resposta = await httpClient.get(`/orcamentos/obter/${id}`);
            const dadosCompletos = await resposta.json();
            gerarOrcamentoPDF(dadosCompletos, id);
        } catch (erro) {
            alert("Erro ao buscar os dados completos do orçamento.");
            console.error(erro);
        }
    }

    async function carregarOrcamentos() {
        try {
            const resposta = await httpClient.get("/orcamentos/listar");
            const dados = await resposta.json();
            setLista(dados);
        } catch (erro) {
            console.error("Erro ao carregar orçamentos:", erro);
        }
    }

    async function excluirOrcamento(id) {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este orçamento?");
        if (!confirmacao) return;

        try {
            const resposta = await httpClient.delete(`/orcamentos/deletar/${id}`);
            const dados = await resposta.json();
            alert(dados.msg);
            carregarOrcamentos();
        } catch (erro) {
            console.error("Erro ao excluir orçamento:", erro);
        }
    }

    useEffect(() => {
        carregarOrcamentos();
    }, []);

    const limparFiltros = () => {
        setOrdemCidade('');
        setFiltroCidade('');
        setFiltroStatus('');
    };

    const formatarStatus = (status) => {
        switch (status) {
            case 0:
                return { texto: 'Cancelado', classe: 'bg-danger' };
            case 1:
                return { texto: 'Pendente', classe: 'bg-secondary' };
            case 2:
                return { texto: 'Enviado', classe: 'bg-primary' };
            case 3:
                return { texto: 'Aprovado', classe: 'bg-success' };
            default:
                return { texto: 'Desconhecido', classe: 'bg-dark' };
        }
    };

    function handleExportarExcel() {
        const dados = lista.map(o => ({
            ID: o.id,
            Cidade: o.cidade,
            "Prazo Validade": o.prazo_validade,
            "Prazo Entrega": o.prazo_entrega,
            Funcionário: o.funcionario?.nome || "-",
            Status: formatarStatus(o.status).texto,
            Data: new Date(o.data).toLocaleDateString()
        }));
        exportarParaExcel(dados, "orcamentos");
    }

    function handleExportarPDF() {
        const dados = lista.map(o => [
            o.id,
            o.cidade,
            o.prazo_validade,
            o.prazo_entrega,
            o.funcionario?.nome || "-",
            formatarStatus(o.status).texto,
            new Date(o.data).toLocaleDateString()
        ]);
        const colunas = ["ID", "Cidade", "Prazo Validade", "Prazo Entrega", "Funcionário", "Status", "Data"];
        exportarParaPDF(dados, colunas, "orcamentos");
    }

    return (
        <div>
            <h1 className="mb-4">Orçamentos Cadastrados
                <button
                    type="button"
                    onClick={() => setMostrarAjuda(true)}
                    title="Ajuda"
                    style={{ background: 'none', border: 'none', color: '#0d6efd', marginLeft: '10px', cursor: 'pointer', fontSize: '1.2rem' }}
                    aria-label="Abrir ajuda"
                >
                    <i className="fas fa-question-circle"></i>
                </button>
            </h1>

            {/* Filtros */}
            <div className="mb-4">
                <div className="row align-items-end g-2">
                    <div className="col-md-3">
                        <label className="form-label">Ordenar por Cidade</label>
                        <select className="form-select" onChange={(e) => setOrdemCidade(e.target.value)} value={ordemCidade} title="Ordene os orçamentos por cidade (A-Z ou Z-A)">
                            <option value="">Selecione</option>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Buscar por Cidade</label>
                        <input
                            type="text"
                            title="Digite a cidade para filtrar orçamentos"
                            className="form-control"
                            placeholder="Digite a cidade"
                            value={filtroCidade}
                            onChange={(e) => setFiltroCidade(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Filtrar por Status</label>
                        <select className="form-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} title="Filtrar orçamentos por status">
                            <option value="">Todos</option>
                            <option value="0">Cancelado</option>
                            <option value="1">Pendente</option>
                            <option value="2">Enviado</option>
                            <option value="3">Aprovado</option>
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

            {/* Botão Cadastrar */}
            <div className="mb-3">
                <Link href="/admin/orcamentos/cadastrar" className="btn btn-success" title="Cadastrar novo orçamento">
                    <i className="fas fa-plus me-1"></i> Cadastrar orçamento
                </Link>
            </div>

            {/* Tabela de Orçamentos */}
            {lista.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cidade</th>
                                <th>Prazo Validade</th>
                                <th>Prazo Entrega</th>
                                <th>Funcionário</th>
                                <th>Status</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista
                                .filter(o =>
                                    (filtroCidade === '' || o.cidade.toLowerCase().includes(filtroCidade.toLowerCase())) &&
                                    (filtroStatus === '' || String(o.status) === filtroStatus)
                                )
                                .sort((a, b) => {
                                    if (ordemCidade === 'asc') return a.cidade.localeCompare(b.cidade);
                                    if (ordemCidade === 'desc') return b.cidade.localeCompare(a.cidade);
                                    return 0;
                                })
                                .map((orcamento) => (
                                    <tr key={orcamento.id}>
                                        <td>{orcamento.id}</td>
                                        <td>{orcamento.cidade}</td>
                                        <td>{orcamento.prazo_validade}</td>
                                        <td>{orcamento.prazo_entrega}</td>
                                        <td>{orcamento.funcionario?.nome || '-'}</td>
                                        <td>
                                        <span className={`badge ${formatarStatus(orcamento.status).classe}`}>
                                            {formatarStatus(orcamento.status).texto}
                                        </span>
                                        </td>
                                        <td>{new Date(orcamento.data).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => gerarPDFComDadosCompletos(orcamento.id)}  title="Imprimir">
                                                <i className="fas fa-print"></i>
                                            </button>
                                            <Link href={`/admin/orcamentos/obter/${orcamento.id}`} className="btn btn-outline-info btn-sm me-1" title="Visualizar orçamento">
                                                <i className="fas fa-search"></i>
                                            </Link>
                                            <Link href={`/admin/orcamentos/alterar/${orcamento.id}`} className="btn btn-outline-primary btn-sm me-1" title="Editar orçamento">
                                                <i className="fas fa-pen"></i>
                                            </Link>
                                            <button onClick={() => excluirOrcamento(orcamento.id)} className="btn btn-outline-danger btn-sm" title="Excluir orçamento">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">Nenhum orçamento cadastrado.</p>
            )}

            {/* Botões Exportar */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <button onClick={handleExportarExcel} className="btn btn-outline-success btn-sm" title="Exportar para Excel">
                    <i className="bi bi-file-earmark-excel me-1"></i> Excel
                </button>
                <button onClick={handleExportarPDF} className="btn btn-outline-danger btn-sm" title="Exportar para PDF">
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
                            <p>Esta página permite a <strong>gestão de orçamentos cadastrados</strong> no sistema:</p>
                            <ul>
                                <li><strong>Ordenar por Cidade:</strong> Organiza os orçamentos de A-Z ou Z-A.</li>
                                <li><strong>Buscar por Cidade:</strong> Filtra os orçamentos com base no nome da cidade.</li>
                                <li><strong>Filtrar por Status:</strong> Mostra apenas os orçamentos com status selecionado.</li>
                                <li><strong>Botão Limpar:</strong> Remove todos os filtros.</li>
                                <li><strong>Cadastrar Orçamento:</strong> Abre o formulário de criação de novo orçamento.</li>
                                <li><strong>Ações na Tabela:</strong>
                                <ul>
                                    <li><i className="fas fa-print"></i> Gerar PDF completo do orçamento</li>
                                    <li><i className="fas fa-search"></i> Ver detalhes do orçamento</li>
                                    <li><i className="fas fa-pen"></i> Editar orçamento</li>
                                    <li><i className="fas fa-trash"></i> Excluir orçamento</li>
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