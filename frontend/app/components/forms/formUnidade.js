'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import httpClient from "../../../app/utils/httpClient";

export default function FormUnidade({ unidade }) {
    const id = useRef();
    const descricao = useRef();
    const sigla = useRef();
    const [alteracao, setAlteracao] = useState(false);
    const [erroSigla, setErroSigla] = useState("");
    const [erroDesc, setErroDesc] = useState("");
    const router = useRouter();

    function apenasLetras(e) {
        const valorOriginal = e.target.value;
        const valorCorrigido = valorOriginal.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");

        if(/[^a-zA-ZÀ-ÿ\s]/.test(valorOriginal)) {
            setErroDesc("Digite apenas letras.");
        } else {
            setErroDesc("");
        }

        e.target.value = valorCorrigido;
    }

    function apenasLetrasMaiusculas(e) {
        const valorOriginal = e.target.value;
        const valorCorrigido = valorOriginal.replace(/[^A-Z]/g, "");

        if (/[a-z]/.test(valorOriginal)) {
            setErroSigla("Digite apenas letras maiúsculas.");
        } else {
            setErroSigla("");
        }

        e.target.value = valorCorrigido;
    }

    function gravarUnidade() {
        if (descricao.current.value && sigla.current.value) {
            const dados = {
                descricao: descricao.current.value,
                sigla: sigla.current.value
            };

            httpClient.post("/unidades/gravar", dados)
                .then(res => res.json())
                .then(dados => {
                    if (dados.msg) alert(dados.msg);
                    router.push("/admin/unidades");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao cadastrar unidade.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function alterarUnidade() {
        if (id.current && id.current.value && descricao.current.value && sigla.current.value) {
            const dados = {
                id: id.current.value,
                descricao: descricao.current.value,
                sigla: sigla.current.value
            };

            httpClient.put("/unidades/alterar", dados)
                .then(res => res.json())
                .then(dados => {
                    if (dados.msg) alert(dados.msg);
                    router.push("/admin/unidades");
                })
                .catch(e => {
                    console.error(e);
                    alert("Erro ao atualizar unidade.");
                });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    useEffect(() => {
        if (unidade) {
            id.current.value = unidade.id;
            descricao.current.value = unidade.descricao;
            sigla.current.value = unidade.sigla;
            setAlteracao(true);
        }
    }, []);

    return (
        <div>
            <h1>{alteracao ? "Alteração de Unidade" : "Cadastro de Unidade"}</h1>
            <hr />
            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Descrição</label>
                <input ref={descricao} onInput={apenasLetras} className="form-control" />
                {erroDesc && <small className="text-danger">{erroDesc}</small>}
            </div>

            <div className="form-group mt-2">
                <label>Sigla</label>
                <input ref={sigla} onInput={apenasLetrasMaiusculas} className="form-control" maxLength={10} />
                {erroSigla && <small className="text-danger">{erroSigla}</small>}
            </div>

            <div className="mt-3">
                <button
                    type="button"
                    onClick={alteracao ? alterarUnidade : gravarUnidade}
                    className="btn btn-primary me-2"
                    style={{ marginRight: '5px' }}
                >
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/unidades">Voltar</Link>
            </div>
        </div>
    );
}
