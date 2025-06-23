'use client';

import { useState, useEffect } from "react";
import httpClient from "../../../app/utils/httpClient";
import { exportarParaExcel, exportarParaPDF } from "../../../app/utils/exportador";
import Link from "next/link";
import "../../../public/template/css/modalCustom.css"
import { gerarPedidoPDF } from "../../utils/pedidoPdf";

export default function Pedidos() {
    const [lista, setLista] = useState([]);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [ordemData, setOrdemData] = useState('');
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function gerarPDFComDadosCompletos(id) {
        try {
            const resposta = await httpClient.get(`/pedidos/detalhes/${id}`);
            const dadosCompletos = await resposta.json();
            gerarPedidoPDF(dadosCompletos, id);
        } catch (erro) {
            alert("Erro ao buscar os dados completos do pedido.");
            console.error(erro);
        }
    }

    function carregarPedidos() {
        httpClient.get("/pedidos/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarPedidos();
    }, []);

    const limparFiltros = () => {
        setFiltroCliente('');
        setFiltroStatus('');
        setOrdemData('');
    };

    const formatar = Intl.NumberFormat("pt-BR", {
      style: 'currency',
      currency: 'BRL'
    });

    function handleExportarExcel() {
        const dados = lista.map(p => ({
            ID: p.id,
            Cliente: p.cliente?.nome,
            Data: new Date(p.data_pedido).toLocaleDateString(),
            Valor: `R$ ${p.valor_total?.toFixed(2).replace('.', ',')}`,
            Status: p.status
        }));
        exportarParaExcel(dados, "pedidos");
    }

    function handleExportarPDF() {
        const dados = lista.map(p => ([
            p.id,
            p.cliente?.nome,
            new Date(p.data_pedido).toLocaleDateString(),
            `${formatar.format(p.valor_total)}`,
            p.status
        ]));
        const colunas = ["ID", "Cliente", "Data", "Valor Total", "Status"];
        exportarParaPDF(dados, colunas, "pedidos");
    }

    // Função para mapear o status para o texto e a classe da badge
    const obterStatus = (status) => {
        switch (status) {
            case 1:
                return { texto: 'Pendente', classe: 'bg-secondary' };
            case 2:
                return { texto: 'Aprovado', classe: 'bg-primary' };
            case 3:
                return { texto: 'Em Preparo', classe: 'bg-info' };
            case 4:
                return { texto: 'Em Entrega', classe: 'bg-warning' };
            case 5:
                return { texto: 'Cancelado', classe: 'bg-danger' };
            case 6:
                return { texto: 'Finalizado', classe: 'bg-success' };
            default:
                return { texto: 'Desconhecido', classe: 'bg-dark' };
        }
    };

    return (
        <div>
            <h1 className="mb-4">Pedidos Realizados
                <button
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
                >
                    <i className="fas fa-question-circle"></i>
                </button>
            </h1>

            {/* Filtros */}
            <div className="mb-4">
                <div className="row align-items-end g-2">
                    <div className="col-md-4">
                        <label className="form-label">Filtrar por Cliente</label>
                        <input
                            type="text"
                            title="Digite o cliente para filtrar pedidos"
                            className="form-control"
                            placeholder="Nome do cliente"
                            value={filtroCliente}
                            onChange={e => setFiltroCliente(e.target.value)}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Status do Pedido</label>
                        <select className="form-select" value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} title="Filtrar pedidos por status">
                            <option value="">Todos</option>
                            <option value="1">Pendente</option>
                            <option value="2">Aprovado</option>
                            <option value="3">Em Preparo</option>
                            <option value="4">Em Entrega</option>
                            <option value="5">Cancelado</option>
                            <option value="6">Finalizado</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Ordenar por Data</label>
                        <select className="form-select" value={ordemData} onChange={e => setOrdemData(e.target.value)} title="Filtrar pedidos por data">
                            <option value="">Nenhum</option>
                            <option value="asc">Mais antigos</option>
                            <option value="desc">Mais recentes</option>
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
                <Link href="/admin/pedidos/cadastrar" className="btn btn-success" title="Cadastrar novo pedido">
                    <i className="fas fa-plus me-1"></i> Cadastrar pedido
                </Link>
            </div>

            {/* Tabela */}
            {lista.length > 0 ? (
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista
                                .filter(p => {
                                    const clienteOk = filtroCliente === '' || p.cliente?.nome.toLowerCase().includes(filtroCliente.toLowerCase());
                                    const statusOk = filtroStatus === '' || p.status === parseInt(filtroStatus, 10);  // Alteração aqui
                                    return clienteOk && statusOk;
                                })
                                .sort((a, b) => {
                                    if (ordemData === 'asc') return new Date(a.data_pedido) - new Date(b.data_pedido);
                                    if (ordemData === 'desc') return new Date(b.data_pedido) - new Date(a.data_pedido);
                                    return 0;
                                })
                                .map(p => {
                                    const { texto, classe } = obterStatus(p.status);
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td>{p.cliente?.nome}</td>
                                            <td>{new Date(p.data_pedido).toLocaleDateString()}</td>
                                            <td>{formatar.format(p.valor_total)}</td>
                                            <td>
                                                <span className={`badge ${classe}`}>
                                                    {texto}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-outline-secondary btn-sm me-1" onClick={() => gerarPDFComDadosCompletos(p.id)}  title="Imprimir">
                                                    <i className="fas fa-print"></i>
                                                </button>
                                                <Link href={`/admin/pedidos/visualizar/${p.id}`} className="btn btn-sm btn-outline-info btn-animado me-1" title="Visualizar pedido">
                                                    <i className="fas fa-search"></i>
                                                </Link>
                                                <Link href={`/admin/pedidos/alterar/${p.id}`} className="btn btn-outline-primary btn-sm me-1" title="Editar pedido">
                                                    <i className="fas fa-pen"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">Nenhum pedido encontrado.</p>
            )}

            {/* Botões Exportar */}
            <div className="d-flex justify-content-end gap-2 mt-3">
                <button onClick={handleExportarExcel} className="btn btn-outline-success btn-sm" title="Exportar para EXCEL">
                    <i className="bi bi-file-earmark-excel me-1" ></i> Excel
                </button>
                <button onClick={handleExportarPDF} className="btn btn-outline-danger btn-sm" title="Exportar para PDF">
                    <i className="bi bi-file-earmark-pdf me-1" ></i> PDF
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
                            <p>Esta página permite a <strong>visualização/gestão dos pedidos realizados</strong> no sistema. Veja abaixo como utilizá-la:</p>
                            <ul>
                                <li><strong>Filtrar por Cliente:</strong> Digite parte do nome do cliente para localizar pedidos específicos.</li>
                                <li><strong>Status do Pedido:</strong> Selecione um status (Pendente, Aprovado, etc.) para refinar a busca.</li>
                                <li><strong>Ordenar por Data:</strong> Ordene os pedidos da data mais antiga para a mais recente, ou vice-versa.</li>
                                <li><strong>Limpar Filtros:</strong> Restaura a listagem completa.</li>
                                <li><strong>Ações disponíveis:</strong>
                                <ul>
                                    <li><i className="fas fa-search me-1" /> Visualizar detalhes do pedido.</li>
                                    <li><i className="fas fa-pen me-1" /> Editar as informações do pedido.</li>
                                    <li><i className="fas fa-print me-1" /> Gerar um PDF com os dados completos do pedido.</li>
                                </ul>
                                </li>
                                <li><strong>Exportar:</strong> Baixe um relatório da tabela em PDF ou Excel com os filtros aplicados.</li>
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