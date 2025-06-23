'use client'

import { useContext, useState } from "react";
import UserContext from "../context/userContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Topbar() {
    const { user } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    // Função de logout, que redireciona o usuário para a rota de logout
    const handleLogout = () => {
        // Aqui você pode também chamar a API para realizar o logout, se necessário.
        router.push("/home/login/logout");
    };

    return (
        <>
            {/* Navbar principal */}
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                    <i className="fa fa-bars"></i>
                </button>

                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown no-arrow">
                        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                                {user ? user.nome : 'Carregando...'}
                            </span>
                            <img className="img-profile rounded-circle" src="/img/user.jpg" style={{ width: '30px' }} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                            aria-labelledby="userDropdown">
                            <Link className="dropdown-item" href="/admin/perfil">
                                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                Ver Perfil
                            </Link>
                            <Link className="dropdown-item" href="/admin/perfil/criarNovaSenha">
                                <i className="fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i>
                                Alterar Senha
                            </Link>
                            <button className="dropdown-item" onClick={() => setShowModal(true)}>
                                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                Logout
                            </button>
                        </div>
                    </li>
                </ul>
            </nav>

            {/* Modal de confirmação */}
            {showModal && (
                <>
                    <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block', zIndex: 1050 }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Deseja sair?</h5>
                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Selecione "Sair" abaixo se você deseja encerrar a sessão.</p>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button className="btn btn-primary" onClick={handleLogout}>Sair</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Backdrop correto */}
                    <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
                </>
            )}
        </>
    );
}
