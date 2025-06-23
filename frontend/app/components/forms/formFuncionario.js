'use client'
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation"
import httpClient from "../../../app/utils/httpClient";

export default function FormFuncionario({ funcionario }) {
    const nome = useRef();
    const cpf = useRef();
    const telefone = useRef();
    const email = useRef();
    const dataAdmissao = useRef();
    const idCargo = useRef();
    const salario = useRef();
    const status = useRef();
    const idTipo = useRef();
    const senha = useRef();
    const confmSenha = useRef();

    const router = useRouter();

    const [alteracao, setAlteracao] = useState(false);
    const [cargos, setCargos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [selectedCargo, setSelectedCargo] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cargosResponse, tiposResponse] = await Promise.all([
                    httpClient.get("/cargos/listar").then(r => r.json()),
                    httpClient.get("/tipos/listar").then(r => r.json())
                ]);

                setCargos(cargosResponse);
                setTipos(tiposResponse);

                if (funcionario) {
                    nome.current.value = funcionario.nome;
                    cpf.current.value = funcionario.cpf;
                    telefone.current.value = funcionario.telefone;
                    email.current.value = funcionario.email;
                    dataAdmissao.current.value = funcionario.data_admissao?.substring(0, 10);
                    salario.current.value = funcionario.salario;
                    status.current.value = funcionario.status;
                    setSelectedCargo(funcionario.id_cargo.toString());
                    setSelectedTipo(funcionario.id_tipo.toString());
                    setAlteracao(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [funcionario]);

    function gravarFuncionario() {
        if (
            nome.current.value && cpf.current.value && telefone.current.value &&
            email.current.value && dataAdmissao.current.value && idCargo.current.value &&
            salario.current.value && status.current.value && idTipo.current.value &&
            senha.current?.value && confmSenha.current?.value
        ) {
            const dados = {
                nome: nome.current.value,
                cpf: cpf.current.value,
                telefone: telefone.current.value,
                email: email.current.value,
                data_admissao: dataAdmissao.current.value,
                id_cargo: idCargo.current.value,
                salario: salario.current.value,
                status: status.current.value,
                id_tipo: idTipo.current.value,
                senha: senha.current?.value,
                confmSenha: confmSenha.current?.value
            };
    
            httpClient.post("/funcionarios/gravar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao gravar funcionário");
                    return; 
                }

                alert(resposta.msg || "Funcionário gravado com sucesso");
                router.push("/admin/funcionarios"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao gravar funcionário");
            });
        } else {
            alert("Preencha todos os campos!");
        }
    }
    
    function alterarFuncionario() {
        if (
            nome.current.value && cpf.current.value && telefone.current.value &&
            email.current.value && dataAdmissao.current.value && idCargo.current.value &&
            salario.current.value && status.current.value && idTipo.current.value
        ) {
            const dados = {
                id: funcionario.id,
                nome: nome.current.value,
                cpf: cpf.current.value,
                telefone: telefone.current.value,
                email: email.current.value,
                data_admissao: dataAdmissao.current.value,
                id_cargo: idCargo.current.value,
                salario: salario.current.value,
                status: status.current.value,
                id_tipo: idTipo.current.value
            };
    
            httpClient.put("/funcionarios/alterar", dados)
            .then(async r => {
                const resposta = await r.json();

                if (!r.ok) {
                    alert(resposta.msg || "Erro ao alterar funcionário");
                    return; 
                }

                alert(resposta.msg || "Funcionário alterado com sucesso");
                router.push("/admin/funcionarios"); 
            })
            .catch(err => {
                console.error(err);
                alert("Erro inesperado ao alterar funcionário");
            });
        } else {
            alert("Preencha todos os campos!");
        }
    }
    
    // Validação e formatação dos inputs
    function validarNome(e) {
        e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    }

    function formatarCPF(e) {
        let cpf = e.target.value.replace(/\D/g, '');
        if (cpf.length > 11) cpf = cpf.slice(0, 11);
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
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

    return (
        <div>
            <h1>{alteracao ? "Alteração de Funcionário" : "Cadastro de Funcionário"}</h1>
            <hr />
            <div className="form-group">
                <label>Nome</label>
                <input ref={nome} className="form-control" onInput={validarNome} />
            </div>
            <div className="form-group">
                <label>CPF</label>
                <input ref={cpf} className="form-control" maxLength={14} onInput={formatarCPF} />
            </div>
            <div className="form-group">
                <label>Telefone</label>
                <input ref={telefone} className="form-control" maxLength={15} onInput={formatarTelefone} />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input ref={email} className="form-control" />
            </div>
            <div className="form-group">
                <label>Data de Admissão</label>
                <input ref={dataAdmissao} max={"2025-12-30"} type="date" className="form-control" />
            </div>
            <div className="form-group">
                <label>Cargo</label>
                <select 
                    ref={idCargo} 
                    className="form-control"
                    value={selectedCargo}
                    onChange={(e) => setSelectedCargo(e.target.value)}
                >
                    <option value="">Selecione um cargo</option>
                    {cargos.map(c => (
                        <option key={c.id} value={c.id}>{c.descricao}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Salário</label>
                <input ref={salario} type="number" step="0.01" className="form-control" />
            </div>
            <div className="form-group">
                <label>Status</label>
                <select ref={status} className="form-control">
                    <option value="1">Ativo</option>
                    <option value="0">Inativo</option>
                </select>
            </div>
            <div className="form-group">
                <label>Tipo</label>
                <select 
                    ref={idTipo} 
                    className="form-control"
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                >
                    <option value="">Selecione um tipo</option>
                    {tipos.map(t => (
                        <option key={t.id} value={t.id}>{t.descricao}</option>
                    ))}
                </select>
            </div>
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
            <div>
                <button
                    onClick={alteracao ? alterarFuncionario : gravarFuncionario}
                    className="btn btn-primary"
                >
                    {alteracao ? "Alterar" : "Cadastrar"}
                </button>
                <Link href="/admin/funcionarios" className="btn btn-default">Voltar</Link>
            </div>
        </div>
    );
}