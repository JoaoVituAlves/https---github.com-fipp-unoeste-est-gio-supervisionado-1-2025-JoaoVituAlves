'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '../../../components/loading';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const router = useRouter();

  const solicitar = async () => {
    if (!email) {
      setErro('Por favor, preencha o campo de e-mail.');
      setMensagem('');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await axios.post('http://localhost:5000/clientes/recuperar-senha', {
        email,
      });

      setMensagem(resposta.data.mensagem || 'Verifique seu e-mail para redefinir a senha.');
      setErro('');

      setTimeout(() => {
        router.push('/home/login');
      }, 2000);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao enviar o link de recuperação.');
      setMensagem('');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h4 className="mb-4 text-center">
          <i className="fas fa-envelope-open-text me-2 text-primary"></i>Recuperar Senha
        </h4>

        <div className="form-group mb-3">
          <label>
            <i className="fas fa-envelope me-2 text-secondary"></i>E-mail
          </label>
          <input
            type="email"
            className="form-control bg-white text-dark border-secondary"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {erro && (
          <div className="alert alert-danger" role="alert">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="alert alert-success" role="alert">
            {mensagem}
          </div>
        )}

        <button className="btn btn-primary w-100" onClick={solicitar}>
          <i className="fas fa-paper-plane me-2"></i>Enviar link de recuperação
        </button>
      </div>
    </div>
  );
}