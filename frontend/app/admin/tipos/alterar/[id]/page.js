'use client'
import FormTipo from "../../../../../app/components/forms/formTipo";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarTipo({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [tipo, setTipo] = useState(null);

    async function carregarTipo() {
        try {
            const resposta = await httpClient.get(`/tipos/obter/${id}`);
            const dados = await resposta.json();
            setTipo(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar tipo:", erro);
        }
    }

    useEffect(() => {
        carregarTipo();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormTipo tipo={tipo} />}
        </div>
    );
}
