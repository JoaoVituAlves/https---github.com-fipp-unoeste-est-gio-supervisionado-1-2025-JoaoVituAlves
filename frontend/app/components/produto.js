'use client';

import { useState, useContext } from 'react';
import CartContext from '../context/cartContext';

export default function Produto({ imagem, titulo, descricao, marca, preco, id, estoque }) {
  const { addToCart } = useContext(CartContext);
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [adicionado, setAdicionado] = useState(false);

  const imagens = Array.isArray(imagem) ? imagem : [imagem];
  const imagemAtual = imagens[indiceImagem];

  const imagemBase64 = imagemAtual && imagemAtual.blob && imagemAtual.tipo
    ? `data:image/${imagemAtual.tipo};base64,${imagemAtual.blob}`
    : "/img/produto-semimagem.jpg";

  const proximaImagem = () => {
    setIndiceImagem((prev) => (prev + 1) % imagens.length);
  };

  const imagemAnterior = () => {
    setIndiceImagem((prev) => (prev - 1 + imagens.length) % imagens.length);
  };

  const handleAdicionar = () => {
    addToCart({ id, imagem: imagemBase64, titulo, preco, estoque });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <div className="col-md-4 mb-4">
      <div className="card card-custom h-100 shadow-sm border-0">
        <div className="position-relative" style={{ height: 200, backgroundColor: '#fff' }}>
          <img
            src={imagemBase64}
            className="card-img-top"
            alt={titulo}
            style={{ height: '100%', objectFit: 'contain' }}
          />

          {imagens.length > 1 && (
            <>
              <button
                className="btn btn-sm btn-light position-absolute top-50 start-0 translate-middle-y"
                onClick={imagemAnterior}
                style={{ zIndex: 2 }}
              >
                ‹
              </button>
              <button
                className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y"
                onClick={proximaImagem}
                style={{ zIndex: 2 }}
              >
                ›
              </button>
              <div className="image-indicators">
                {imagens.map((_, index) => (
                  <span key={index} className={index === indiceImagem ? 'active' : ''}></span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{titulo}</h5>
          <p className="card-text" title={descricao}>
            {descricao}
          </p>
          <p className="card-text" title={marca}>
            Marca: {marca}
          </p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="fw-bold text-primary">{formatar.format(preco)}</span>
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm btn-custom ${adicionado ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={handleAdicionar}
                disabled={adicionado}
              >
                {adicionado ? (
                  <>
                    <i className="fas fa-check-circle me-1"></i> Adicionado
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus me-1"></i> Adicionar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}