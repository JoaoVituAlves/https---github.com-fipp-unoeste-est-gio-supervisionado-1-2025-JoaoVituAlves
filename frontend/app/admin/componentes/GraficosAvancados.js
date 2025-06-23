import { useState } from 'react';
import GraficoBarra from './GraficoBarra';
import Tabela from './Tabela';

export default function GraficosAvancados({ clientesPF, clientesPJ, produtos, listaFuncionarios, pedidos = [] }) {
  const [abaSelecionada, setAbaSelecionada] = useState('estoque');
  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  // 1. Valor em Estoque
  const valorEstoque = produtos.map(p => p.preco * p.quantidade);
  const nomesProdutos = produtos.map(p => p.nome);

  // 2. Faturamento do mês
  const mesAtual = new Date().getMonth();
  const anoAtual = new Date().getFullYear();
  const faturamentoMensal = pedidos
    .filter(p => {
      const data = new Date(p.data);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    })
    .reduce((acc, p) => acc + p.valor_total, 0);

  // 3. Produtos mais vendidos
  const vendasPorProdutoId = {};
  pedidos.forEach(pedido => {
  if (Array.isArray(pedido.itens)) {
    pedido.itens.forEach(item => {
      if (!item.id_produto || !item.quantidade) return;

      vendasPorProdutoId[item.id_produto] =
        (vendasPorProdutoId[item.id_produto] || 0) + item.quantidade;
    });
  }

  });
  const produtosMaisVendidos = Object.entries(vendasPorProdutoId)
    .map(([id, quantidade]) => {
      const produto = produtos.find(p => p.id === parseInt(id));
      return {
        nome: produto?.nome ?? `Produto ID ${id}`,
        quantidade
      };
    })
    .filter(p => p.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

  // 4. Produtos prestes a vencer
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() + 30);
  const produtosVencendo = produtos.filter(p => {
    const validade = new Date(p.data_validade);
    return validade > hoje && validade <= limite;
  });

  // 5. Produtos com estoque baixo
  const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10);

  return (
    <div>
      <div className="btn-group mb-3">
        <button className={`btn btn-sm ${abaSelecionada === 'estoque' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setAbaSelecionada('estoque')}>Estoque</button>
        <button className={`btn btn-sm ${abaSelecionada === 'vendas' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setAbaSelecionada('vendas')}>Vendas</button>
        <button className={`btn btn-sm ${abaSelecionada === 'alertas' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setAbaSelecionada('alertas')}>Alertas</button>
      </div>

      {abaSelecionada === 'estoque' && (
        <>
          <GraficoBarra
            title="Valor em Estoque por Produto"
            labels={nomesProdutos}
            data={valorEstoque}
          />
        </>
      )}

      {abaSelecionada === 'vendas' && (
        <>
          <GraficoBarra
            title="Produtos Mais Vendidos (Top 10)"
            labels={produtosMaisVendidos.map(p => p.nome)}
            data={produtosMaisVendidos.map(p => p.quantidade)}
          />
        </>
      )}

      {abaSelecionada === 'alertas' && (
        <>
          <Tabela
            title="Produtos Prestes a Vencer (30 dias)"
            colunas={['Nome', 'Data_Validade', 'Quantidade']}
            dados={produtosVencendo.map(p => ({
              nome: p.nome,
              data_validade: new Date(p.data_validade).toLocaleDateString('pt-BR'),
              quantidade: p.quantidade
            }))}  
          />

          <Tabela
            title="Produtos com Estoque Baixo (< 10)"
            colunas={['Nome', 'Quantidade', 'Preco']}
            dados={produtosBaixoEstoque.map(p => ({
              nome: p.nome,
              quantidade: p.quantidade,
              preco: formatar.format(p.preco)
            }))}
          />
        </>
      )}
    </div>
  );
}