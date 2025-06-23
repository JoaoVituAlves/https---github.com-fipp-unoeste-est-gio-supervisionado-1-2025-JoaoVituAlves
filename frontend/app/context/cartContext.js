'use client';
import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [mensagemEstoque, setMensagemEstoque] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Carregar do localStorage ao iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
      setCartCount(parsedCart.length);
    }
  }, []);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(cart.length);
    
    // Atualizar o evento para o layout
    const event = new CustomEvent('cartUpdated', { detail: { count: cart.length } });
    window.dispatchEvent(event);
  }, [cart]);

  const addToCart = (produto) => {
    const exists = cart.find(item => item.id === produto.id);
    if (!exists) {
      setCart([...cart, { ...produto, quantidade: 1 }]);
    } else {
      setCart(cart.map(item => {
        if (item.id === produto.id) {
          const novaQuantidade = item.quantidade + 1;
          return {
            ...item,
            quantidade: novaQuantidade <= item.estoque ? novaQuantidade : item.estoque
          };
        }
        return item;
      }));
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseQuantity = (id) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const novaQuantidade = item.quantidade + 1;
          if (novaQuantidade > item.estoque) {
            setMensagemEstoque("Você atingiu o limite de estoque disponível.");
            setTimeout(() => setMensagemEstoque(''), 3000);
            return item;
          } else {
            return { ...item, quantidade: novaQuantidade };
          }
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.id === id
            ? { ...item, quantidade: item.quantidade > 1 ? item.quantidade - 1 : 1 }
            : item
        )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        mensagemEstoque
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;