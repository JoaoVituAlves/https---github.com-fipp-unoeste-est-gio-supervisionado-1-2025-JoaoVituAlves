'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import httpClient from "../../../app/utils/httpClient";

// Função auxiliar
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

export default function FormCategoria({ categoria }) {
    const id = useRef();
    const descricao = useRef();
    const [alteracao, setAlteracao] = useState(false);
    const router = useRouter();

    function gravarCategoria() {
        if (descricao.current.value) {
            const dados = {
                descricao: descricao.current.value,
            };

            httpClient.post("/categorias/gravar", dados)
                .then(() => {
                    alert("Categoria cadastrada com sucesso!");
                    router.push("/admin/categorias");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao cadastrar categoria.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function alterarCategoria() {
        if (id.current && id.current.value && descricao.current.value) {
            const dados = {
                id: id.current.value,
                descricao: descricao.current.value,
            };

            httpClient.put("/categorias/alterar", dados)
                .then(() => {
                    alert("Categoria atualizada com sucesso!");
                    router.push("/admin/categorias");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao atualizar categoria.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    useEffect(() => {
        if (categoria) {
            id.current.value = categoria.id;
            descricao.current.value = categoria.descricao;
            setAlteracao(true);
        }
    }, []);

    return (
        <div>
            <h1>{alteracao ? "Alteração de Categoria" : "Cadastro de Categoria"}</h1>
            <hr />
            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Descrição</label>
                <input ref={descricao} onInput={apenasLetras} className="form-control" />
            </div>

            <div className="mt-3">
                <button
                    onClick={alteracao ? alterarCategoria : gravarCategoria}
                    className="btn btn-primary me-2"
                    style={{ marginRight: '5px' }}
                >
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/categorias">Voltar</Link>
            </div>
        </div>
    );
}
