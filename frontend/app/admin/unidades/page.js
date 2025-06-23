'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import "../../../public/template/css/modalCustom.css"

export default function Unidades() {
    const [lista, setLista] = useState([]);
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function excluirUnidade(id) {
        const confirmacao = window.confirm("Tem certeza que deseja excluir esta unidade?");
        if (!confirmacao) return;

        try {
            const resposta = await httpClient.delete(`/unidades/deletar/${id}`);

            if (!resposta.ok) {
                const erro = await resposta.json();
                alert(erro.msg || "Erro ao excluir unidade.");
                return;
            }

            const dados = await resposta.json();
            alert(dados.msg);
            carregarUnidades();
        } catch (erro) {
            console.error("Erro ao excluir unidade:", erro);
            alert("Erro ao excluir unidade. Ela pode estar vinculada a um ou mais produtos.");
        }
    }

    function carregarUnidades() {
        httpClient.get("/unidades/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarUnidades();
    }, []);

    return (
        <div>
            <h1>
                Unidades Cadastradas
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

            {/* Botão cadastrar */}
            <div>
                <Link href="/admin/unidades/cadastrar" className="btn btn-success btn-animado" title="Cadastrar nova unidade">
                    <i className="fas fa-plus me-1"></i> Cadastrar Unidade
                </Link>
            </div>
            <br />

            {/* Tabela */}
            <div>
                {lista.length > 0 ? (
                    <table className="table table-bordered text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Descrição</th>
                                <th>Sigla</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map(unidade => (
                                <tr key={unidade.id}>
                                    <td>{unidade.id}</td>
                                    <td>{unidade.descricao}</td>
                                    <td>{(unidade.sigla).toUpperCase()}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link
                                                href={`/admin/unidades/alterar/${unidade.id}`}
                                                className="btn btn-outline-primary btn-sm me-1"
                                                title="Editar unidade"
                                            >
                                                <i className="fas fa-pen" />
                                            </Link>
                                            <button
                                                onClick={() => excluirUnidade(unidade.id)}
                                                className="btn btn-sm btn-outline-danger btn-animado"
                                                title="Excluir unidade"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma unidade cadastrada.</p>
                )}
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
                            <p>Esta página permite a <strong>gestão das unidades de medida</strong> cadastradas no sistema:</p>
                            <ul>
                                <li><strong>Editar:</strong> Clique no ícone <i className="fas fa-pen"></i> para editar a unidade.</li>
                                <li><strong>Excluir:</strong> Clique no ícone <i className="fas fa-trash"></i> para remover uma unidade (caso não esteja em uso).</li>
                                <li><strong>Cadastrar Unidade:</strong> Utilize o botão verde para adicionar uma nova unidade de medida.</li>
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
