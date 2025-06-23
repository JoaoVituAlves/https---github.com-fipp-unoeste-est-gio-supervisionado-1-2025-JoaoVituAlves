'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import "../../../public/template/css/modalCustom.css"

export default function Cargos() {
    const [lista, setLista] = useState([]);
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function excluirCargo(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir este cargo?");

    if (!confirmacao) return;

    try {
        const resposta = await httpClient.delete(`/cargos/deletar/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(erro.msg || "Erro ao excluir cargo.");
            return;
        }

        const dados = await resposta.json();
        alert(dados.msg);
        carregarCargos();
    } catch (erro) {
        console.error("Erro ao excluir cargo:", erro);
        alert("Erro ao excluir cargo. Ele pode estar vinculado a um ou mais funcionários.");
        }
    }


    function carregarCargos() {
        httpClient.get("/cargos/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarCargos();
    }, []);

    return (
        <div>
            <h1>
                Cargos Cadastrados
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
                <Link href="/admin/cargos/cadastrar" className="btn btn-success btn-animado" title="Cadastrar novo cargo">
                    <i className="fas fa-plus me-1"></i> Cadastrar Cargo
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
                            {lista.map(cargo => (
                                <tr key={cargo.id}>
                                    <td>{cargo.id}</td>
                                    <td>{cargo.descricao}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link
                                                href={`/admin/cargos/alterar/${cargo.id}`}
                                                className="btn btn-outline-primary btn-sm me-1"
                                                title="Editar cargo"
                                            >
                                                <i className="fas fa-pen" />
                                            </Link>
                                            <button
                                                onClick={() => excluirCargo(cargo.id)}
                                                className="btn btn-sm btn-outline-danger btn-animado"
                                                title="Excluir cargo"
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
                    <p>Nenhum cargo cadastrado.</p>
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
                            <p>Esta página permite gerenciar os cargos cadastrados no sistema:</p>
                            <ul>
                                <li><strong>Editar:</strong> Clique no ícone <i className="fas fa-pen"></i> para alterar o nome de um cargo.</li>
                                <li><strong>Excluir:</strong> Clique no ícone <i className="fas fa-trash"></i> para remover um cargo do sistema.</li>
                                <li><strong>Cadastrar Cargo:</strong> Utilize o botão <strong>“Cadastrar Cargo”</strong> para adicionar um novo cargo.</li>
                            </ul>
                            <p><strong>Aviso:</strong> cargos vinculados a funcionários não podem ser excluídos.</p>
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
