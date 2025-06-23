'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NovaSenha() {
  const [idCliente, setIdCliente] = useState(null);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const router = useRouter();

  useEffect(() => {
    const dadosCliente = localStorage.getItem('cliente');
    if (dadosCliente) {
      const cliente = JSON.parse(dadosCliente);
      setIdCliente(cliente.id);
    } else {
      setMensagem('Cliente não encontrado no localStorage.');
      setTipoMensagem('erro');
    }
  }, []);

  const atualizarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem('Por favor, preencha todos os campos.');
      setTipoMensagem('erro');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      setTipoMensagem('erro');
      return;
    }

    try {
      const resposta = await axios.patch('http://localhost:5000/clientes/nova-senha', {
        id: idCliente,
        senhaAtual,
        novaSenha,
        confmNovaSenha: confirmarSenha
      });

      setMensagem(resposta.data.msg || 'Senha atualizada com sucesso!');
      setTipoMensagem('sucesso');

      const clienteAtual = JSON.parse(localStorage.getItem('cliente'));
      clienteAtual.senha = novaSenha;
      localStorage.setItem('cliente', JSON.stringify(clienteAtual));

      setTimeout(() => {
        router.push('/home/clientes');
      }, 2000);
    } catch (err) {
      setMensagem(err.response?.data?.msg || 'Erro ao atualizar a senha.');
      setTipoMensagem('erro');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center">
          <i className="fas fa-lock me-2 text-primary"></i>Alterar Senha
        </h4>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-key me-2 text-secondary"></i>Senha Atual
          </label>
          <input
            type="password"
            className="form-control bg-white text-dark border-secondary"
            value={senhaAtual}
            maxLength={20}
            placeholder="**********"
            onChange={e => setSenhaAtual(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-key me-2 text-secondary"></i>Nova Senha
          </label>
          <input
            type="password"
            className="form-control bg-white text-dark border-secondary"
            value={novaSenha}
            maxLength={20}
            placeholder="**********"
            onChange={e => setNovaSenha(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-check-circle me-2 text-secondary"></i>Confirmar Nova Senha
          </label>
          <input
            type="password"
            className="form-control bg-white text-dark border-secondary"
            value={confirmarSenha}
            maxLength={20}
            placeholder="**********"
            onChange={e => setConfirmarSenha(e.target.value)}
          />
        </div>

        {mensagem && (
          <div className={`alert ${tipoMensagem === 'erro' ? 'alert-danger' : 'alert-success'}`} role="alert">
            {mensagem}
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={atualizarSenha}>
          <i className="fas fa-save me-2"></i>Salvar Nova Senha
        </button>
      </div>
    </div>
  );
}