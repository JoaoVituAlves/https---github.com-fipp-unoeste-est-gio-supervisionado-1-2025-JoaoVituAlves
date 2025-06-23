'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PagamentoPendente() {
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
        <div className="card-header bg-warning text-dark">
          <h3 className="mb-0">Pagamento Pendente</h3>
        </div>
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <i className="fas fa-clock fa-5x text-warning"></i>
          </div>
          <h4>Seu pagamento está sendo processado</h4>
          <p className="lead mb-4">Seu pedido foi registrado e o pagamento está em análise.</p>
          <p>Você receberá uma notificação assim que o pagamento for confirmado.</p>
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