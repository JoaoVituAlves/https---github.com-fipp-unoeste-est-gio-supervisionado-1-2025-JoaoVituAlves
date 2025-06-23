'use client'
import FormOrcamento from "../../../../../app/components/forms/formOrcamento";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarOrcamento({ params: { id } }) {
  const [loading, setLoading] = useState(true);
  const [orcamento, setOrcamento] = useState(null);

  async function carregarOrcamento() {
    try {
      const resposta = await httpClient.get(`/orcamentos/obter/${id}`);
      const dados = await resposta.json();
      setOrcamento(dados);
      setLoading(false);
    } catch (erro) {
      console.error("Erro ao carregar orçamento:", erro);
    }
  }

  useEffect(() => {
    carregarOrcamento();
  }, [id]);

  return (
    <div>
      {loading ? <Loading /> : <FormOrcamento dadosIniciais={orcamento} />}
    </div>
  );
}
