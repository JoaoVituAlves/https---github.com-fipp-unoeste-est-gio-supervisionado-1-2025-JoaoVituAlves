'use client';
import { useEffect, useState } from "react";
import httpClient from "../../../../../app/utils/httpClient";
import Loading from "../../../../../app/components/loading";
import Link from "next/link";
import { gerarOrcamentoPDF } from "../../../../utils/orcamentoPdf";

export default function VisualizarOrcamento({ params: { id } }) {
  const [loading, setLoading] = useState(true);
  const [orcamento, setOrcamento] = useState(null);

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  async function carregarDados() {
    try {
      const resposta = await httpClient.get(`/orcamentos/obter/${id}`);
      const dados = await resposta.json();
      setOrcamento(dados);
    } catch (erro) {
      console.error("Erro ao carregar orçamento:", erro);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0">
        <div
          className="card-header bg-gradient text-white d-flex justify-content-between align-items-center"
          style={{ background: "#0d6efd" }}
        >
          <h4 className="mb-0">
            <i className="bi bi-file-earmark-text me-2"></i> Detalhes do Orçamento
          </h4>
        </div>

        <div className="card-body">
          <section className="mb-4">
            <h5>
              <i className="bi bi-geo-alt me-2 text-primary"></i> Informações Gerais
            </h5>
            <hr />
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Cidade:</strong> <br /> {orcamento?.cidade}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Prazo de Validade:</strong> <br /> {orcamento?.prazo_validade}
                </div>
                <div className="col-md-6 mb-3">
                <strong>Prazo de Entrega:</strong> <br /> {orcamento?.prazo_entrega}
                </div>
            </div>
          </section>

          <section className="mb-4">
            <h5>
              <i className="bi bi-list-ul me-2 text-primary"></i> Itens do Orçamento
            </h5>
            <hr />
            {orcamento?.itens && orcamento.itens.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr className="text-center">
                      <th>Item</th>
                      <th>Descrição</th>
                      <th>Marca</th>
                      <th>Quantidade</th>
                      <th>Unidade</th>
                      <th>Valor Unitário (R$)</th>
                      <th>Total do Item (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamento.itens.map((item, index) => {
                      const totalItem = item.valor_unitario * item.quantidade;
                      return (
                        <tr className="text-center" key={index}>
                          <td>{index + 1}</td>
                          <td>{item.descricao}</td>
                          <td>{item.marca}</td>
                          <td>{item.quantidade}</td>
                          <td>{item.sigla}</td>
                          <td>{formatar.format(item.valor_unitario)}</td>
                          <td>{formatar.format(totalItem)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="6" className="text-end">Total do Orçamento (R$):</th>
                      <th className="text-center">
                        {formatar.format(orcamento.itens
                          .reduce((soma, item) => soma + (item.valor_unitario * item.quantidade), 0))
                        }
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-muted">Nenhum item cadastrado neste orçamento.</p>
            )}
          </section>

          <section className="mb-4">
            <hr />
            <div className="row">
              
              <div className="col-md-6 mb-3">
                <strong>Funcionário Responsável:</strong> <br /> {orcamento?.funcionario?.nome || orcamento?.id_funcionario}
              </div>
            </div>
          </section>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex gap-2">
            <Link href={`/admin/orcamentos/alterar/${id}`} className="btn btn-primary">
              <i className="fas fa-pen"></i>
            </Link>

            <button
              className="btn btn-danger"
              onClick={async () => {
                const confirmacao = window.confirm("Tem certeza que deseja excluir este orçamento?");
                if (!confirmacao) return;

                try {
                  const resposta = await httpClient.delete(`/orcamentos/deletar/${id}`);
                  const dados = await resposta.json();
                  alert(dados.msg || "Orçamento excluído com sucesso!");
                  window.location.href = "/admin/orcamentos";
                } catch (erro) {
                  console.error("Erro ao excluir orçamento:", erro);
                  alert("Erro ao excluir orçamento.");
                }
              }}
              style={{ marginLeft: "5px" }}
            >
              <i className="fas fa-trash"></i>
            </button>
            <button className="btn btn-secondary" onClick={() => gerarOrcamentoPDF(orcamento, orcamento.id)}>
              <i className="fas fa-print"></i> Gerar PDF
            </button>
          </div>

          <Link href="/admin/orcamentos" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i> Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
