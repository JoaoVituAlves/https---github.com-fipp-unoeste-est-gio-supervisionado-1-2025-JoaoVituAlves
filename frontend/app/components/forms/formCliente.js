'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../../app/utils/httpClient";

// Funções auxiliares
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}
function apenasNumeros(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
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

export default function FormCliente({ cliente }) {
    const id = useRef();
    const nome = useRef();
    const email = useRef();
    const cpf = useRef();
    const telefone = useRef();
    const senha = useRef();
    const confmSenha = useRef();
    const tipo = useRef();
    const cnpj = useRef();
    const razaoSocial = useRef();
    const inscEstadual = useRef();
    const cep = useRef();
    const rua = useRef();
    const bairro = useRef();
    const cidade = useRef();
    const numero = useRef();
    const status = useRef();
    const [alteracao, setAlteracao] = useState(false);
    const router = useRouter();

    const [tipoSelecionado, setTipoSelecionado] = useState(cliente?.tipo || "");

    function gravarCliente() {
        if (
            nome.current.value && email.current.value && cpf.current.value && telefone.current.value &&
            senha.current?.value && confmSenha.current?.value && tipo.current.value && cep.current.value && rua.current.value &&
            bairro.current.value && cidade.current.value && numero.current.value && status.current.value
        ) {
            if(tipo.current.value == 2) {
                if(!cnpj.current.value && !razaoSocial.current.value && !inscEstadual.current.value) {
                    alert("Preencha os campos de pessoa jurídica!");
                }
            } 

            if (!validarEmail(email.current.value)) {
                alert("E-mail inválido!");
                return;
            }

            const dados = {
                nome: nome.current.value,
                email: email.current.value,
                cpf: cpf.current.value,
                telefone: telefone.current.value,
                senha: senha.current?.value,
                confmSenha: confmSenha.current?.value,
                tipo: tipo.current.value,
                cnpj: tipo.current.value === "2" && cnpj.current ? cnpj.current.value : null,
                razao_social: tipo.current.value === "2" && razaoSocial.current ? razaoSocial.current.value : null,
                insc_estadual: tipo.current.value === "2" && inscEstadual.current ? inscEstadual.current.value : null,
                cep: cep.current.value,
                rua: rua.current.value,
                bairro: bairro.current.value,
                cidade: cidade.current.value,
                numero: numero.current.value,
                status: status.current.value
            };


            httpClient.post("/clientes/gravar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao gravar cliente");
                    return; 
                }

                alert(resposta.msg || "Cliente gravado com sucesso");
                router.push("/admin/clientes"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao gravar cliente");
            });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function alterarCliente() {
       const tipoValido = tipo.current.value === "2"
            ? cnpj.current && cnpj.current.value &&
            razaoSocial.current && razaoSocial.current.value &&
            inscEstadual.current && inscEstadual.current.value
            : true;

        if (
            id.current && id.current.value &&
            nome.current.value && email.current.value && cpf.current.value &&
            telefone.current.value && tipo.current.value &&
            tipoValido &&
            cep.current.value && rua.current.value &&
            bairro.current.value && cidade.current.value &&
            numero.current.value && status.current.value
        ) {
            if (!validarEmail(email.current.value)) {
                alert("E-mail inválido!");
                return;
            }
            const dados = {
                id: id.current.value,
                nome: nome.current.value,
                email: email.current.value,
                cpf: cpf.current.value,
                telefone: telefone.current.value,
                tipo: tipo.current.value,
                cnpj: tipo.current.value === "2" && cnpj.current ? cnpj.current.value : null,
                razao_social: tipo.current.value === "2" && razaoSocial.current ? razaoSocial.current.value : null,
                insc_estadual: tipo.current.value === "2" && inscEstadual.current ? inscEstadual.current.value : null,
                cep: cep.current.value,
                rua: rua.current.value,
                bairro: bairro.current.value,
                cidade: cidade.current.value,
                numero: numero.current.value,
                status: status.current.value
            };


            httpClient.put("/clientes/alterar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao alterar cliente");
                    return; 
                }

                alert(resposta.msg || "Cliente alterado com sucesso");
                router.push("/admin/clientes"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao alterar cliente");
            });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }

    function formatarCPF(e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.slice(0, 11);
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
    }

    function formatarCNPJ(e) {
        let v = e.target.value.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/, "$1.$2");
        v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
        v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
        e.target.value = v;
    }

    useEffect(() => {
        if (cliente) {
            id.current.value = cliente.id;
            nome.current.value = cliente.nome;
            email.current.value = cliente.email;
            cpf.current.value = cliente.cpf;
            telefone.current.value = cliente.telefone;
            senha.current.value = cliente.senha;
            tipo.current.value = cliente.tipo;
            cep.current.value = cliente.cep;
            rua.current.value = cliente.rua;
            bairro.current.value = cliente.bairro;
            cidade.current.value = cliente.cidade;
            numero.current.value = cliente.numero;
            status.current.value = cliente.status;
    
            if (cliente.tipo == 2) {
                if (cnpj.current) cnpj.current.value = cliente.cnpj || "";
                if (razaoSocial.current) razaoSocial.current.value = cliente.razao_social || "";
                if (inscEstadual.current) inscEstadual.current.value = cliente.insc_estadual || "";
            }
    
            setAlteracao(true);
        }
    }, [cliente]);    

    return (
        <div>
            <h1>{alteracao ? "Alteração de Cliente" : "Cadastro de Cliente"}</h1>
            <hr />
            <input type="hidden" ref={id} />

            <div className="form-group">
                <label>Nome</label><input ref={nome} onInput={apenasLetras} className="form-control" />
            </div>
            <div className="form-group">
                <label>Email</label><input ref={email} className="form-control" />
            </div>
            <div className="form-group">
                <label>CPF</label><input ref={cpf} onInput={formatarCPF} maxLength={14} className="form-control" />
            </div>
            <div className="form-group">
                <label>Telefone</label><input ref={telefone} onInput={formatarTelefone} maxLength={15} className="form-control" />
            </div>
            <div className="form-group">
            {!alteracao && (
                <>
                    <div className="form-group">
                        <label>Senha</label>
                        <input ref={senha} type="password" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Senha</label>
                        <input ref={confmSenha} type="password" className="form-control" />
                    </div>
                </>
            )}
            </div>
            <div className="form-group">
                <label>Tipo</label>
                <select 
                    ref={tipo} 
                    className="form-select" 
                    onChange={(e) => setTipoSelecionado(e.target.value)}
                >
                    <option value="">Selecione o tipo</option>
                    <option value="1">Pessoa Física</option>
                    <option value="2">Pessoa Jurídica</option>
                </select>
            </div>
            {tipoSelecionado == 2 && (
                <>
                    <div className="form-group">
                        <label>CNPJ</label>
                        <input ref={cnpj} onInput={formatarCNPJ} maxLength={18} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Razão Social</label>
                        <input ref={razaoSocial} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Inscrição Estadual</label>
                        <input ref={inscEstadual} onInput={apenasNumeros} className="form-control" />
                    </div>
                </>
            )}
            <div className="form-group">
                <label>CEP</label><input ref={cep} onInput={apenasNumeros} onBlur={() => consultarCep(cep, rua, bairro, cidade)} className="form-control" maxLength={8} />
            </div>
            <div className="form-group">
                <label>Rua</label><input ref={rua} className="form-control" />
            </div>
            <div className="form-group">
                <label>Bairro</label><input ref={bairro} className="form-control" />
            </div>
            <div className="form-group">
                <label>Cidade</label><input ref={cidade} className="form-control" />
            </div>
            <div className="form-group">
                <label>Número</label><input ref={numero} className="form-control" onInput={apenasNumeros} />
            </div>
            <div className="form-group">
                <label>Status</label>
                <select ref={status} className="form-control">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>

            <div className="mt-3">
                <button onClick={alteracao ? alterarCliente : gravarCliente} className="btn btn-primary me-2" style={{marginRight:'5px'}}>
                    {alteracao ? 'Alterar' : 'Cadastrar'}
                </button>
                <Link className="btn btn-secondary" href="/admin/clientes">Voltar</Link>
            </div>
        </div>
    );
}