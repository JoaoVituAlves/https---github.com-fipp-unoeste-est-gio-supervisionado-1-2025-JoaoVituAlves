'use client'
import FormUnidade from "../../../../../app/components/forms/formUnidade";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarUnidade({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [unidade, setUnidade] = useState(null);

    async function carregarUnidade() {
        try {
            const resposta = await httpClient.get(`/unidades/obter/${id}`);
            const dados = await resposta.json();
            setUnidade(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar unidade:", erro);
        }
    }

    useEffect(() => {
        carregarUnidade();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormUnidade unidade={unidade} />}
        </div>
    );
}
