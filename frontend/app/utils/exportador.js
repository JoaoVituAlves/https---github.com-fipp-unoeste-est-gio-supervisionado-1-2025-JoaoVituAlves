import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Exporta dados para Excel.
 * @param {Array} dados - Lista de objetos com os dados.
 * @param {String} nomeArquivo - Nome do arquivo para salvar.
 */
export function exportarParaExcel(dados, nomeArquivo = "dados") {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados");

    XLSX.writeFile(wb, `${nomeArquivo}.xlsx`);
}

/**
 * Exporta dados para PDF.
 * @param {Array} dados - Lista de arrays (linhas da tabela).
 * @param {Array} colunas - Cabeçalhos das colunas.
 * @param {String} nomeArquivo - Nome do arquivo para salvar.
 */
export function exportarParaPDF(dados, colunas, nomeArquivo = "dados") {
    const doc = new jsPDF();

    autoTable(doc, {
        head: [colunas],
        body: dados,
    });

    doc.save(`${nomeArquivo}.pdf`);
}