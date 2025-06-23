'use client'
import FormCargo from "../../../../../app/components/forms/formCargo";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarCargo({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [cargo, setCargo] = useState(null);

    async function carregarCargo() {
        try {
            const resposta = await httpClient.get(`/cargos/obter/${id}`);
            const dados = await resposta.json();
            setCargo(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar cargo:", erro);
        }
    }

    useEffect(() => {
        carregarCargo();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormCargo cargo={cargo} />}
        </div>
    );
}
