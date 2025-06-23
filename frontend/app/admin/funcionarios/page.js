'use client';

import { useState, useEffect } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import "../../../public/template/css/modalCustom.css"
import Loading from "../../components/loading";

export default function Funcionarios() {
    const [lista, setLista] = useState([]);
    const [ordemNome, setOrdemNome] = useState('');
    const [filtroCPF, setFiltroCPF] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [mostrarAjuda, setMostrarAjuda] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mostrarTodos, setMostrarTodos] = useState(false); // Novo estado para mostrar tudo

    const formatarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length <= 3) return cpf;
        if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
        if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
    };

    async function alterarStatusFuncionario(id, statusAtual) {
        const acao = statusAtual ? 'inativar' : 'reativar';
        const confirmacao = window.confirm(`Tem certeza que deseja ${acao} este funcionário?`);
        if (!confirmacao) return;

        try {
            const endpoint = statusAtual ? "/funcionarios/inativar" : "/funcionarios/reativar";
            const resposta = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id })
            });
            const dados = await resposta.json();
            alert(dados.msg);
            carregarFuncionarios();
        } catch (erro) {
            console.error("Erro ao alterar status do funcionário:", erro);
        }
    }

    function carregarFuncionarios() {
        setLoading(true);
        httpClient.get("/funcionarios/listar")
            .then(r => r.json())
            .then(data => {
                setLista(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        carregarFuncionarios();
    }, []);

    const limparFiltros = () => {
        setOrdemNome('');
        setFiltroCPF('');
        setFiltroStatus('');
        setMostrarTodos(false); // opcional: resetar para mostrar só os 10
    };

    const handleCPFChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        setFiltroCPF(formatarCPF(value));
    };

    function handleExportarExcel() {
        const dados = lista.map(f => ({
            ID: f.id,
            Nome: f.nome,
            CPF: f.cpf,
            Telefone: f.telefone,
            Email: f.email,
            Cargo: f.cargo,
            Status: f.status ? "Ativo" : "Inativo"
        }));
        exportarParaExcel(dados, "funcionarios");
    }

    function handleExportarPDF() {
        const dados = lista.map(f => [
            f.id,
            f.nome,
            f.cpf,
            f.telefone,
            f.email,
            f.cargo,
            f.status ? "Ativo" : "Inativo"
        ]);
        const colunas = ["ID", "Nome", "CPF", "Telefone", "Email", "Cargo", "Status"];
        exportarParaPDF(dados, colunas, "funcionarios");
    }

    if (loading) return <Loading />;

    // Aplica filtros e ordenação
    const listaFiltradaOrdenada = lista
        .filter(f => {
            const cpfOk = filtroCPF === '' || formatarCPF(f.cpf).includes(filtroCPF);
            const statusOk =
                filtroStatus === '' ||
                (filtroStatus === 'ativo' && f.status) ||
                (filtroStatus === 'inativo' && !f.status);
            return cpfOk && statusOk;
        })
        .sort((a, b) => {
            if (ordemNome === 'asc') return a.nome.localeCompare(b.nome);
            if (ordemNome === 'desc') return b.nome.localeCompare(a.nome);
            return 0;
        });

    return (
        <div>
            <h1 className="mb-4">Funcionários Cadastrados
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
                        <label className="form-label">Ordenar por Nome</label>
                        <select className="form-select" onChange={(e) => setOrdemNome(e.target.value)} value={ordemNome} title="Ordene os funcionários por nome (A-Z ou Z-A)">
                            <option value="">Selecione</option>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Buscar por CPF:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="000.000.000-00"
                            value={filtroCPF}
                            onChange={handleCPFChange}
                            maxLength="14"
                            inputMode="numeric"
                            title="Digite o CPF para filtrar funcionários"
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Status</label>
                        <select className="form-select" onChange={(e) => setFiltroStatus(e.target.value)} value={filtroStatus} title="Filtrar funcionários por status (ativo ou inativo)">
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

            {/* Botão Cadastrar */}
            <div className="mb-3">
                <Link href="/admin/funcionarios/cadastrar" className="btn btn-success" title="Cadastrar novo funcionário">
                    <i className="fas fa-user-plus me-1"></i> Cadastrar funcionário
                </Link>
            </div>

            {/* Tabela de Funcionários */}
            {listaFiltradaOrdenada.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Cargo</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaFiltradaOrdenada
                                .slice(0, mostrarTodos ? listaFiltradaOrdenada.length : 20)
                                .map((funcionario) => (
                                    <tr key={funcionario.id}>
                                        <td>{funcionario.id}</td>
                                        <td>{funcionario.nome}</td>
                                        <td>{funcionario.cpf}</td>
                                        <td>{funcionario.telefone}</td>
                                        <td>{funcionario.email}</td>
                                        <td>{funcionario.cargo.descricao}</td>
                                        <td>
                                            <button
                                                onClick={() => alterarStatusFuncionario(funcionario.id, funcionario.status)}
                                                className={`btn btn-sm ${funcionario.status ? 'btn-outline-success' : 'btn-outline-danger'}`}
                                                title={funcionario.status ? "Funcionário está ativo, clique para inativá-lo" : "Funcionário está inativo, clique para ativá-lo"}
                                            >
                                                <i className={`fas ${funcionario.status ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                            </button>
                                        </td>
                                        <td>
                                            <Link
                                                href={`/admin/funcionarios/obter/${funcionario.id}`}
                                                className="btn btn-outline-info btn-sm me-1"
                                                title="Visualizar funcionário"
                                            >
                                                <i className="fas fa-search"></i>
                                            </Link>
                                            <Link
                                                href={`/admin/funcionarios/alterar/${funcionario.id}`}
                                                className="btn btn-outline-primary btn-sm me-1"
                                                title="Editar funcionário"
                                            >
                                                <i className="fas fa-pen"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {/* Botão para mostrar mais/menos */}
                    {listaFiltradaOrdenada.length > 20 && (
                        <div className="text-center mt-2">
                            <button
                                className="btn btn-link"
                                onClick={() => setMostrarTodos(!mostrarTodos)}
                            >
                                {mostrarTodos ? "Mostrar menos" : "Mostrar mais"}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-muted">Nenhum funcionário cadastrado.</p>
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
                            <p>Use os filtros e botões abaixo para consultar e gerenciar os funcionários cadastrados:</p>
                            <ul>
                                <li><strong>Ordenar por Nome:</strong> Altere a ordem alfabética da lista (A-Z ou Z-A).</li>
                                <li><strong>Buscar por CPF:</strong> Digite um CPF parcial ou completo para encontrar um funcionário específico.</li>
                                <li><strong>Status:</strong> Selecione para visualizar apenas funcionários ativos ou inativos.</li>
                                <li><strong>Limpar:</strong> Remove todos os filtros aplicados.</li>
                                <li><strong>Cadastrar funcionário:</strong> Abre o formulário para adicionar um novo funcionário ao sistema.</li>
                                <li><strong>Ações disponíveis:</strong>
                                <ul>
                                    <li><i className="fas fa-search"></i> <strong>Visualizar:</strong> Veja os detalhes completos do funcionário.</li>
                                    <li><i className="fas fa-pen"></i> <strong>Editar:</strong> Altere os dados do funcionário.</li>
                                    <li><i className="fas fa-times-circle"></i> / <i className="fas fa-check-circle"></i> <strong>Inativar/Reativar:</strong> Altere o status do funcionário.</li>
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