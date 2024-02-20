import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteRoleById, getAllRoles } from '../../api/UserRolePermissions';
import Navbar from '../Home/Navbar';

const RoleTable = (props) => {
    const { permissions } = props;
    const [roles, setRoles] = useState([]);
    const [message, setMessage] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        fetchRoles();
        setMessage(urlParams.get('message'));
    }, []);

    const fetchRoles = async () => {
        try {
            const rolesData = await getAllRoles();
            setRoles(rolesData);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleDeleteRol = async (rolId) => {
        try {
            await deleteRoleById(rolId);
            setRoles(roles.filter((rol) => rol.id !== rolId));
            setMessage('Rol eliminado correctamente');
        } catch (error) {
            console.error('Error deleting rol:', error);
            setMessage('Ha ocurrido un error al intentar eliminar el rol');
        }
    };

    const handleAddRol = () => {
        window.location.href = "/modalRole";
    };

    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container">
                <h2>Roles del Sistema</h2>
                <button className="btn btn-primary mb-3" onClick={handleAddRol} >Añadir Rol</button>
                {message && (
                    <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                        {message}
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((rol) => (
                            <tr key={rol.id}>
                                <td>{rol.name}</td>
                                <td>{rol.description}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2">
                                        <Link to={`/modalRole/${rol.id}`} className="text-white text-decoration-none">
                                            Edit
                                        </Link>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRol(rol.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleTable;