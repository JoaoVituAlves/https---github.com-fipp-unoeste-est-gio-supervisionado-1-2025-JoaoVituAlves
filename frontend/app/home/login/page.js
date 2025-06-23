'use client'
import { useState, useContext, useRef } from 'react';
import httpClient from '../../utils/httpClient';
import { useRouter } from 'next/navigation';
import UserContext, { UserProvider } from "../../context/userContext";

export default function LoginPage() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('cliente');
    const [erro, setErro] = useState('');
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const { setUser } = useContext(UserContext);

    const formatarCPF = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const handleCPFChange = (e) => {
        const valor = e.target.value;
        setCpf(formatarCPF(valor));
    };

    const realizarLogin = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);
    
        try {
            const resposta = await httpClient.post('/auth/token', {
                cpf: cpf || null,
                senha,
                tipoUsuario
            });
    
            if (resposta.ok) {
                const data = await resposta.json();
                if (tipoUsuario === 'cliente') {
                    setUser(data.cliente);
                    localStorage.setItem('cliente', JSON.stringify(data.cliente));
                    router.push('/home');
                } else {
                    setUser(data.funcionario);
                    localStorage.setItem('funcionario', JSON.stringify(data.funcionario));
                    router.push('/admin');
                }
            } else {
                const erroData = await resposta.json();
                setErro(erroData.msg || 'Erro ao autenticar');
            }
        } catch (err) {
            console.error('Erro ao logar:', err);
            setErro('Erro ao conectar com o servidor');
        } finally {
            setCarregando(false);
        }
    };
    
    if (carregando) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <h4>Estamos logando o seu usuário</h4>
            </div>
        );
    }    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Login</h3>

                            {erro && <div className="alert alert-danger">{erro}</div>}

                            <form onSubmit={realizarLogin}>
                                {/* Tipo de usuário */}
                                <div className="mb-3">
                                    <label className="form-label">Tipo de Acesso</label>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="tipoCliente"
                                            name="tipoUsuario"
                                            value="cliente"
                                            checked={tipoUsuario === 'cliente'}
                                            onChange={(e) => setTipoUsuario(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="tipoCliente">
                                            Cliente
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            id="tipoFuncionario"
                                            name="tipoUsuario"
                                            value="funcionario"
                                            checked={tipoUsuario === 'funcionario'}
                                            onChange={(e) => setTipoUsuario(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="tipoFuncionario">
                                            Funcionário
                                        </label>
                                    </div>
                                </div>

                                {/* Campo CPF para ambos cliente e funcionário */}
                                <div className="mb-3">
                                    <label className="form-label">CPF</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cpf}
                                        onChange={handleCPFChange}
                                        placeholder="000.000.000-00"
                                        maxLength="14"
                                        required
                                    />
                                </div>

                                {/* Campo senha */}
                                <div className="mb-3">
                                    <label className="form-label">Senha</label>
                                    <div className="input-group">
                                        <input
                                            type={mostrarSenha ? 'text' : 'password'}
                                            className="form-control"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            required
                                            placeholder="Digite sua senha"
                                            maxLength={30}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setMostrarSenha(!mostrarSenha)}
                                            tabIndex={-1}
                                        >
                                            <i className={mostrarSenha ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Entrar
                                </button>

                                <div className="text-center mt-3">
                                    <a
                                        href={
                                            tipoUsuario === 'cliente'
                                                ? '/home/recuperacaoCliente/esqueciSenha'
                                                : '/home/recuperacao/esqueciSenha'
                                        }
                                        className="text-decoration-none"
                                    >
                                        Esqueceu a Senha?
                                    </a>
                                </div>

                                {/* Mostrar link para cadastro se for cliente */}
                                {tipoUsuario === 'cliente' && (
                                    <div className="text-center mt-2">
                                        <a href="/home/clientes/cadastro" className="text-decoration-none">
                                            Não tem conta? Cadastre-se
                                        </a>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}