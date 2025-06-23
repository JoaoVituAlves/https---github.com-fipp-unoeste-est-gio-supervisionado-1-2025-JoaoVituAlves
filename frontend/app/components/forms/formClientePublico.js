'use client';
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import httpClient from "../../../app/utils/httpClient";

// Funções auxiliares
function apenasLetras(e) {
    e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
}
function apenasNumeros(e) {
    e.target.value = e.target.value.replace(/\D/g, "");
}
function formatarTelefone(e) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
    e.target.value = v;
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

export default function FormClientePublico({ cliente }) {
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
    const [isPessoaJuridica, setIsPessoaJuridica] = useState(false);
    const router = useRouter();

    function gravarCliente() {
        if (
            nome.current.value && email.current.value && cpf.current.value && telefone.current.value &&
            senha.current.value && confmSenha.current?.value && tipo.current.value &&
            (!isPessoaJuridica || (cnpj.current.value && razaoSocial.current.value && inscEstadual.current.value)) &&
            cep.current.value && rua.current.value &&
            bairro.current.value && cidade.current.value && numero.current.value
        ) {
            if (!validarEmail(email.current.value)) {
                alert("E-mail inválido!");
                return;
            }

            const dados = {
                nome: nome.current.value,
                email: email.current.value,
                cpf: cpf.current.value,
                telefone: telefone.current.value,
                senha: senha.current.value,
                confmSenha: confmSenha.current?.value,
                tipo: tipo.current.value,
                cnpj: isPessoaJuridica ? cnpj.current.value : '',
                razao_social: isPessoaJuridica ? razaoSocial.current.value : '',
                insc_estadual: isPessoaJuridica ? inscEstadual.current.value : '',
                cep: cep.current.value,
                rua: rua.current.value,
                bairro: bairro.current.value,
                cidade: cidade.current.value,
                numero: numero.current.value,
                status: 1 
            };

            httpClient.post("/clientes/gravar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao realizar seu cadastro");
                    return;
                }

                alert(resposta.msg || "Cadastro efetivado com sucesso");
                router.push("/home/login");
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao realizar seu cadastro");
            });
        } else {
            alert("Preencha todos os campos corretamente!");
        }
    }


    function alterarCliente() {
        if (
            id.current && id.current.value && nome.current.value && email.current.value && cpf.current.value && telefone.current.value && tipo.current.value && (!isPessoaJuridica || (cnpj.current.value && razaoSocial.current.value && inscEstadual.current.value)) &&
            cep.current.value && rua.current.value &&
            bairro.current.value && cidade.current.value && numero.current.value && status.current.value
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
                cnpj: isPessoaJuridica ? cnpj.current.value : '',
                razao_social: isPessoaJuridica ? razaoSocial.current.value : '',
                insc_estadual: isPessoaJuridica ? inscEstadual.current.value : '',
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
                    alert(resposta.msg || "Erro ao alterar informações do perfil");
                    return; 
                }

                alert(resposta.msg || "Informações do perfil salvas com sucesso");
                router.push("/home/login"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao alterar informações do perfil");
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
            setIsPessoaJuridica(cliente.tipo === 2);
            cep.current.value = cliente.cep;
            rua.current.value = cliente.rua;
            bairro.current.value = cliente.bairro;
            cidade.current.value = cliente.cidade;
            numero.current.value = cliente.numero;
            status.current.value = cliente.status;
            setAlteracao(true);
        }
    }, [cliente]);

    function handleTipoChange() {
        setIsPessoaJuridica(tipo.current.value === '2');
    }

    return (
        <div className="container mt-4 mb-5">
            <br/>
            <h2 className="mb-3">{alteracao ? "Alterar Cadastro" : "Cadastrar Novo Cliente"}</h2>
            <hr />

            <input type="hidden" ref={id} />

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label><i className="fas fa-user me-2"></i>Nome Completo</label>
                    <input ref={nome} onInput={apenasLetras} className="form-control" placeholder="Ex: João da Silva" maxLength={50} />
                </div>
                <div className="col-md-6 mb-3">
                    <label><i className="fas fa-envelope me-2"></i>Email</label>
                    <input ref={email} className="form-control" placeholder="Ex: fulano@email.com" maxLength={100} />
                </div>
                <div className="col-md-6 mb-3">
                    <label><i className="fas fa-id-card me-2"></i>CPF</label>
                    <input ref={cpf} onInput={formatarCPF} maxLength={14} className="form-control" placeholder="000.000.000-00" />
                </div>
                <div className="col-md-6 mb-3">
                    <label><i className="fas fa-phone me-2"></i>Telefone</label>
                    <input ref={telefone} onInput={formatarTelefone} maxLength={15} className="form-control" placeholder="(99) 99999-9999" />
                </div>
                <div className="col-md-6 mb-3">
                {!alteracao && (
                    <>
                        <div className="form-group">
                            <label>Senha</label>
                            <input ref={senha} type="password" className="form-control" placeholder="******" />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Senha</label>
                            <input ref={confmSenha} type="password" className="form-control" placeholder="******" />
                        </div>
                    </>
                )}
                </div>
                <div className="col-md-6 mb-3">
                    <label><i className="fas fa-user-tag me-2"></i>Tipo</label>
                    <select ref={tipo} className="form-select" onChange={handleTipoChange}>
                        <option value="1">Pessoa Física</option>
                        <option value="2">Pessoa Jurídica</option>
                    </select>
                </div>

                {isPessoaJuridica && (
                    <>
                        <div className="col-12">
                            <h5 className="mt-4">Dados da Empresa</h5>
                            <hr />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label><i className="fas fa-building me-2"></i>CNPJ</label>
                            <input ref={cnpj} onInput={formatarCNPJ} maxLength={18} className="form-control" placeholder="00.000.000/0001-00" />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label><i className="fas fa-briefcase me-2"></i>Razão Social</label>
                            <input ref={razaoSocial} className="form-control" placeholder="Nome da empresa" maxLength={50} />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label><i className="fas fa-receipt me-2"></i>Inscrição Estadual</label>
                            <input ref={inscEstadual} className="form-control" placeholder="Número da IE" maxLength={20} onInput={apenasLetras} />
                        </div>
                    </>
                )}

            <div className="col-12">
                <h5 className="mt-4">Endereço</h5>
                <hr />
            </div>
            <div className="col-md-4 mb-3">
                <label><i className="fas fa-map-pin me-2"></i>CEP - Digite para busca de endereço</label>
                <input
                    ref={cep}
                    className="form-control"
                    maxLength={8}
                    placeholder="00000-000"
                    onBlur={() => consultarCep(cep, rua, bairro, cidade)}
                    onInput={apenasNumeros}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label><i className="fas fa-road me-2"></i>Rua</label>
                <input ref={rua} className="form-control" placeholder="Ex: Rua das Flores" maxLength={50} />
            </div>
            <div className="col-md-4 mb-3">
                <label><i className="fas fa-home me-2"></i>Número</label>
                <input ref={numero} className="form-control" placeholder="Ex: 123" onInput={apenasNumeros} maxLength={10}/>
            </div>
            <div className="col-md-6 mb-3">
                <label><i className="fas fa-city me-2"></i>Bairro</label>
                <input ref={bairro} className="form-control" placeholder="Ex: Centro" maxLength={50} />
            </div>
            <div className="col-md-6 mb-3">
                <label><i className="fas fa-flag me-2"></i>Cidade</label>
                <input ref={cidade} className="form-control" placeholder="Ex: São Paulo" maxLength={50} />
            </div>
             <div className="form-group">
            </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
            <Link href="/home/login" className="btn btn-secondary">Cancelar</Link>
            <button onClick={alteracao ? alterarCliente : gravarCliente} className="btn btn-primary">
                {alteracao ? "Salvar Alterações" : "Cadastrar"}
            </button>
        </div>
    </div>
);

}