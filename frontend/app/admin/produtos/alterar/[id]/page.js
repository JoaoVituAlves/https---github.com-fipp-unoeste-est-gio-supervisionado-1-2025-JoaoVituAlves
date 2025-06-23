'use client'
import FormProduto from "../../../../components/forms/formProduto";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarProduto({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [produto, setProduto] = useState(null);

    async function carregarProduto() {
        try {
            const resposta = await httpClient.get(`/produtos/obter/${id}`);
            const dados = await resposta.json();
            setProduto(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar produto:", erro);
        }
    }

    useEffect(() => {
        carregarProduto();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormProduto produto={produto} />}
        </div>
    );
}