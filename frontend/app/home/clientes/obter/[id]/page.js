'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import httpClient from "../../../../app/utils/httpClient";

export default function DetalhesCliente() {
    const { id } = useParams();
    const [cliente, setCliente] = useState(null);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function buscarCliente() {
            try {
                const resposta = await httpClient.get(`/clientes/obter/${id}`);
                const dados = await resposta.json();
                setCliente(dados);
            } catch (err) {
                setErro("Erro ao buscar cliente.");
                console.error(err);
            }
        }

        if (id) {
            buscarCliente();
        }
    }, [id]);

    if (erro) return <div className="alert alert-danger">{erro}</div>;

    if (!cliente) return <div className="text-center mt-5">Carregando...</div>;

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4>Detalhes do Cliente</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label"><strong>ID:</strong></label>
                            <div className="form-control">{cliente.id}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label"><strong>Nome:</strong></label>
                            <div className="form-control">{cliente.nome}</div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label"><strong>Documento:</strong></label>
                            <div className="form-control">
                                {cliente.tipo === 1 ? cliente.cpf : cliente.cnpj}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label"><strong>Telefone:</strong></label>
                            <div className="form-control">{cliente.telefone}</div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label"><strong>Email:</strong></label>
                            <div className="form-control">{cliente.email}</div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label"><strong>Tipo:</strong></label>
                            <div className="form-control">
                                {cliente.tipo === 1 ? "Pessoa Física" : "Pessoa Jurídica"}
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <Link
                            href={`/clientes/alterar/${cliente.id}`}
                            className="btn btn-primary btn-sm me-1"
                            style={{marginRight: '5px'}}
                        >
                            Alterar
                        </Link>
                        <button className="btn btn-secondary">
                            <i className="bi bi-key me-1"></i> Criar Nova Senha
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}