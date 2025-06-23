'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../../../app/utils/httpClient";
import Loading from "../../../../../app/components/loading";
import Link from "next/link";

export default function VisualizarProduto({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [produto, setProduto] = useState(null);
    const [categoria, setCategoria] = useState("");
    const [fornecedor, setFornecedor] = useState("");

    const formatar = Intl.NumberFormat("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });

    async function carregarDados() {
        try {
            const [produtoRes, categoriasRes, fornecedoresRes] = await Promise.all([
                httpClient.get(`/produtos/obter/${id}`).then(r => r.json()),
                httpClient.get("/categorias/listar").then(r => r.json()),
                httpClient.get("/fornecedores/listar").then(r => r.json())
            ]);

            setProduto(produtoRes);
            const categoriaEncontrada = categoriasRes.find(c => c.id === produtoRes.id_categoria);
            setCategoria(categoriaEncontrada?.descricao || "Não especificada");
            const fornecedorEncontrado = fornecedoresRes.find(f => f.id === produtoRes.id_fornecedor);
            setFornecedor(fornecedorEncontrado?.razao_social || "Não especificado");
        } catch (erro) {
            console.error("Erro ao carregar dados do produto:", erro);
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
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h4 className="fs-4 mb-0"><i className="bi bi-box me-2"></i>Visualizar Produto</h4>
                </div>
                <div className="card-body">

                    {/* Seção: Informações Básicas */}
                    <h5 className="mt-2 mb-3 border-bottom pb-2">Informações Básicas</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-tag-fill me-1"></i>Nome:</strong><br />
                            {produto?.nome}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-card-text me-1"></i>Descrição:</strong><br />
                            {produto?.descricao}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-bookmark-fill me-1"></i>Categoria:</strong><br />
                            {categoria}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-award-fill me-1"></i>Marca:</strong><br />
                            {produto?.marca}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-truck me-1"></i>Fornecedor:</strong><br />
                            {fornecedor}
                        </div>
                    </div>

                    {/* Seção: Estoque e Preço */}
                    <h5 className="mt-4 mb-3 border-bottom pb-2">Estoque</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-cash-coin me-1"></i>Preço:</strong><br />
                            {formatar.format(produto?.preco)}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-123 me-1"></i>Quantidade:</strong><br />
                            {produto?.quantidade}
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-123 me-1"></i>Valor Total em Estoque:</strong><br />
                            {formatar.format(produto?.quantidade * produto?.preco)}
                        </div>
                    </div>

                    {/* Seção: Status */}
                    <h5 className="mt-4 mb-3 border-bottom pb-2">Status</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-globe me-1"></i>Disponível no site:</strong><br />
                            <span className={`badge ${produto?.status_web ? 'bg-success' : 'bg-danger'}`}>
                                {produto?.status_web ? "Visível" : "Oculto"}
                            </span>
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-toggle-on me-1"></i>Ativo:</strong><br />
                            <span className={`badge ${produto?.ativo ? 'bg-success' : 'bg-danger'}`}>
                                {produto?.ativo ? "Sim" : "Não"}
                            </span>
                        </div>
                        <div className="col-md-4 mb-3">
                            <strong><i className="bi bi-calendar-check-fill me-1"></i>Validade:</strong><br />
                            {produto?.data_validade ? new Date(produto.data_validade).toLocaleDateString() : "Não informada"}
                        </div>
                    </div>

                    {/* Seção: Imagem */}
                    {produto?.imagens?.length > 0 && (
                        <div className="col-md-12 mt-4">
                            <strong><i className="bi bi-image-fill me-1"></i>Imagem do produto:</strong><br />
                            <img
                                src={`data:image/${produto.imagens[0].tipo};base64,${produto.imagens[0].blob}`}
                                alt="Imagem do produto"
                                style={{
                                    maxWidth: '250px',
                                    borderRadius: '10px',
                                    marginTop: '10px',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className="card-footer d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-2">
                        <Link href={`/admin/produtos/alterar/${id}`} className="btn btn-primary">
                            <i className="fas fa-pen me-1"></i> Alterar
                        </Link>
                        <button
                            className="btn btn-danger"
                            onClick={async () => {
                                const confirmacao = window.confirm("Tem certeza que deseja excluir este produto?");
                                if (!confirmacao) return;
                                try {
                                    const resposta = await httpClient.delete(`/produtos/deletar/${id}`);
                                    const dados = await resposta.json();
                                    alert(dados.msg || "Produto excluído com sucesso!");
                                    window.location.href = "/admin/produtos";
                                } catch (erro) {
                                    console.error("Erro ao excluir produto:", erro);
                                    alert("Erro ao excluir produto.");
                                }
                            }}
                        >
                            <i className="fas fa-trash me-1"></i> Excluir
                        </button>
                    </div>
                    <Link href="/admin/produtos" className="btn btn-outline-secondary">
                        <i className="bi bi-arrow-left-circle me-1"></i> Voltar
                    </Link>
                </div>
            </div>
        </div>
    );
}