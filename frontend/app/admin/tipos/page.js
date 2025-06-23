'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import "../../../public/template/css/modalCustom.css"

export default function Tipos() {
    const [lista, setLista] = useState([]);
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function excluirTipo(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este tipo?");
    
    if (!confirmacao) return;

    try {
        const resposta = await httpClient.delete(`/tipos/deletar/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(erro.msg || "Erro ao excluir tipo.");
            return;
        }

        const dados = await resposta.json();
        alert(dados.msg);
        carregarTipos();
    } catch (erro) {
        console.error("Erro ao excluir tipo:", erro);
        alert("Erro ao excluir tipo. Ele pode estar vinculado a um ou mais registros.");
    }
}

    function carregarTipos() {
        httpClient.get("/tipos/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarTipos();
    }, []);

    return (
        <div>
            <h1>Tipos Cadastrados
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
                <Link href="/admin/tipos/cadastrar" className="btn btn-success btn-animado" title="Cadastrar novo tipo">
                    <i className="fas fa-plus me-1"></i> Cadastrar Tipo
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
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.map(tipo => (
                                <tr key={tipo.id}>
                                    <td>{tipo.id}</td>
                                    <td>{tipo.descricao}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link
                                                href={`/admin/tipos/alterar/${tipo.id}`}
                                                className="btn btn-outline-primary btn-sm me-1"
                                                title="Editar tipo">
                                                <i className="fas fa-pen" />
                                            </Link>
                                            <button
                                                onClick={() => excluirTipo(tipo.id)}
                                                className="btn btn-sm btn-outline-danger btn-animado"
                                                title="Excluir tipo">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum tipo cadastrado.</p>
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
                            <p>Esta página permite gerenciar os <strong>tipos cadastrados</strong> no sistema:</p>
                            <ul>
                                <li><strong>Lista de Tipos:</strong> Exibe todos os tipos atualmente cadastrados.</li>
                                <li><strong>Cadastrar Tipo:</strong> Clique no botão <strong>"Cadastrar Tipo"</strong> para adicionar um novo.</li>
                                <li><strong>Ações:</strong>
                                <ul>
                                    <li><i className="fas fa-pen"></i> Editar: atualiza a descrição de um tipo existente.</li>
                                    <li><i className="fas fa-trash"></i> Excluir: remove o tipo. Tipos vinculados a registros não podem ser excluídos.</li>
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
