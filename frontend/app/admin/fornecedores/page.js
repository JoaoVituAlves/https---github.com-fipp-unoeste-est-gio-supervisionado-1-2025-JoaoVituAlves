'use client'

import { useState, useEffect } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import "../../../public/template/css/modalCustom.css"

export default function Fornecedores() {
    const [lista, setLista] = useState([]);
    const [ordemNome, setOrdemNome] = useState('');
    const [filtroCNPJ, setFiltroCNPJ] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    const formatarCNPJ = (cnpj) => {
        cnpj = cnpj.replace(/\D/g, '');
        if (cnpj.length <= 2) return cnpj;
        if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
        if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
        if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
        return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
    };

    async function excluirFornecedor(id) {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este fornecedor?");

        if (!confirmacao) return;

        try {
            const resposta = await httpClient.delete(`/fornecedores/deletar/${id}`);

            if (!resposta.ok) {
                const erro = await resposta.json();
                alert(erro.msg || "Erro ao excluir fornecedor.");
                return;
            }

            const dados = await resposta.json();
            alert(dados.msg);
            carregarFornecedores();
        } catch (erro) {
            console.error("Erro ao excluir fornecedor:", erro);
            alert("Erro ao excluir fornecedor. Ele pode estar vinculado a um ou mais produtos ou orçamentos.");
        }
    }

    async function alterarStatusFornecedor(id, statusAtual) {
        const acao = statusAtual ? 'inativar' : 'reativar';
        const confirmacao = window.confirm(`Tem certeza que deseja ${acao} este fornecedor?`);
        if (!confirmacao) return;

        try {
            const endpoint = statusAtual ? "/fornecedores/inativar" : "/fornecedores/reativar";
            const resposta = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id })
            });
            const dados = await resposta.json();
            alert(dados.msg);
            carregarFornecedores();
        } catch (erro) {
            console.error("Erro ao alterar status do fornecedor:", erro);
        }
    }

    function carregarFornecedores() {
        httpClient.get("/fornecedores/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarFornecedores();
    }, []);

    const limparFiltros = () => {
        setOrdemNome('');
        setFiltroCNPJ('');
        setFiltroStatus('');
    };

    const handleCNPJChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        setFiltroCNPJ(formatarCNPJ(value));
    };

   function handleExportarExcel() {
    const dados = lista.map(f => ({
        ID: f.id,
        Nome: f.razao_social,
        CNPJ: formatarCNPJ(f.cnpj),
        Telefone: f.telefone,
        Email: f.email,
        Endereço: `${f.rua}, ${f.numero}`,
        Status: f.status ? "Ativo" : "Inativo"
    }));
    exportarParaExcel(dados, "fornecedores");
}

