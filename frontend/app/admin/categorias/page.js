'use client'

import { useEffect, useState } from "react";
import httpClient from "../../../app/utils/httpClient";
import Link from "next/link";
import "../../../public/template/css/modalCustom.css"

export default function Categorias() {
    const [lista, setLista] = useState([]);
    const [mostrarAjuda, setMostrarAjuda] = useState(false);

    async function excluirCategoria(id) {
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta categoria?");
    
    if (!confirmacao) return;

    try {
        const resposta = await httpClient.delete(`/categorias/deletar/${id}`);

        if (!resposta.ok) {
            const erro = await resposta.json();
            alert(erro.msg || "Erro ao excluir categoria.");
            return;
        }

        const dados = await resposta.json();
        alert(dados.msg);
        carregarCategorias();
    } catch (erro) {
        console.error("Erro ao excluir categoria:", erro);
        alert("Erro ao excluir categoria. Ela pode estar vinculada a um ou mais produtos.");
    }
}


    function carregarCategorias() {
        httpClient.get("/categorias/listar")
            .then(r => r.json())
            .then(setLista)
            .catch(console.error);
    }

    useEffect(() => {
        carregarCategorias();
    }, []);

    return (
        <div>
            <h1>Categorias Cadastradas
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
                <Link href="/admin/categorias/cadastrar" className="btn btn-success btn-animado">
          <i className="fas fa-plus me-1"></i> Cadastrar Categorias
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
                            {lista.map(categoria => (
                                <tr key={categoria.id}>
                                    <td>{categoria.id}</td>
                                    <td>{categoria.descricao}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link
                                                href={`/admin/categorias/alterar/${categoria.id}`}
                                                className="btn btn-outline-primary btn-sm me-1"
                                                    title="Editar categoria">
                                                    <i className="fas fa-pen" />
                                            </Link>
                                            <button
                                                onClick={() => excluirCategoria(categoria.id)}
                                                className="btn btn-sm btn-outline-danger btn-animado"
                                                    title="Excluir categoria">
                                                    <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma categoria cadastrada.</p>
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
                                <p>Esta página permite gerenciar as <strong>categorias cadastradas</strong> no sistema:</p>
                                <ul>
                                    <li><strong>Lista de categorias:</strong> Visualize as categorias de produtos cadastradas no sistema.</li>
                                    <li><strong>Botão Cadastrar categorias:</strong> Leva você ao formulário para adicionar uma nova categoria de produto.</li>
                                    <li><strong>Ações na tabela:</strong>
                                        <ul>
                                            <li><i className="fas fa-pen"></i> Editar dados de uma categoria</li>
                                            <li><i className="fas fa-trash"></i> Excluir o categoria</li>
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
