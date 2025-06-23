'use client'
import FormFornecedor from "../../../../../app/components/forms/formFornecedor";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarFornecedor({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [fornecedor, setFornecedor] = useState(null);

    async function carregarFornecedor() {
        try {
            const resposta = await httpClient.get(`/fornecedores/obter/${id}`);
            const dados = await resposta.json();
            setFornecedor(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar fornecedor:", erro);
        }
    }

    useEffect(() => {
        carregarFornecedor();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormFornecedor fornecedor={fornecedor} />}
        </div>
    );
}
