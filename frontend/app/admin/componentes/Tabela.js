export default function Tabela({ title, colunas, dados }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
      </div>
      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              {colunas.map((col, i) => <th key={i}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {dados.map((linha, i) => (
              <tr key={i}>
                {colunas.map((col, j) => <td key={j}>{linha[col.toLowerCase()]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}