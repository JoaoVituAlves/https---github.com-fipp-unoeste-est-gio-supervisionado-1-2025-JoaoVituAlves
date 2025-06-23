'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../../app/utils/httpClient";

// Funções auxiliares
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

export default function FormCargo({ cargo }) {
    const id = useRef();
    const descricao = useRef();
    const [alteracao, setAlteracao] = useState(false);
    const router = useRouter();

    function gravarCargo() {
        if (descricao.current.value) 
        {
            const dados = {
                descricao: descricao.current.value,
            };

            httpClient.post("/cargos/gravar", dados)
                .then(() => {
                    alert("Cargo cadastrado com sucesso!");
                    router.push("/admin/cargos");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao cadastrar cargo.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function alterarCargo() {
        if (id.current && id.current.value && descricao.current.value) 
        {
            const dados = {
                id: id.current.value,
                descricao: descricao.current.value,
            };

            httpClient.put("/cargos/alterar", dados)
                .then(() => {
                    alert("Cargo atualizado com sucesso!");
                    router.push("/admin/cargos");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao atualizar cargo.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    useEffect(() => {
        if (cargo) {
            id.current.value = cargo.id;
            descricao.current.value = cargo.descricao;
            setAlteracao(true);
        }
    }, []);

    return (
        <div>
            <h1>{alteracao ? "Alteração de Cargo" : "Cadastro de Cargo"}</h1>
            <hr />
            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Descrição</label><input ref={descricao} onInput={apenasLetras} className="form-control" />
            </div>

            <div className="mt-3">
                <button onClick={alteracao ? alterarCargo : gravarCargo} className="btn btn-primary me-2" style={{marginRight:'5px'}}>
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/cargos">Voltar</Link>
            </div>
        </div>
    );
}