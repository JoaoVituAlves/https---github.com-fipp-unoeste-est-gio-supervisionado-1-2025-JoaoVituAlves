'use client'

import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import httpClient from "../../utils/httpClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PerfilFuncionario() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
    dataAdmissao: "",
    idCargo: "",
    salario: "",
    status: "",
    idTipo: ""
  });

  const [cargo, setCargo] = useState('');
  const [tipo, setTipo] = useState('');

  useEffect(() => {
    async function carregarDados() {
      if (!user) return;

      setForm({
        nome: user.nome || "",
        cpf: user.cpf || "",
        telefone: user.telefone || "",
        email: user.email || "",
        dataAdmissao: user.data_admissao?.substring(0, 10) || "",
        idCargo: user.id_cargo || "",
        salario: user.salario || "",
        status: user.status || "",
        idTipo: user.id_tipo || ""
      });

      try {
        const [cargos, tipos] = await Promise.all([
          httpClient.get("/cargos/listar").then(res => res.json()),
          httpClient.get("/tipos/listar").then(res => res.json())
        ]);

        const cargoEncontrado = cargos.find(c => c.id === user.id_cargo);
        const tipoEncontrado = tipos.find(t => t.id === user.id_tipo);

        setCargo(cargoEncontrado?.descricao || "Não informado");
        setTipo(tipoEncontrado?.descricao || "Não informado");
      } catch (err) {
        console.error("Erro ao carregar cargo/tipo:", err);
      }
    }
    carregarDados();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  function alterarFuncionario(e) {
    e.preventDefault();

    const obrigatorios = ["nome", "cpf", "telefone", "email"];
    const validos = obrigatorios.every(c => form[c]);

    if (!validos) return alert("Preencha todos os campos obrigatórios!");

    const dados = {
      id: user.id,
      nome: form.nome,
      cpf: form.cpf,
      telefone: form.telefone,
      email: form.email,
      data_admissao: form.dataAdmissao,
      id_cargo: form.idCargo,
      salario: form.salario,
      status: form.status,
      id_tipo: form.idTipo
    };

    httpClient.put("/funcionarios/alterar", dados)
      .then(async r => {
        const resposta = await r.json();
        if (!r.ok) return alert(resposta.msg || "Erro ao alterar funcionário");

        const atualizados = { ...user, ...dados };
        localStorage.setItem("funcionario", JSON.stringify(atualizados));
        setUser?.(atualizados);
        alert(resposta.msg || "Funcionário alterado com sucesso");
        window.location.reload();
      });
  }

  function validarNome(e) {
    e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  }

  function formatarCPF(e) {
    let cpf = e.target.value.replace(/\D/g, '').slice(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = cpf;
  }

  function formatarTelefone(e) {
    let tel = e.target.value.replace(/\D/g, '').slice(0, 11);
    tel = tel.length <= 10
      ? tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      : tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    e.target.value = tel;
  }

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">
          <i className="fas fa-user-tie me-2"></i>Perfil do Funcionário
        </h2>

        <form onSubmit={alterarFuncionario}>
          <div className="accordion" id="perfilFuncionarioAccordion">

            {/* Informações Pessoais */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#infoFuncionario">
                  <i className="fas fa-user me-2"></i>Informações Pessoais
                </button>
              </h2>
              <div id="infoFuncionario" className="accordion-collapse collapse show">
                <div className="accordion-body row">
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-user-circle me-2 text-secondary"></i>Nome</label>
                    <input type="text" name="nome" className="form-control" value={form.nome} onChange={handleChange} onInput={validarNome} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-envelope me-2 text-secondary"></i>Email</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-phone me-2 text-secondary"></i>Telefone</label>
                    <input type="text" name="telefone" className="form-control" value={form.telefone} onChange={handleChange} onInput={formatarTelefone} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-id-card me-2 text-secondary"></i>CPF</label>
                    <input type="text" name="cpf" className="form-control" value={form.cpf} onChange={handleChange} onInput={formatarCPF} />
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Funcionais */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#dadosFuncionais">
                  <i className="fas fa-briefcase me-2"></i>Dados Funcionais
                </button>
              </h2>
              <div id="dadosFuncionais" className="accordion-collapse collapse">
                <div className="accordion-body row">
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-money-bill-wave me-2 text-secondary"></i>Salário</label>
                    <input type="text" className="form-control" value={formatar.format(form.salario)} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-calendar-alt me-2 text-secondary"></i>Data de Admissão</label>
                    <input type="text" className="form-control" value={new Date(form.dataAdmissao).toLocaleDateString()} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-tools me-2 text-secondary"></i>Cargo</label>
                    <input type="text" className="form-control" value={cargo} disabled />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-users-cog me-2 text-secondary"></i>Tipo</label>
                    <input type="text" className="form-control" value={tipo} disabled />
                  </div>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seguranca">
                  <i className="fas fa-lock me-2"></i>Segurança
                </button>
              </h2>
              <div id="seguranca" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <Link href="/admin/perfil/criarNovaSenha" className="btn btn-outline-primary">
                    <i className="fas fa-edit me-2"></i>Alterar Senha
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Botões de Ação */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link href="/admin" className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>Voltar
            </Link>
            <button type="submit" className="btn btn-success">
              <i className="fas fa-save me-2"></i>Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}