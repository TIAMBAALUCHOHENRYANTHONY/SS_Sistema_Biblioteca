import React from 'react';
import { Link } from 'react-router-dom';

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
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Your Logo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav"> {/* Agregamos la clase justify-content-center */}
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/libros">Libros</Link>
                        </li>
                        {isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/prestamos">Prestamos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/permissions">Permisos</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/roles">Roles</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/users">Usuarios</Link>
                                </li>
                            </>
                        )}
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={handleLogout}>Cerrar sesión</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;