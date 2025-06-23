import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBase64 from "../../public/img/logo-base64";
import assinaturaBase64 from "../../public/img/assinatura-base64";
import rodapeBase64 from "../../public/img/rodape-base64";

export function gerarOrcamentoPDF(orcamento, id) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const formatar = Intl.NumberFormat("pt-BR", {
    style: 'currency',
    currency: 'BRL'
  });

  const logoWidth = 50;
  const logoHeight = 20;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(logoBase64, "PNG", logoX, 10, logoWidth, logoHeight);

  doc.setFontSize(16);
  doc.text(`Orçamento para: ${orcamento?.cidade}`, pageWidth / 2, 40, { align: "center" });

  const textoIntro = `Conforme solicitação a esta empresa, abaixo segue orçamento e ficamos à disposição para demais negociações:`;
  doc.setFontSize(10);
  doc.text(textoIntro, 15, 50);

  const tabelaItens = orcamento.itens.map((item, index) => [
    index + 1,
    item.descricao,
    item.marca,
    item.quantidade,
    item.sigla,
    formatar.format(item.valor_unitario),
    formatar.format(item.valor_unitario * item.quantidade),
  ]);

  autoTable(doc, {
    startY: 50 + 5,
    head: [[
      "Item", "Descrição", "Marca", "Quantidade", "Unidade", "Valor Unitário", "Total do Item"
    ]],
    body: tabelaItens,
    styles: { halign: 'center', fontSize: 10 },
  });

  const afterTableY = doc.lastAutoTable.finalY + 10;
  const totalGeral = orcamento.itens.reduce((soma, item) => soma + item.valor_unitario * item.quantidade, 0);
  const textoTotal = `Total do Orçamento: ${formatar.format(totalGeral)}`;
  const textoLargura = doc.getTextWidth(textoTotal);
  doc.setFontSize(12);
  doc.text(textoTotal, pageWidth - 15 - textoLargura, afterTableY);

  const infoY = afterTableY + 15;
  doc.setFontSize(10);
  const infoEsquerda = [
    `Prazo de validade do orçamento: ${orcamento?.prazo_validade}`,
    `Prazo de entrega: ${orcamento?.prazo_entrega}`,
    `Prazo de pagamento: À vista com carência de 30 dias`,
    `Frete: CIF - Próprio ou terceirizado`,
    `Todos os custos diretos e indiretos estão inclusos`,
    `Todos os produtos são de primeira qualidade`,
  ];
  doc.text(infoEsquerda, 15, infoY);

  const dataOrcamento = new Date(orcamento?.data);
  const meses = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
  ];
  const dia = String(dataOrcamento.getDate()).padStart(2, "0");
  const mes = meses[dataOrcamento.getMonth()];
  const ano = dataOrcamento.getFullYear();
  const dataTexto = `Presidente Prudente, ${dia} de ${mes.charAt(0).toUpperCase() + mes.slice(1)} de ${ano}`;
  const dataY = infoY + infoEsquerda.length * 6 + 5;
  doc.text(dataTexto, pageWidth - 15, dataY, { align: "right" });

  const assinaturaY = dataY + 5;
  const assinaturaLargura = 80;
  const assinaturaAltura = 40;
  const assinaturaX = pageWidth - assinaturaLargura - 15;
  doc.addImage(assinaturaBase64, "PNG", assinaturaX, assinaturaY, assinaturaLargura, assinaturaAltura);

  const rodapeLargura = 180;
  const rodapeAltura = 25;
  const rodapeX = (pageWidth - rodapeLargura) / 2;
  doc.addImage(rodapeBase64, "PNG", rodapeX, 270, rodapeLargura, rodapeAltura);

  doc.save(`orcamento_${id}.pdf`);
}