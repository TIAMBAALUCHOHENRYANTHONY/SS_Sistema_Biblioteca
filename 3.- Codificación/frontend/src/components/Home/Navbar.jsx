import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './logo_principal.png';

const Navbar = (props) => {

    const { permissions } = props;


    const permissionIsIncluded = (permission) => {
        return permissions.includes(permission);
    };


    const isAdmin = permissionIsIncluded('administrador');



    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-success" >
            <div className="container-fluid">
                <Link className="navbar-brand" to="/home">
                    <img src={Logo} alt="Logo" style={{ maxHeight: '40px', marginRight: '10px' }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link fw-bold" to="/libros" style={{ color: 'white' }}>Libros</Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold" to="/prestamos" style={{ color: 'white' }}>Prestamos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold" to="/permissions" style={{ color: 'white' }}>Permisos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold" to="/roles" style={{ color: 'white' }}>Roles</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link fw-bold" to="/users" style={{ color: 'white' }}>Usuarios</Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <button className="nav-link btn btn-link fw-bold" onClick={handleLogout} style={{ color: 'white' }}>Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

export default Navbar;