function handleExportarPDF() {
    const dados = lista.map(f => [
        f.id,
        f.razao_social,
        formatarCNPJ(f.cnpj),
        f.telefone,
        f.email,
        `${f.rua}, ${f.numero}`,
        f.status ? "Ativo" : "Inativo"
    ]);
    const colunas = ["ID", "Nome", "CNPJ", "Telefone", "Email", "Endereço", "Status"];
    exportarParaPDF(dados, colunas, "fornecedores");
}


    return (
        <div>
            <h1 className="mb-4">Fornecedores Cadastrados
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

            {mostrarAjuda && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content animate__animated animate__fadeInDown">
                            <div className="modal-header">
                                <h5 className="modal-title">Ajuda: Como usar esta página</h5>
                                <button type="button" className="btn-close" onClick={() => setMostrarAjuda(false)}></button>
                            </div>
                            <div className="modal-body">
                            <p>Use os filtros e botões abaixo para gerenciar os fornecedores cadastrados:</p>
                            <ul>
                                <li><strong>Ordenar por Nome:</strong> Altere a ordem da lista entre A-Z ou Z-A.</li>
                                <li><strong>Buscar por CNPJ:</strong> Digite um número para filtrar os fornecedores.</li>
                                <li><strong>Status:</strong> Filtre fornecedores ativos ou inativos.</li>
                                <li><strong>Limpar:</strong> Remove todos os filtros aplicados.</li>
                                <li><strong>Cadastrar fornecedor:</strong> Abre o formulário para adicionar novo fornecedor.</li>
                                <li><strong>Ações disponíveis na tabela:</strong>
                                <ul>
                                    <li><i className="fas fa-search"></i> <strong>Visualizar:</strong> Ver detalhes do fornecedor.</li>
                                    <li><i className="fas fa-pen"></i> <strong>Editar:</strong> Alterar informações do fornecedor.</li>
                                    <li><i className="fas fa-trash"></i> <strong>Excluir:</strong> Remover o fornecedor (se não estiver vinculado a produtos/orçamentos).</li>
                                    <li><i className="fas fa-check-circle"></i> / <i className="fas fa-times-circle"></i> <strong>Ativar/Inativar:</strong> Alternar o status do fornecedor.</li>
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

            {/* Filtros */}
            <div className="mb-4">
                <div className="row align-items-end g-2">
                    <div className="col-md-3">
                        <label className="form-label">Ordenar por Nome</label>
                        <select className="form-select" onChange={(e) => setOrdemNome(e.target.value)} value={ordemNome} title="Ordene os fornecedores por nome (A-Z ou Z-A)">
                            <option value="">Selecione</option>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Buscar por CNPJ:</label>
                        <input type="text" className="form-control" placeholder="00.000.000/0000-00" value={filtroCNPJ} onChange={handleCNPJChange} maxLength="18" title="Digite o CNPJ para filtrar fornecedores" />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" onChange={(e) => setFiltroStatus(e.target.value)} value={filtroStatus} title="Filtrar fornecedores por status (ativo ou inativo)">
                            <option value="">Todos</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
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

            <div className="mb-3">
                <Link href="/admin/fornecedores/cadastrar" className="btn btn-success" title="Cadastrar novo fornecedor">
                    <i className="fas fa-plus me-1"></i> Cadastrar fornecedor
                </Link>
            </div>

            {lista.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CNPJ</th>
                                    <th>Telefone</th>
                                    <th>Email</th>
                                    <th>Endereço</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista
                                    .filter(f => {
                                        const cnpjOk = filtroCNPJ === '' || (f.cnpj && formatarCNPJ(f.cnpj).includes(filtroCNPJ));
                                        const statusOk =
                                            filtroStatus === '' ||
                                            (filtroStatus === 'ativo' && f.status) ||
                                            (filtroStatus === 'inativo' && !f.status);
                                        return cnpjOk && statusOk;
                                    })
                                    .sort((a, b) => {
                                        if (ordemNome === 'asc') return a.razao_social.localeCompare(b.razao_social);
                                        if (ordemNome === 'desc') return b.razao_social.localeCompare(a.razao_social);
                                        return 0;
                                    })
                                    .map(fornecedor => (
                                        <tr key={fornecedor.id}>
                                            <td>{fornecedor.id}</td>
                                            <td>{fornecedor.razao_social}</td>
                                            <td>{formatarCNPJ(fornecedor.cnpj)}</td>
                                            <td>{fornecedor.telefone}</td>
                                            <td>{fornecedor.email}</td>
                                            <td>{`${fornecedor.rua}, ${fornecedor.numero}`}</td>
                                            <td>
                                                <button
                                                    onClick={() => alterarStatusFornecedor(fornecedor.id, fornecedor.status)}
                                                    className={`btn btn-sm ${fornecedor.status ? 'btn-outline-success' : 'btn-outline-danger'}`}
                                                    title={fornecedor.status ? "Fornecedor está ativo, clique para inativá-lo" : "Fornecedor está inativo, clique para ativá-lo" }
                                                >
                                                    <i className={`fas ${fornecedor.status ? 'fa-check-circle' : 'fa-times-circle' }`}></i>
                                                </button></td>                                                  
                                            
                                            <td className="d-flex justify-content-center gap-1 flex-wrap">
                                                <Link href={`/admin/fornecedores/obter/${fornecedor.id}`} className="btn btn-outline-info btn-sm me-1" title="Visualizar fornecedor">
                                                    <i className="fas fa-search"></i>
                                                </Link>
                                                <Link href={`/admin/fornecedores/alterar/${fornecedor.id}`} className="btn btn-outline-primary btn-sm me-1" title="Editar fornecedor">
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                                <button onClick={() => excluirFornecedor(fornecedor.id)} className="btn btn-outline-danger btn-sm me-1" title="Excluir fornecedor">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                                
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botões Exportar */}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button onClick={handleExportarExcel} className="btn btn-outline-success btn-sm" title="Exportar para Excel">
                            <i className="bi bi-file-earmark-excel me-1"></i> Excel
                        </button>
                        <button onClick={handleExportarPDF} className="btn btn-outline-danger btn-sm" title="Exportar para PDF">
                            <i className="bi bi-file-earmark-pdf me-1"></i> PDF
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-muted">Nenhum fornecedor cadastrado.</p>
            )}
        </div>
    );
}
