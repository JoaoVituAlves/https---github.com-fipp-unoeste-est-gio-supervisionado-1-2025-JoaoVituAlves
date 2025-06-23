'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../../app/utils/httpClient";

// Funções auxiliares de validação e formatação
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}

function apenasNumeros(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
}

function formatarCNPJ(e) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = v;
}

function formatarTelefone(e) {
    let tel = e.target.value.replace(/\D/g, '');
    if (tel.length > 11) tel = tel.slice(0, 11);
    if (tel.length <= 10) {
        tel = tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        tel = tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    e.target.value = tel;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado == digitos.charAt(1);
}

export default function FormFornecedor({ fornecedor }) {
    const id = useRef();
    const nomeFantasia = useRef();
    const razaoSocial = useRef();
    const cnpj = useRef();
    const telefone = useRef();
    const email = useRef();
    const cep = useRef();
    const rua = useRef();
    const bairro = useRef();
    const cidade = useRef();
    const numero = useRef();
    const [alteracao, setAlteracao] = useState(false);

    const router = useRouter();

    function gravarFornecedor() {
        if (
            nomeFantasia.current.value && razaoSocial.current.value && cnpj.current.value &&
            telefone.current.value && email.current.value && cep.current.value &&
            rua.current.value && bairro.current.value && cidade.current.value && numero.current.value
        ) {
            if (!validarEmail(email.current.value)) {
                alert("E-mail inválido!");
                return;
            }

            if (!validarCNPJ(cnpj.current.value)) {
                alert("CNPJ inválido!");
                return;
            }

            const dados = {
                "nome_fantasia": nomeFantasia.current.value,
                "razao_social": razaoSocial.current.value,
                "cnpj": cnpj.current.value,
                "telefone": telefone.current.value,
                "email": email.current.value,
                "cep": cep.current.value,
                "rua": rua.current.value,
                "bairro": bairro.current.value,
                "cidade": cidade.current.value,
                "numero": numero.current.value
            }

            httpClient.post("/fornecedores/gravar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao gravar fornecedor");
                    return; 
                }

                alert(resposta.msg || "Fornecedor gravado com sucesso");
                router.push("/admin/fornecedores"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao gravar fornecedor");
            });
        } else {
            alert("Preencha os campos corretamente!");
        }
    }

    function alterarFornecedor() {
        if (
            id.current && id.current.value &&
            nomeFantasia.current.value && razaoSocial.current.value && cnpj.current.value &&
            telefone.current.value && email.current.value && cep.current.value &&
            rua.current.value && bairro.current.value && cidade.current.value && numero.current.value
        ) {
            if (!validarEmail(email.current.value)) {
                alert("E-mail inválido!");
                return;
            }

            if (!validarCNPJ(cnpj.current.value)) {
                alert("CNPJ inválido!");
                return;
            }

            const dados = {
                "id": id.current.value,
                "nome_fantasia": nomeFantasia.current.value,
                "razao_social": razaoSocial.current.value,
                "cnpj": cnpj.current.value,
                "telefone": telefone.current.value,
                "email": email.current.value,
                "cep": cep.current.value,
                "rua": rua.current.value,
                "bairro": bairro.current.value,
                "cidade": cidade.current.value,
                "numero": numero.current.value
            }

            httpClient.put("/fornecedores/alterar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao alterar fornecedor");
                    return; 
                }

                alert(resposta.msg || "Fornecedor alterado com sucesso");
                router.push("/admin/fornecedores"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao alterar fornecedor");
            });
        } else {
            alert("Preencha os campos corretamente!");
        }
    }

    function consultarCep(cepRef, ruaRef, bairroRef, cidadeRef) {
        const cep = cepRef.current.value.replace(/\D/g, "");

        if (cep.length !== 8) {
            alert("CEP inválido! Deve conter 8 dígitos.");
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert("CEP não encontrado!");
                    ruaRef.current.value = "";
                    bairroRef.current.value = "";
                    cidadeRef.current.value = "";
                    return;
                }

                ruaRef.current.value = data.logradouro || "";
                bairroRef.current.value = data.bairro || "";
                cidadeRef.current.value = data.localidade || "";
            })
            .catch(error => {
                console.error("Erro ao consultar CEP:", error);
                alert("Erro ao consultar o CEP.");
            });
    }
    useEffect(() => {
        if (fornecedor) {
            id.current.value = fornecedor.id;
            nomeFantasia.current.value = fornecedor.nome_fantasia;
            razaoSocial.current.value = fornecedor.razao_social;
            cnpj.current.value = fornecedor.cnpj;
            telefone.current.value = fornecedor.telefone;
            email.current.value = fornecedor.email;
            cep.current.value = fornecedor.cep;
            rua.current.value = fornecedor.rua;
            bairro.current.value = fornecedor.bairro;
            cidade.current.value = fornecedor.cidade;
            numero.current.value = fornecedor.numero;

            setAlteracao(true);
        }
    }, []);

    return (
        <div>
            <h1>{alteracao ? "Alteração de Fornecedor" : "Cadastro de Fornecedor"}</h1>
            <hr />

            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Nome Fantasia</label>
                <input ref={nomeFantasia} onInput={apenasLetras} className="form-control" />
            </div>
            <div className="form-group">
                <label>Razão Social</label>
                <input ref={razaoSocial} className="form-control" />
            </div>
            <div className="form-group">
                <label>CNPJ</label>
                <input ref={cnpj} onInput={formatarCNPJ} maxLength={18} className="form-control" />
            </div>
            <div className="form-group">
                <label>Telefone</label>
                <input ref={telefone} onInput={formatarTelefone} maxLength={15} className="form-control" />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input ref={email} className="form-control" />
            </div>
            <div className="form-group">
                <label>CEP</label>
                <input ref={cep} onInput={apenasNumeros} onBlur={() => consultarCep(cep, rua, bairro, cidade)} className="form-control" maxLength={8} />
            </div>
            <div className="form-group">
                <label>Rua</label>
                <input ref={rua} className="form-control" />
            </div>
            <div className="form-group">
                <label>Bairro</label>
                <input ref={bairro} className="form-control" />
            </div>
            <div className="form-group">
                <label>Cidade</label>
                <input ref={cidade} className="form-control" />
            </div>
            <div className="form-group">
                <label>Número</label>
                <input ref={numero} onInput={apenasNumeros} className="form-control" />
            </div>

            <div className="mt-3">
                <button onClick={alteracao ? alterarFornecedor : gravarFornecedor} className="btn btn-primary me-2" style={{marginRight:'5px'}}>
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/fornecedores">Voltar</Link>
            </div>
        </div>
    );
}