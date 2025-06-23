import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../../public/img/logo-base64";
import assinaturaBase64 from "../../public/img/assinatura-base64";
import rodapeBase64 from "../../public/img/rodape-base64";

export function gerarPedidoPDF(pedido, id) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  // Logo centralizado no topo
  const logoWidth = 50;
  const logoHeight = 20;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(logoBase64, "PNG", logoX, 10, logoWidth, logoHeight);

  // Título
  doc.setFontSize(16);
  doc.text(`Pedido Nº: ${id}`, pageWidth / 2, 40, { align: "center" });

  // Dados do cliente e pedido
  doc.setFontSize(10);
  const startY = 50;
  doc.text(`Cliente: ${pedido.cliente_nome || pedido.cliente?.nome || ""}`, 15, startY);
  const dataFormatada = new Date(pedido.data_pedido).toLocaleDateString('pt-BR');
  doc.text(`Data do Pedido: ${dataFormatada}`, 15, startY + 7);
  doc.text(`Status: ${statusTexto(pedido.status)}`, 15, startY + 14);
  doc.text(`Método de Pagamento: ${metodoPagamentoTexto(pedido.metodo_pagamento)}`, 15, startY + 21);
  doc.text(`Funcionário: ${pedido.funcionario_nome || pedido.funcionario?.nome || "Pedido feito pelo cliente"}`, 15, startY + 28);

  // Endereço (somente se for entrega)
  if (pedido.opcao === 1) {
    doc.text(`Endereço para Entrega:`, 15, startY + 35);
    const endereco = `${pedido.rua || ""}, ${pedido.numero || ""} - ${pedido.bairro || ""}, ${pedido.cidade || ""} - CEP: ${pedido.cep || ""}`;
    doc.text(endereco, 15, startY + 42);
  }

  // Itens da tabela
  const tabelaItens = (pedido.itens || []).map((item, index) => [
    index + 1,
    item.nome || item.descricao || "",
    item.quantidade,
    item.valor_unitario ? formatar.format(item.valor_unitario) : formatar.format(0),
    item.valor_unitario && item.quantidade ? formatar.format(item.valor_unitario * item.quantidade) : formatar.format(0)
  ]);

  autoTable(doc, {
    startY: (pedido.opcao === 1 ? startY + 50 : startY + 30),
    head: [["Item", "Produto", "Quantidade", "Preço Unit.", "Total Item"]],
    body: tabelaItens,
    styles: { halign: 'center', fontSize: 10 },
  });

  // Total do pedido
  const afterTableY = doc.lastAutoTable.finalY + 10;
  const totalItens = (pedido.itens || []).reduce((soma, item) => soma + (item.valor_unitario || 0) * (item.quantidade || 0), 0);
  const taxaEntrega = parseFloat(pedido.taxa_entrega) || 0;
  const desconto = parseFloat(pedido.valor_desconto) || 0;
  const totalFinal = totalItens + taxaEntrega - desconto;

  doc.setFontSize(12);
  doc.text(`Subtotal: ${formatar.format(totalItens)}`, pageWidth - 15, afterTableY, { align: "right" });
  doc.text(`Taxa de Entrega: ${formatar.format(taxaEntrega)}`, pageWidth - 15, afterTableY + 7, { align: "right" });
  doc.text(`Desconto: ${formatar.format(desconto)}`, pageWidth - 15, afterTableY + 14, { align: "right" });
  doc.text(`Total do Pedido: ${formatar.format(totalFinal)}`, pageWidth - 15, afterTableY + 22, { align: "right" });

  // Dados para posicionar
  const margemInferior = 15;
  const rodapeLargura = 180;
  const rodapeAltura = 25;
  const assinaturaLargura = 80;
  const assinaturaAltura = 40;

  const pageHeight = doc.internal.pageSize.getHeight();

  const rodapeX = (pageWidth - rodapeLargura) / 2;
  const assinaturaX = pageWidth - assinaturaLargura - 15;

  // Posiciona o rodapé fixo embaixo
  const rodapeY = pageHeight - margemInferior - rodapeAltura;
  doc.addImage(rodapeBase64, "PNG", rodapeX, rodapeY, rodapeLargura, rodapeAltura);

  // Posiciona a assinatura acima do rodapé, com espaçamento de 5mm
  const espacoEntre = 5;
  const assinaturaY = rodapeY - assinaturaAltura - espacoEntre;
  doc.addImage(assinaturaBase64, "PNG", assinaturaX, assinaturaY, assinaturaLargura, assinaturaAltura);

  // Data um pouco acima da assinatura para não encostar
  const dataPedido = new Date(pedido.data_pedido);
  const meses = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const dia = String(dataPedido.getDate()).padStart(2, "0");
  const mes = meses[dataPedido.getMonth()];
  const ano = dataPedido.getFullYear();
  const dataTexto = `Presidente Prudente, ${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)} de ${ano}`;

  doc.setFontSize(10);
  doc.text(dataTexto, pageWidth - 15, assinaturaY - 5, { align: "right" });

  // Salvar PDF
  doc.save(`pedido_${id}.pdf`);
}

function statusTexto(status) {
  switch (status) {
    case 1: return "Pendente";
    case 2: return "Aprovado";
    case 3: return "Em preparo";
    case 4: return "Em entrega";
    case 5: return "Cancelado";
    case 6: return "Finalizado";
    default: return "Desconhecido";
  }
}

function metodoPagamentoTexto(metodo) {
  switch (metodo) {
    case 1: return "Pix";
    case 2: return "Cartão";
    case 0: return "Indefinido";
    default: return "Desconhecido";
  }
}