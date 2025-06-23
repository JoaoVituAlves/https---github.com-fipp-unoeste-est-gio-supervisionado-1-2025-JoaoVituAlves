'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PagamentoSucesso() {
  const router = useRouter();
  const [pedidoId, setPedidoId] = useState(null);

  useEffect(() => {
    // Obter parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const external_reference = urlParams.get('external_reference');
    
    if (external_reference) {
      setPedidoId(external_reference);
    }
    
    // Redirecionar após 5 segundos
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">Pagamento Aprovado!</h3>
        </div>
        <div className="card-body text-center py-5">
          <div className="success-animation mb-4">
            <i className="fas fa-check-circle fa-5x text-success"></i>
          </div>
          <h4>Seu pagamento foi processado com sucesso!</h4>
          {pedidoId && <p className="lead mb-4">Pedido #{pedidoId}</p>}
          <p>Você receberá um e-mail com os detalhes da sua compra.</p>
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