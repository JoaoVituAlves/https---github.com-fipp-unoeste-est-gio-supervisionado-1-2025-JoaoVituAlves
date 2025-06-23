'use client'

import { useEffect, useState } from 'react';
import httpClient from '../utils/httpClient';
import KpiCard from './componentes/KpiCard';
import Tabela from './componentes/Tabela';
import GraficosAvancados from './componentes/GraficosAvancados';

export default function AdminHome() {
  const [listaFuncionarios, setListaFuncionarios] = useState([]);
  const [listaFornecedores, setListaFornecedores] = useState([]);
  const [listaClientes, setListaClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [topClientesPedidos, setTopClientesPedidos] = useState([]);
  const [ultimoAcesso, setUltimoAcesso] = useState(new Date());
  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  useEffect(() => {
    const intervalo = setInterval(() => {
      setUltimoAcesso(new Date());
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    httpClient.get('/funcionarios/listar').then(r => r.json()).then(setListaFuncionarios);
    httpClient.get('/fornecedores/listar').then(r => r.json()).then(setListaFornecedores);
    httpClient.get('/clientes/listar').then(r => r.json()).then(setListaClientes);
    httpClient.get('/produtos/listar').then(r => r.json()).then(setProdutos);
    httpClient.get('/clientes/top-pedidos').then(r => r.json()).then(setTopClientesPedidos);
    httpClient.get('/pedidos/listar').then(r => r.json()).then(setPedidos);
  }, []);

  const formatarDataHora = data => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
  };

  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const clientesPF = listaClientes.filter(c => c.tipo === 1).length;
  const clientesPJ = listaClientes.filter(c => c.tipo === 2).length;
  const clientesPP = listaClientes.filter(c => c.cidade === 'Presidente Prudente');
  const produtosVencidos = produtos.filter(p => new Date(p.data_validade) < new Date())
  .map(p => ({...p, data_validade: new Date(p.data_validade).toLocaleDateString('pt-BR'), ativo: p.ativo === 1 ? 'Sim' : 'Não',}));;

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>

      <div className="row">
        <KpiCard title="Clientes PF" value={clientesPF} icon="user" color="primary" />
        <KpiCard title="Clientes PJ" value={clientesPJ} icon="building" color="success" />
        <KpiCard title="Valor Estoque" value={formatar.format(valorTotalEstoque)} icon="box" color="info" />
        <KpiCard title="Último Acesso" value={formatarDataHora(ultimoAcesso)} icon="clock" color="warning" />
      </div>

      <GraficosAvancados
        clientesPF={clientesPF}
        clientesPJ={clientesPJ}
        produtos={produtos}
        listaFuncionarios={listaFuncionarios}
        pedidos={pedidos}
      />

      <Tabela title="Top Clientes com Mais Pedidos" colunas={['Nome', 'Total_Pedidos']} dados={topClientesPedidos} />
      <Tabela title="Clientes de Presidente Prudente" colunas={['Nome', 'Cidade']} dados={clientesPP} />
      <Tabela title="Produtos Vencidos" colunas={['Nome', 'Data_Validade', 'Ativo', 'Quantidade']} dados={produtosVencidos} />
    </div>
  );
}