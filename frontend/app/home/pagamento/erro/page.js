'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PagamentoErro() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar após 5 segundos
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">
          <h3 className="mb-0">Pagamento Não Aprovado</h3>
        </div>
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <i className="fas fa-times-circle fa-5x text-danger"></i>
          </div>
          <h4>Houve um problema com seu pagamento</h4>
          <p className="lead mb-4">Seu pedido foi registrado, mas o pagamento não foi aprovado.</p>
          <p>Você pode tentar novamente mais tarde ou escolher outra forma de pagamento.</p>
          <p className="mt-4">Você será redirecionado para a página inicial em alguns segundos...</p>
        </div>
        <div className="card-footer text-center">
          <Link href="/home" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>Voltar à Página Inicial
          </Link>
        </div>
      </div>
    </div>
  );
}