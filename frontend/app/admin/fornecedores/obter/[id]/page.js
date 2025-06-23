'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../../../app/utils/httpClient";
import Loading from "../../../../../app/components/loading";
import Link from "next/link";

export default function VisualizarFornecedor({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [fornecedor, setFornecedor] = useState(null);

    async function carregarDados() {
        try {
            const resposta = await httpClient.get(`/fornecedores/obter/${id}`);
            const dados = await resposta.json();
            setFornecedor(dados);
        } catch (erro) {
            console.error("Erro ao carregar fornecedor:", erro);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-gradient text-white d-flex justify-content-between align-items-center" style={{ background: "#0d6efd" }}>
                    <h4 className="mb-0"><i className="bi bi-truck me-2"></i>Detalhes do Fornecedor</h4>
                </div>

                <div className="card-body">
                    <section className="mb-4">
                        <h5><i className="bi bi-building me-2 text-primary"></i>Informações da Empresa</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Nome Fantasia:</strong> <br /> {fornecedor?.nome_fantasia}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Razão Social:</strong> <br /> {fornecedor?.razao_social}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>CNPJ:</strong> <br /> {fornecedor?.cnpj}
                            </div>
                        </div>
                    </section>

                    <section className="mb-4">
                        <h5><i className="bi bi-envelope-at me-2 text-success"></i>Contato</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Email:</strong> <br /> {fornecedor?.email}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Telefone:</strong> <br /> {fornecedor?.telefone}
                            </div>
                        </div>
                    </section>

                    <section className="mb-4">
                        <h5><i className="bi bi-geo-alt me-2 text-danger"></i>Endereço</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <strong>CEP:</strong> <br /> {fornecedor?.cep}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Cidade:</strong> <br /> {fornecedor?.cidade}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Bairro:</strong> <br /> {fornecedor?.bairro}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Rua:</strong> <br /> {fornecedor?.rua}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Número:</strong> <br /> {fornecedor?.numero}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex gap-2">
                        <Link href={`/admin/fornecedores/alterar/${id}`} className="btn btn-primary">
                            <i className="fas fa-pen"></i>
                        </Link>

                        <button
                            className="btn btn-danger"
                            onClick={async () => {
                                const confirmacao = window.confirm("Tem certeza que deseja excluir este fornecedor?");
                                if (!confirmacao) return;

                                try {
                                    const resposta = await httpClient.delete(`/fornecedores/deletar/${id}`);
                                    const dados = await resposta.json();
                                    alert(dados.msg || "Fornecedor excluído com sucesso!");
                                    window.location.href = "/admin/fornecedores";
                                } catch (erro) {
                                    console.error("Erro ao excluir fornecedor:", erro);
                                    alert("Erro ao excluir fornecedor.");
                                }
                            }}
                            style={{ marginLeft: "5px" }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>

                    <Link href="/admin/fornecedores" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i> Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}