export default function NaoAutorizado() {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-4">
        <h1 className="text-danger mb-3">Acesso Negado</h1>
        <p className="text-secondary mb-4">Você não tem permissão para acessar esta página.</p>
        <a href="/home" className="btn btn-primary">
          Voltar para a página inicial
        </a>
      </div>
    );
}  