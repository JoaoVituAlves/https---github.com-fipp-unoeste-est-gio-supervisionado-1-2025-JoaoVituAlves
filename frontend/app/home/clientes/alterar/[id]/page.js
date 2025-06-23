'use client'

import FormClientePublico from "../../../../components/forms/formClientePublico";
import Loading from "../../../../components/loading";
import httpClient from "../../../../utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarClientePublico({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [cliente, setCliente] = useState(null);

    async function carregarCliente() {
        try {
            const resposta = await httpClient.get(`/clientes/obter/${id}`);
            const dados = await resposta.json();
            setCliente(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar cliente:", erro);
        }
    }

    useEffect(() => {
        carregarCliente();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormClientePublico cliente={cliente} />}
        </div>
    );
}
