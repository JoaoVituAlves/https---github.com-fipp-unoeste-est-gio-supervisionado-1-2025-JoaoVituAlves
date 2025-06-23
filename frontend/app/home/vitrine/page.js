'use client';

import { useEffect, useState } from 'react';
import httpClient from '../../utils/httpClient';
import Produto from '../../components/produto'; 
import '../../../public/template/css/styleprodutohome.css';

export default function Vitrine() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    marca: '',
    precoMin: '',
    precoMax: '',
  });

  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    // Produtos
    httpClient.get('/produtos/listar')
      .then(r => r.json())
      .then(data => {
        const ativos = data.filter(p => p.status_web === 1 && p.ativo === 1);
        setProdutos(ativos);
        const marcasUnicas = [...new Set(ativos.map(p => p.marca).filter(Boolean))];
        setMarcas(marcasUnicas);
      })
      .catch(console.error);

    // Categorias
    httpClient.get('/categorias/listar')
      .then(r => r.json())
      .then(data => setCategorias(data))
      .catch(console.error);
  }, []);

  const filtrarProdutos = () => {
    return produtos.filter(p => {
      const nomeMatch = p.nome.toLowerCase().includes(filtros.nome.toLowerCase());
      const categoriaMatch = filtros.categoria ? p.categoria?.id === Number(filtros.categoria) : true;
      const marcaMatch = filtros.marca ? p.marca === filtros.marca : true;
      const precoMinMatch = filtros.precoMin ? p.preco >= parseFloat(filtros.precoMin) : true;
      const precoMaxMatch = filtros.precoMax ? p.preco <= parseFloat(filtros.precoMax) : true;

      return nomeMatch && categoriaMatch && marcaMatch && precoMinMatch && precoMaxMatch;
    });
  };

  const produtosFiltrados = filtrarProdutos();

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Todos os Produtos</h1>

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome"
            value={filtros.nome}
            onChange={e => setFiltros({ ...filtros, nome: e.target.value })}
          />
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-select"
            value={filtros.categoria}
            onChange={e => setFiltros({ ...filtros, categoria: e.target.value })}
          >
            <option value="">Todas Categorias</option>
            {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.descricao}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <select
            className="form-select"
            value={filtros.marca}
            onChange={e => setFiltros({ ...filtros, marca: e.target.value })}
          >
            <option value="">Todas Marcas</option>
            {marcas.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Preço Mínimo"
            value={filtros.precoMin}
            onChange={e => setFiltros({ ...filtros, precoMin: e.target.value })}
          />
        </div>

        <div className="col-md-2 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="Preço Máximo"
            value={filtros.precoMax}
            onChange={e => setFiltros({ ...filtros, precoMax: e.target.value })}
          />
        </div>
      </div>

      {/* Produtos */}
      <div className="row">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map(p => (
            <Produto
              key={p.id}
              imagem={p.imagens}
              titulo={p.nome}
              descricao={p.descricao}
              marca={p.marca}
              preco={p.preco}
              id={p.id}
              estoque={p.quantidade}
            />
          ))
        ) : (
          <p className="text-center text-muted">Nenhum produto encontrado com esses filtros.</p>
        )}
      </div>
    </div>
  );
}