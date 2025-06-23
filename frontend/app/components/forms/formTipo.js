'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../utils/httpClient";

// Funções auxiliares
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

export default function FormTipo({ tipo }) {
    const id = useRef();
    const descricao = useRef();
    const [alteracao, setAlteracao] = useState(false);
    const router = useRouter();

    function gravarTipo() {
        if (descricao.current.value) 
        {
            const dados = {
                descricao: descricao.current.value,
            };

            httpClient.post("/tipos/gravar", dados)
                .then(() => {
                    alert("Tipo cadastrado com sucesso!");
                    router.push("/admin/tipos");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao cadastrar tipo.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function alterarTipo() {
        if (id.current && id.current.value && descricao.current.value) 
        {
            const dados = {
                id: id.current.value,
                descricao: descricao.current.value,
            };

            httpClient.put("/tipos/alterar", dados)
                .then(() => {
                    alert("Tipo atualizado com sucesso!");
                    router.push("/admin/tipos");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao atualizar tipo.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    useEffect(() => {
        if (tipo) {
            id.current.value = tipo.id;
            descricao.current.value = tipo.descricao;
            setAlteracao(true);
        }
    }, []);

    return (
        <div>
            <h1>{alteracao ? "Alteração de Tipo" : "Cadastro de Tipo"}</h1>
            <hr />
            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Descrição</label><input ref={descricao} onInput={apenasLetras} className="form-control" />
            </div>

            <div className="mt-3">
                <button onClick={alteracao ? alterarTipo : gravarTipo} className="btn btn-primary me-2" style={{marginRight:'5px'}}>
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/tipos">Voltar</Link>
            </div>
        </div>
    );
}