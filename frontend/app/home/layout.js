'use client';

import '../globals.css';
import { Nunito } from 'next/font/google';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../context/userContext';
import { usePathname } from 'next/navigation';
import { CartProvider } from '../context/cartContext';
import CartContext from '../context/cartContext';

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const { user } = useContext(UserContext);
  const pathname = usePathname();
  const anoAtual = new Date().getFullYear();
  const [cartCount, setCartCount] = useState(0);

  const isActive = (href) => pathname === href;

  useEffect(() => {
    // Inicializar contador do carrinho
    const carrinho = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(carrinho.length);
    
    // Escutar por atualizações no carrinho
    const handleCartUpdate = (event) => {
      setCartCount(event.detail.count);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  return (
    <CartProvider>
      <div className={`${nunito.className} d-flex flex-column min-vh-100`}>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg shadow-sm fixed-top w-100 px-4" style={{ backgroundColor: '#003366' }}>
          <div className="container-fluid d-flex justify-content-between align-items-center">
            {/* Logo */}
            <a className="navbar-brand d-flex align-items-center text-white" href="/home">
              <img src="/img/icone_dumed.png" alt="Logo Dumed" style={{ height: 32, marginRight: 8 }} />
              <strong>UMED HOSPITALAR</strong>
            </a>

            {/* Botão hamburguer */}
            <button className="navbar-toggler text-white border border-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <i className="fas fa-bars"></i>
            </button>

            {/* Itens colapsáveis */}
            <div className="collapse navbar-collapse justify-content-center" id="navbarNavDropdown">
              <ul className="navbar-nav gap-4">
                <li className="nav-item">
                  <a className={`nav-link text-white ${isActive('/home') ? 'fw-bold border-bottom border-light' : ''}`} href="/home">Home</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link text-white ${isActive('/home/vitrine') ? 'fw-bold border-bottom border-light' : ''}`} href="/home/vitrine">Vitrine</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link text-white ${isActive('/home/sobre') ? 'fw-bold border-bottom border-light' : ''}`} href="/home/sobre">Sobre</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link text-white ${isActive('/home/contato') ? 'fw-bold border-bottom border-light' : ''}`} href="/home/contato">Contato</a>
                </li>
                
              </ul>
            </div>

            {/* Login / usuário */}
            <div className="d-flex align-items-center gap-3" style={{ minWidth: 200, justifyContent: 'flex-end' }}>
              {!user ? (
                <>
                  {/* Espaço fantasma para manter alinhamento */}
                  <div style={{ width: 150 }}></div>
                  <a className="btn btn-outline-light btn-sm" href="/home/login">
                    <i className="fas fa-user"></i> Login
                  </a>
                </>
              ) : (
                <>
                  <div className="dropdown">
                    <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      Olá, {user.nome}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                      <li><a className="dropdown-item" href="/home/clientes"><i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>Meu Perfil</a></li>
                      <li><a className="dropdown-item" href="/home/meus-pedidos"><i className="fas fa-receipt fa-sm fa-fw mr-2 text-gray-400"></i>Meus Pedidos</a></li>
                      <li><a className="dropdown-item" href="/home/clientes/criarNovaSenha"><i className="fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i>Alterar Senha</a></li>
                      <li><button className="dropdown-item text-danger" data-bs-toggle="modal" data-bs-target="#logoutModal">Sair</button></li>
                    </ul>
                  </div>
                  <a className="nav-link position-relative text-white" href="/home/carrinho">
                    <i className="fas fa-shopping-cart fa-lg"></i>
                    {cartCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                        <span className="visually-hidden">itens no carrinho</span>
                      </span>
                    )}
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>

        <br/>
        {/* Conteúdo principal */}
        <main className="flex-grow-1 pt-5 pt-md-4">{children}</main>
        <br/>

        {/* Footer */}
        <footer className="text-light pt-4 pb-2" style={{ backgroundColor: '#003366' }}>
          <div className="container">
            <div className="row">
            
              {/* Coluna 1: Sobre */}
              <div className="col-md-5 mb-3">
                <h5>Dumed Hospitalar</h5>
                <p>Produtos médicos e hospitalares com qualidade garantida desde 2013.</p>
                <p className="mb-0"><strong>Razão Social:</strong> Dumed Hospitalar LTDA</p>
                <p className="mb-0"><strong>CNPJ:</strong> 19.266.516/0001-00</p>
                <p><strong>IE:</strong> 562.330.861.119</p>
              </div>

              {/* Coluna 2: Links rápidos */}
              <div className="col-md-3 mb-3">
                <h5>Links Rápidos</h5>
                <ul className="list-unstyled">
                  <li><a className="text-light" href="/home">Home</a></li>
                  <li><a className="text-light" href="/home/sobre">Sobre</a></li>
                  <li><a className="text-light" href="/home/contato">Contato</a></li>
                  <li><a className="text-light" href="/home/privacidade">Política de Privacidade</a></li>
                </ul>
              </div>

              {/* Coluna 3: Contato */}
              <div className="col-md-4 mb-3">
                <h5>Contato</h5>
                <ul className="list-unstyled">
                  <li><i className="fas fa-phone-alt me-2"></i> (18) 3222-0827</li>
                  <li><i className="fas fa-envelope me-2"></i> dumed@dumedhospitalar.com.br</li>
                  <li><i className="fas fa-map-marker-alt me-2"></i> Rua Emílio Trevisan, 400, Jardim Bela Daria - Pres. Prudente/SP</li>
                </ul>
              </div>
            </div>

            {/* Linha inferior */}
            <div className="text-center mt-3">
              <small>&copy; {anoAtual} Dumed Hospitalar. Todos os direitos reservados.</small>
            </div>
          </div>
        </footer>

        {/* Modal de logout */}
        <div className="modal fade" id="logoutModal" tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="logoutModalLabel">Confirmação</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Fechar">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Tem certeza que deseja sair da sua conta?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <a href="/home/login/logout" className="btn btn-danger">Sair</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CartProvider>
  );
}