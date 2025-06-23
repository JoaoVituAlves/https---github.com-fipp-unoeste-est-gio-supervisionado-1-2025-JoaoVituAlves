'use client'
import FormCliente from "../../../../../app/components/forms/formCliente";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarCliente({ params: { id } }) {
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
            {loading ? <Loading /> : <FormCliente cliente={cliente} />}
        </div>
    );
}
