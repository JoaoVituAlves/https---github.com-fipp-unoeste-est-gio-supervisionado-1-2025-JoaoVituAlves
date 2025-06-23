import Link from "next/link";
import Image from 'next/image';

export default function Sidebar() {
    return (
        <ul className="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar" style={{ backgroundColor: '#003366' }}>

            <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/admin">
                <div className="sidebar-brand-icon">
                    <Image 
                        src="/img/icone_dumed.png" 
                        alt="Ícone Dumed" 
                        width={25}
                        height={25} 
                    />
                </div>
                <div className="sidebar-brand-text mx-3">Admin Dumed</div>
            </Link>

            <hr className="sidebar-divider my-0" />

            <li className="nav-item">
                <Link className="nav-link" href="/admin">
                    <i className="fas fa-fw fa-home"></i>
                    <span>Início</span>
                </Link>
            </li>

            <hr className="sidebar-divider" />

            <div className="sidebar-heading">Gerenciamento</div>


          <li className="nav-item">
                <Link className="nav-link" href="/admin/clientes">
                    <i className="fas fa-fw fa-user"></i>
                    <span>Clientes</span>
                </Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" href="/admin/fornecedores">
                    <i className="fas fa-fw fa-truck"></i>
                    <span>Fornecedores</span>
                </Link>
            </li>

            {/* Dropdown Funcionários */}
            <li className="nav-item">
                <a
                    className="nav-link collapsed d-flex justify-content-between align-items-center"
                    href="#"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFuncionarios"
                    aria-expanded="false"
                    aria-controls="collapseFuncionarios"
                >
                    <div>
                        <i className="fas fa-fw fa-briefcase"></i>
                        <span> Funcionários</span>
                    </div>
                    <i className="fas fa-angle-down"></i>
                </a>
                <div id="collapseFuncionarios" className="collapse" data-bs-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" href="/admin/funcionarios">Lista</Link>
                        <Link className="collapse-item" href="/admin/cargos">Cargos</Link>
                        <Link className="collapse-item" href="/admin/tipos">Tipos</Link>
                    </div>
                </div>
            </li>

          

            {/* Dropdown Orçamentos */}
            <li className="nav-item">
                <a
                    className="nav-link collapsed d-flex justify-content-between align-items-center"
                    href="#"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOrcamentos"
                    aria-expanded="false"
                    aria-controls="collapseOrcamentos"
                >
                    <div>
                        <i className="fas fa-fw fa-file-invoice-dollar"></i>
                        <span> Orçamentos</span>
                    </div>
                    <i className="fas fa-angle-down"></i>
                </a>
                <div id="collapseOrcamentos" className="collapse" data-bs-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" href="/admin/orcamentos">Lista</Link>
                        <Link className="collapse-item" href="/admin/unidades">Unidades</Link>
                    </div>
                </div>
            </li>

            <li className="nav-item">
                <Link className="nav-link" href="/admin/pedidos">
                    <i className="fas fa-fw fa-clipboard"></i>
                    <span>Pedidos</span>
                </Link>
            </li>

            {/* Dropdown Produtos */}
            <li className="nav-item">
                <a
                    className="nav-link collapsed d-flex justify-content-between align-items-center"
                    href="#"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseProdutos"
                    aria-expanded="false"
                    aria-controls="collapseProdutos"
                >
                    <div>
                        <i className="fas fa-fw fa-shopping-bag"></i>
                        <span> Produtos</span>
                    </div>
                    <i className="fas fa-angle-down"></i>
                </a>
                <div id="collapseProdutos" className="collapse" data-bs-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <Link className="collapse-item" href="/admin/produtos">Lista</Link>
                        <Link className="collapse-item" href="/admin/categorias">Categorias</Link>
                    </div>
                </div>
            </li>

            <hr className="sidebar-divider" />

            <li className="nav-item">
                <Link className="nav-link" href="/home">
                    <i className="fas fa-arrow-left"></i>
                    <span> Voltar para home </span>
                </Link>
            </li>
        </ul>
    );
}
