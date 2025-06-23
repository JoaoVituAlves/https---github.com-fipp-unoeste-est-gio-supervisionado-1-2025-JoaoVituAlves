'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../../../app/utils/httpClient";
import Loading from "../../../../../app/components/loading";
import Link from "next/link";

export default function VisualizarCliente({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [cliente, setCliente] = useState(null);
    const [tipoDescricao, setTipoDescricao] = useState("");

    async function carregarDados() {
        try {
            const resposta = await httpClient.get(`/clientes/obter/${id}`);
            const dados = await resposta.json();
            setCliente(dados);

            if (dados.tipo === 1) {
                setTipoDescricao("Pessoa Física");
            } else if (dados.tipo === 2) {
                setTipoDescricao("Pessoa Jurídica");
            } else {
                setTipoDescricao("Tipo não informado");
            }

        } catch (erro) {
            console.error("Erro ao carregar dados do cliente:", erro);
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
                    <h4 className="mb-0"><i className="bi bi-person-lines-fill me-2"></i>Detalhes do Cliente</h4>
                </div>

                <div className="card-body">
                    <section className="mb-4">
                        <h5><i className="bi bi-info-circle me-2 text-primary"></i>Informações Pessoais</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Nome:</strong> <br /> {cliente?.nome}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Email:</strong> <br /> {cliente?.email}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Telefone:</strong> <br /> {cliente?.telefone || "Não informado"}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>CPF:</strong> <br /> {cliente?.cpf || "Não informado"}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Tipo:</strong> <br /> {tipoDescricao}
                            </div>

                            {cliente?.tipo === 2 && (
                                <>
                                    <div className="col-md-6 mb-3">
                                        <strong>CNPJ:</strong> <br /> {cliente?.cnpj || "Não informado"}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Razão Social:</strong> <br /> {cliente?.razao_social || "Não informada"}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Inscrição Estadual:</strong> <br /> {cliente?.insc_estadual || "Não informada"}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="mb-4">
                        <h5><i className="bi bi-geo-alt me-2 text-danger"></i>Endereço</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <strong>CEP:</strong> <br /> {cliente?.cep || "Não informado"}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Rua:</strong> <br /> {cliente?.rua || "Não informada"}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Número:</strong> <br /> {cliente?.numero || "Não informado"}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Bairro:</strong> <br /> {cliente?.bairro || "Não informado"}
                            </div>
                            <div className="col-md-4 mb-3">
                                <strong>Cidade:</strong> <br /> {cliente?.cidade || "Não informada"}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap">
                    <div className="d-flex gap-2">
                        <Link href={`/admin/clientes/alterar/${id}`} className="btn btn-primary">
                            <i className="fas fa-pen"></i>
                        </Link>

                        <button
                            className="btn btn-danger"
                            onClick={async () => {
                                const confirmacao = window.confirm("Tem certeza que deseja excluir este cliente?");
                                if (!confirmacao) return;

                                try {
                                    const resposta = await httpClient.delete(`/clientes/deletar/${id}`);
                                    const dados = await resposta.json();
                                    alert(dados.msg || "Cliente excluído com sucesso!");
                                    window.location.href = "/admin/clientes";
                                } catch (erro) {
                                    console.error("Erro ao excluir cliente:", erro);
                                    alert("Erro ao excluir cliente.");
                                }
                            }}
                            style={{ marginLeft: "5px" }}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>

                    <Link href="/admin/clientes" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i> Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}