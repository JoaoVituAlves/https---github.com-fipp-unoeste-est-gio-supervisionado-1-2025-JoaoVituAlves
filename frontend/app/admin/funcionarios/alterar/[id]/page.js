'use client'
import FormFuncionario from "../../../../..//app/components/forms/formFuncionario";
import Loading from "../../../../../app/components/loading";
import httpClient from "../../../../../app/utils/httpClient";
import { useEffect, useState } from "react";

export default function AlterarFuncionario({ params: { id } }) {
    const [loading, setLoading] = useState(true);
    const [funcionario, setFuncionario] = useState(null);

    async function carregarFuncionario() {
        try {
            const resposta = await httpClient.get(`/funcionarios/obter/${id}`);
            const dados = await resposta.json();
            setFuncionario(dados);
            setLoading(false);
        } catch (erro) {
            console.error("Erro ao carregar funcionário:", erro);
        }
    }

    useEffect(() => {
        carregarFuncionario();
    }, []);

    return (
        <div>
            {loading ? <Loading /> : <FormFuncionario funcionario={funcionario} />}
        </div>
    );
}