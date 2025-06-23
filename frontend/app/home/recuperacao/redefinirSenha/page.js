'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const redefinir = async () => {
    if (!novaSenha || !confirmarSenha) {
      setMensagem('Por favor, preencha todos os campos de senha.');
      setTipoMensagem('erro');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      setTipoMensagem('erro');
      return;
    }

    try {
      const resposta = await axios.post('http://localhost:5000/funcionarios/redefinir-senha', {
        token,
        novaSenha,
        confmNovaSenha: confirmarSenha,
      });

      setMensagem(resposta.data.mensagem || 'Senha redefinida com sucesso!');
      setTipoMensagem('sucesso');

      setTimeout(() => {
        router.push('/home/login');
      }, 2000);
    } catch (err) {
      setMensagem(
        err.response?.data?.erro ||
        err.response?.data?.msg ||
        'Erro ao redefinir a senha.'
      );
      setTipoMensagem('erro');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center">
          <i className="fas fa-redo me-2 text-primary"></i>Redefinir Senha
        </h4>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-key me-2 text-secondary"></i>Nova Senha
          </label>
          <input
            type="password"
            className="form-control bg-white text-dark border-secondary"
            placeholder="********"
            value={novaSenha}
            maxLength={20}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-check-circle me-2 text-secondary"></i>Confirmar Nova Senha
          </label>
          <input
            type="password"
            className="form-control bg-white text-dark border-secondary"
            placeholder="********"
            maxLength={20}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </div>

        {mensagem && (
          <div className={`alert ${tipoMensagem === 'erro' ? 'alert-danger' : 'alert-success'}`} role="alert">
            {mensagem}
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={redefinir}>
          <i className="fas fa-sync-alt me-2"></i>Redefinir Senha
        </button>
      </div>
    </div>
  );
}