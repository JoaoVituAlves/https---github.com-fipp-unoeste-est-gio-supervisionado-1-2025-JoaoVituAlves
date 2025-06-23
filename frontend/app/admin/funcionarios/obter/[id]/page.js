'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../../../app/utils/httpClient";
import Loading from "../../../../../app/components/loading";
import Link from "next/link";

export default function VisualizarFuncionario({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [funcionario, setFuncionario] = useState(null);
    const [cargo, setCargo] = useState("");
    const [tipo, setTipo] = useState("");

    const formatar = Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });

    async function carregarDados() {
        try {
            const [funcionarioRes, cargosRes, tiposRes] = await Promise.all([
                httpClient.get(`/funcionarios/obter/${id}`).then(r => r.json()),
                httpClient.get("/cargos/listar").then(r => r.json()),
                httpClient.get("/tipos/listar").then(r => r.json())  
            ]);

            setFuncionario(funcionarioRes);

            const cargoEncontrado = cargosRes.find(c => c.id === funcionarioRes.id_cargo);
            setCargo(cargoEncontrado?.descricao || "Não especificado");

            const tipoEncontrado = tiposRes.find(t => t.id === funcionarioRes.id_tipo);
            setTipo(tipoEncontrado?.descricao || "Não especificado");

        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
        } finally {
            setLoading(false);
        }
    }

    // Função para alterar o status do funcionário
    async function alterarStatusFuncionario(id, statusAtual) {
        const acao = statusAtual ? 'inativar' : 'reativar';
        const confirmacao = window.confirm(`Tem certeza que deseja ${acao} este funcionário?`);

        if (!confirmacao) return;

        try {
            const endpoint = statusAtual ? "/funcionarios/inativar" : "/funcionarios/reativar";
            const resposta = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ id })
            });
            const dados = await resposta.json();
            alert(dados.msg);
            if (resposta.ok) {
                window.location.reload(); 
            }
        } catch (erro) {
            console.error("Erro ao alterar status do funcionário:", erro);
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
                    <h4 className="mb-0"><i className="bi bi-person-vcard me-2"></i>Detalhes do Funcionário</h4>
                </div>

                <div className="card-body">
                    <section className="mb-4">
                        <h5><i className="bi bi-info-circle me-2 text-primary"></i>Informações Pessoais</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Nome:</strong> <br /> {funcionario?.nome}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Email:</strong> <br /> {funcionario?.email}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Telefone:</strong> <br /> {funcionario?.telefone || "Não informado"}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>CPF:</strong> <br /> {funcionario?.cpf || "Não informado"}
                            </div>
                        </div>
                    </section>

                    <section className="mb-4">
                        <h5><i className="bi bi-briefcase me-2 text-success"></i>Informações Profissionais</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <strong>Cargo:</strong> <br /> {cargo}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Tipo:</strong> <br /> {tipo}
                            </div>
                            <div className="col-md-6 mb-3">
                                <strong>Salário:</strong> <br />
                                {funcionario?.salario ? formatar.format(funcionario.salario) : "Não informado"}
                             </div>

                            <div className="col-md-6 mb-3">
                                <strong>Data de Admissão:</strong> <br /> {new Date(funcionario?.data_admissao).toLocaleDateString() || "Não informada"}
                            </div>
                        </div>
                    </section>

                    <section className="mb-4">
                        <h5><i className="bi bi-toggle-on me-2 text-warning"></i>Status</h5>
                        <hr />
                        <span style={{color: 'white'}} className={`badge px-3 py-2 ${funcionario?.status ? 'bg-success' : 'bg-danger'}`}>
                            {funcionario?.status ? "Ativo" : "Inativo"}
                        </span>
                    </section>
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center flex-wrap">
                    {/* Botões à esquerda */}
                    <div className="d-flex gap-2">
                        <Link href={`/admin/funcionarios/alterar/${id}`} className="btn btn-primary">
                            <i className="fas fa-pen"></i>
                        </Link>

                        <button 
                            className="btn btn-danger"
                            onClick={async () => {
                                const confirmacao = window.confirm("Tem certeza que deseja excluir este funcionário?");
                                if (!confirmacao) return;

                                try {
                                    const resposta = await httpClient.delete(`/funcionarios/deletar/${id}`);
                                    const dados = await resposta.json();
                                    alert(dados.msg || "Funcionário excluído com sucesso!");
                                    window.location.href = "/admin/funcionarios";
                                } catch (erro) {
                                    console.error("Erro ao excluir funcionário:", erro);
                                    alert("Erro ao excluir funcionário.");
                                }
                            }}
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                        >
                            <i className="fas fa-trash"></i>
                            
                        </button>
                        <button
                            onClick={() => alterarStatusFuncionario(funcionario.id, funcionario.status)}
                            className={`btn btn-sm ${funcionario.status ? 'btn-danger' : 'btn-success'}`}
                            style={{ marginRight: "5px" }}
                        >
                            <i className={`bi ${funcionario.status ? 'bi-x-circle' : 'bi-arrow-clockwise'} me-1`}></i>
                            {funcionario.status ? 'Inativar' : 'Reativar'}
                        </button>
                    </div>

                    {/* Botão "Voltar" à direita */}
                    <Link href="/admin/funcionarios" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left me-1"></i> Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}