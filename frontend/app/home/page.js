'use client';

import { useEffect, useState, useContext } from 'react';
import httpClient from '../utils/httpClient';
import CartContext from '../context/cartContext';
import "../../public/template/css/styleprodutohome.css";
import UserContext from '../context/userContext';

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    httpClient.get('/produtos/listar')
      .then(r => r.json())
      .then(data => {
        const produtosVisiveis = data.filter(p => p.status_web === 1 && p.ativo === 1);
        setProdutos(produtosVisiveis);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* BANNER PRINCIPAL */}
      <section className="bg-light py-5 mb-4">
        <div className="container text-center">
          <img src="/img/logo_dumed.png" alt="Logo Dumed" style={{ height: 80 }} className="mb-3" />
          <h1 className="display-5 fw-bold">Bem-vindo à Dumed Hospitalar</h1>
          <p className="lead">Excelência em produtos médicos e hospitalares</p>
          <a href="#produtos" className="btn btn-primary btn-lg mt-3">
            <i className="fas fa-shopping-basket me-2"></i>Ver Produtos
          </a>
        </div>
      </section>

      {/* CATEGORIAS POPULARES */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h2 className="mb-4">Categorias Populares</h2>
          <div className="row">
            {[{ nome: 'Materiais Hospitalares', icone: 'fas fa-stethoscope' },
              { nome: 'EPI', icone: 'fas fa-hard-hat' },
              { nome: 'Medicamentos', icone: 'fas fa-pills' }].map(cat => (
              <div key={cat.nome} className="col-md-4 mb-3">
                <a href={cat.link} className="text-decoration-none text-dark">
                  <div className="card h-100 shadow-sm border-0 p-4">
                    <i className={`${cat.icone} fa-3x mb-3 text-primary`}></i>
                    <h5>{cat.nome}</h5>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <p id='produtos'></p>
      <hr/>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="container my-5">
        <h2 className="mb-4 text-center">Destaques da Semana</h2>
        <div className="row">
          {produtos.length > 0 ? (
            produtos.slice(0, 16).map(produto => (
              <Produto
                key={produto.id}
                imagem={produto.imagens}
                titulo={produto.nome}
                descricao={produto.descricao}
                marca={produto.marca}
                preco={produto.preco}
                id={produto.id}
                estoque={produto.quantidade}
              />
            ))
          ) : (
            <p className="text-center text-muted">Nenhum produto disponível.</p>
          )}
        </div>
      </section>

      <hr/>

      {/* BENEFÍCIOS */}
      <section className="bg-light py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <i className="fas fa-truck fa-2x text-primary mb-2"></i>
            <h5>Entrega Rápida</h5>
            <p>Enviamos para todo o Brasil com agilidade.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-shield-alt fa-2x text-primary mb-2"></i>
            <h5>Produtos Certificados</h5>
            <p>Qualidade garantida com certificações ANVISA.</p>
          </div>
          <div className="col-md-4 mb-4">
            <i className="fas fa-headset fa-2x text-primary mb-2"></i>
            <h5>Atendimento Especializado</h5>
            <p>Equipe treinada pronta para te ajudar.</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h3 className="mb-3">Está pronto para comprar com segurança?</h3>
          <p className="lead">Explore nossos produtos médicos e hospitalares agora mesmo.</p>
          <a href="/home/vitrine" className="btn btn-light btn-lg">
            <i className="fas fa-arrow-right me-2"></i> Ver Catálogo Completo
          </a>
        </div>
      </section>

      {/* DUMED EM NÚMEROS */}
      <section className="bg-white py-5 border-top">
        <div className="container text-center">
          <h2 className="mb-5">Dumed em Números</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <i className="fas fa-warehouse fa-2x text-primary mb-2"></i>
              <h4 className="fw-bold">+500</h4>
              <p>Produtos cadastrados</p>
            </div>
            <div className="col-md-3 mb-4">
              <i className="fas fa-truck-moving fa-2x text-primary mb-2"></i>
              <h4 className="fw-bold">+30</h4>
              <p>Cidades atendidas</p>
            </div>
            <div className="col-md-3 mb-4">
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h4 className="fw-bold">+500</h4>
              <p>Clientes ativos</p>
            </div>
            <div className="col-md-3 mb-4">
              <i className="fas fa-hand-holding-heart fa-2x text-primary mb-2"></i>
              <h4 className="fw-bold">+10</h4>
              <p>Anos de experiência</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// COMPONENTE DE PRODUTO
function Produto({ imagem, titulo, descricao, marca, preco, id, estoque }) {
  const { addToCart } = useContext(CartContext);
  const [indiceImagem, setIndiceImagem] = useState(0);
  const [adicionado, setAdicionado] = useState(false);
  const { user } = useContext(UserContext);

  const handleAdicionar = () => {
    if(!user) {
      alert("Você precisa estar logado para adicionar ao carrinho!");
      return;
    }
    
    addToCart({ id, imagem: imagemBase64, titulo, preco, estoque });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

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

  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="position-relative" style={{ height: 200, backgroundColor: '#fff' }}>
          <img
            src={imagemBase64}
            className="card-img-top"
            alt={titulo}
            style={{ height: '100%', objectFit: 'contain' }}
          />
          {imagens.length > 1 && (
            <>
              <button className="btn btn-sm btn-light position-absolute top-50 start-0 translate-middle-y" onClick={imagemAnterior} style={{ zIndex: 2 }}>
                ‹
              </button>
              <button className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y" onClick={proximaImagem} style={{ zIndex: 2 }}>
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
          <p className="card-text" title={descricao}>{descricao}</p>
          <p className="card-text" title={marca}><strong>Marca:</strong> {marca}</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="fw-bold text-primary">{formatar.format(preco)}</span>
            <button className={`btn btn-sm ${adicionado ? 'btn-success' : 'btn-outline-primary'}`} onClick={handleAdicionar} disabled={adicionado}>
              {adicionado ? (
                <><i className="fas fa-check-circle me-1"></i> Adicionado</>
              ) : (
                <><i className="fas fa-cart-plus me-1"></i> Adicionar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}