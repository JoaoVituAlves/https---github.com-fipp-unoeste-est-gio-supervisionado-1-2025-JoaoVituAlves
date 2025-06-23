'use client';
import './globals.css';
import '../public/template/css/sb-admin-2.min.css';
import '../public/template/css/fontawesome-free/css/all.min.css';
import { Nunito } from 'next/font/google';
import { UserProvider } from './context/userContext';
import Icone from './components/icone';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const nunito = Nunito({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const titulos = {
    '/home': 'Home',
    '/home/sobre': 'Sobre',
    '/home/vitrine': 'Vitrine',
    '/home/contato': 'Contato',
    '/home/login': 'Login',
    '/home/privacidade': 'Privacidade',
    '/home/carrinho': 'Carrinho',
    '/home/recuperacao/esqueciSenha': 'Funcionário',
    '/home/recuperacao/redefinirSenha': 'Funcionário',
    '/admin': 'Admin'
  };

  useEffect(() => {
    const titulo = pathname.startsWith('/admin') ? 'Admin' : (titulos[pathname] || 'Cliente');
    document.title = `${titulo} - Dumed Hospitalar`;
  }, [pathname]);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/verificar-token', {
          credentials: 'include'
        });

        if (response.ok) return;

        const data = await response.json();
        console.warn("Token inválido:", data.msg);

        if (response.status === 401) {
          const estavaLogado = localStorage.getItem('cliente') || localStorage.getItem('funcionario');

          localStorage.removeItem('cliente');
          localStorage.removeItem('funcionario');

          if (estavaLogado && !sessionStorage.getItem('recarregadoPorExpiracao')) {
            sessionStorage.setItem('recarregadoPorExpiracao', 'true');
            location.reload();
          }
        }

      } catch (error) {
        console.error("Erro ao verificar token:", error);
      }
    };

    verificarToken();
  }, [pathname]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (sessionStorage.getItem('recarregadoPorExpiracao')) {
        sessionStorage.removeItem('recarregadoPorExpiracao');
      }
    }, 1000); // espera 1 segundo antes de limpar a flag

    return () => clearTimeout(timeout);
  }, []);

  return (
    <UserProvider>
      <html lang="pt-br">
        <head>
          <Icone />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
        </head>
        <body className={nunito.className}>
          <main>{children}</main>
          <script src="/template/js/jquery.min.js"></script>
          <script src="/template/js/bootstrap.bundle.min.js"></script>
          <script src="/template/js/sb-admin-2.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" async></script>
        </body>
      </html>
    </UserProvider>
  );
}