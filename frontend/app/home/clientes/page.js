'use client';

import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/userContext";
import httpClient from "../../utils/httpClient";
import Link from "next/link";

export default function PerfilCliente() {
  const { user, setUser } = useContext(UserContext);

  const [form, setForm] = useState({
    nome: "", cpf: "", cnpj: "", razao_social: "", insc_estadual: "",
    telefone: "", email: "", rua: "", numero: "", bairro: "", cidade: "",
    cep: "", tipo: 1,
  });

  const [enderecoBloqueado, setEnderecoBloqueado] = useState(true);

  useEffect(() => {
    if (!user) return;
    setForm({ ...form, ...user });
    if (user.cep) setEnderecoBloqueado(false);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "cep" && value.replace(/\D/g, '').length === 8) {
      buscarEndereco(value);
    }

    if (name === "tipo") {
      setForm(prev => ({
        ...prev,
        tipo: Number(value),
        ...(Number(value) === 1 ? { cnpj: "", razao_social: "", insc_estadual: "" } : {})
      }));
    }
  };

  function buscarEndereco(cep) {
    fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) return alert("CEP não encontrado!");
        setForm(prev => ({
          ...prev,
          rua: data.logradouro, bairro: data.bairro, cidade: data.localidade
        }));
        setEnderecoBloqueado(false);
      }).catch(() => alert("Erro ao buscar o CEP!"));
  }

  function alterarCliente(e) {
    e.preventDefault();

    const obrigatorios = ["nome", "cpf", "telefone", "email", "rua", "numero", "bairro", "cidade", "cep"];
    const validos = obrigatorios.every(c => form[c]);

    if (!validos) return alert("Preencha todos os campos obrigatórios!");

    if (form.tipo !== 1) {
      const juridicos = ["cnpj", "razao_social", "insc_estadual"];
      if (!juridicos.every(c => form[c])) return alert("Preencha os dados de pessoa jurídica!");
    }

    const dados = {
      id: user.id,
      nome: form.nome,
      cpf: form.cpf,
      cnpj: form.tipo !== 1 ? form.cnpj : null,
      razao_social: form.tipo !== 1 ? form.razao_social : null,
      insc_estadual: form.tipo !== 1 ? form.insc_estadual : null,
      telefone: form.telefone,
      email: form.email,
      rua: form.rua,
      numero: form.numero,
      bairro: form.bairro,
      cidade: form.cidade,
      cep: form.cep,
      tipo: Number(form.tipo)
    };

    httpClient.put("/clientes/alterar", dados)
      .then(async r => {
        const resposta = await r.json();
        if (!r.ok) return alert(resposta.msg || "Erro ao alterar cliente");

        const atualizados = { ...user, ...dados };
        localStorage.setItem("cliente", JSON.stringify(atualizados));
        setUser?.(atualizados);
        alert(resposta.msg || "Cliente alterado com sucesso");
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

  function tipoCliente() {
    if(form.tipo==1) 
      return "Pessoa Física"
    else
      return "Pessoa Jurídica"
  }

  if (!user) return <p>Carregando...</p>;

  return (
    <div className="container mt-5">
    <br/>
      <div className="card shadow p-4">
        <h2 className="mb-4 d-flex align-items-center">
          <i className="fas fa-user-circle me-2"></i>Perfil do Cliente -
          <span className="ms-2 badge bg-light text-dark border" style={{ fontSize: '0.8rem' }}>
            {tipoCliente()}
          </span>
        </h2>
        <form onSubmit={alterarCliente}>
          <div className="accordion" id="perfilAccordion">

            {/* Informações Pessoais */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#infoPessoais">
                  <i className="fas fa-user me-2"></i> Informações Pessoais
                </button>
              </h2>
              <div id="infoPessoais" className="accordion-collapse collapse show">
                <div className="accordion-body row">
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-id-badge me-2"></i>Nome</label>
                    <input type="text" name="nome" className="form-control" value={form.nome} onChange={handleChange} onInput={validarNome} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-envelope me-2"></i>Email</label>
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-phone me-2"></i>Telefone</label>
                    <input type="text" name="telefone" className="form-control" value={form.telefone} onChange={handleChange} onInput={formatarTelefone} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-id-card me-2"></i>CPF</label>
                    <input type="text" name="cpf" className="form-control" value={form.cpf} onChange={handleChange} onInput={formatarCPF} />
                  </div>

                  {form.tipo !== 1 && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label><i className="fas fa-building me-2"></i>CNPJ</label>
                        <input type="text" name="cnpj" className="form-control" value={form.cnpj} onChange={handleChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label><i className="fas fa-briefcase me-2"></i>Razão Social</label>
                        <input type="text" name="razao_social" className="form-control" value={form.razao_social} onChange={handleChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label><i className="fas fa-receipt me-2"></i>Inscrição Estadual</label>
                        <input type="text" name="insc_estadual" className="form-control" value={form.insc_estadual} onChange={handleChange} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#endereco">
                  <i className="fas fa-map-marker-alt me-2"></i> Endereço
                </button>
              </h2>
              <div id="endereco" className="accordion-collapse collapse">
                <div className="accordion-body row">
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-map-pin me-2"></i>CEP</label>
                    <input type="text" name="cep" className="form-control" value={form.cep} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-road me-2"></i>Rua</label>
                    <input type="text" name="rua" className="form-control" value={form.rua} onChange={handleChange} disabled={enderecoBloqueado} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-home me-2"></i>Número</label>
                    <input type="text" name="numero" className="form-control" value={form.numero} onChange={handleChange} disabled={enderecoBloqueado} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-city me-2"></i>Bairro</label>
                    <input type="text" name="bairro" className="form-control" value={form.bairro} onChange={handleChange} disabled={enderecoBloqueado} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><i className="fas fa-flag me-2"></i>Cidade</label>
                    <input type="text" name="cidade" className="form-control" value={form.cidade} onChange={handleChange} disabled={enderecoBloqueado} />
                  </div>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#seguranca">
                  <i className="fas fa-lock me-2"></i> Segurança
                </button>
              </h2>
              <div id="seguranca" className="accordion-collapse collapse">
                <div className="accordion-body">
                  <Link href="/home/clientes/criarNovaSenha" className="btn btn-outline-primary">
                    <i className="fas fa-edit me-1"></i> Alterar Senha
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Link href="/home" className="btn btn-outline-secondary">
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