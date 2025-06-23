'use client'
import FormCategoria from "../../../../../app/components/forms/formCategoria";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarCategoria({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [categoria, setCategoria] = useState(null);

    async function carregarCategoria() {
        try {
            const resposta = await httpClient.get(`/categorias/obter/${id}`);
            const dados = await resposta.json();
            setCategoria(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar categoria:", erro);
        }
    }

    useEffect(() => {
        carregarCategoria();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormCategoria categoria={categoria} />}
        </div>
    );
}
