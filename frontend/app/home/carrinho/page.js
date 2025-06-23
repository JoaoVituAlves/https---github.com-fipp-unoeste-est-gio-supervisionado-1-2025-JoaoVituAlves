'use client';
import { useContext } from 'react';
import CartContext from '../../context/cartContext';
import Link from 'next/link';

export default function Carrinho() {
  const {
    cart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    mensagemEstoque
  } = useContext(CartContext);

  const total = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <div className="container my-5">
      <h2 className="mb-4">Carrinho de Compras</h2>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio. <Link href="/home/vitrine">Clique aqui</Link> para adicionar produtos.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
          {mensagemEstoque && (
            <div className="alert alert-warning text-center" role="alert">
              {mensagemEstoque}
            </div>
          )}
          {cart.map(item => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center flex-grow-1">
                <img
                  src={item.imagem || "/img/produto-semimagem.jpg"}
                  alt={item.titulo}
                  style={{ width: 60, height: 60, objectFit: 'contain', marginRight: 15 }}
                />
                <div>
                  <strong>{item.titulo}</strong><br />
                  <div className="d-flex align-items-center mt-2">
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      className="btn btn-sm btn-outline-success ms-2"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <span className="d-block mb-2">
                  {formatar.format(item.preco * item.quantidade)}
                </span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
          </ul>
          <div className='text-end'>
            <h5>Total: {formatar.format(total)}</h5>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Link href="/home/vitrine">
              <button className="btn btn-secondary">Continuar Comprando</button>
            </Link>
            <div className="d-flex gap-2">
              <button className="btn btn-info" onClick={clearCart}>Esvaziar Carrinho</button>
              <Link href="/home/pedido" className="btn btn-success">Prosseguir com Pedido</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
