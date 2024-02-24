import React, { useState, useEffect } from 'react';
import { getAllPermissions, updatePermissionById, createPermission, deletePermissionById, getPermissionById } from '../../api/UserRolePermissions';
import { Link } from 'react-router-dom';
import Navbar from '../Home/Navbar';

const PermissionTable = (props) => {
    const { permissions } = props;
    const [permissionsd, setPermissions] = useState([]);
    const [message, setMessage] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        fetchPermissions();
        setMessage(urlParams.get('message'));
    }, []);

    const fetchPermissions = async () => {
        try {
            const permissionsData = await getAllPermissions();
            setPermissions(permissionsData);
        } catch (error) {
            console.error('Error fetching permissions:', error);
        }
    };

    const handleDeletePermission = async (permissionId) => {
        try {
            await deletePermissionById(permissionId);
            setPermissions(permissionsd.filter((permission) => permission.id !== permissionId));
            setMessage('Permiso eliminado correctamente');
        } catch (error) {
            console.error('Error deleting permission:', error);
            setMessage('Ha ocurrido un error al intentar eliminar el permiso');
        }
    };

    const handleAddPermission = () => {
        window.location.href = "/modalPermission";
    };

    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container">
                <h2>Permisos del Sistema</h2>
                <button className="btn btn-primary mb-3" onClick={handleAddPermission} >Añadir Permiso</button>
                {message && (
                    <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                        {message}
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-success text-white">Nombre</th>
                            <th className="bg-success text-white">Descripción</th>
                            <th className="bg-success text-white"> Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {permissionsd.map((permission) => (
                            <tr key={permission.id}>
                                <td>{permission.name}</td>
                                <td>{permission.description}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2">
                                        <Link to={`/modalPermission/${permission.id}`} className="text-white text-decoration-none">
                                            Edit
                                        </Link>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeletePermission(permission.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
};

export default PermissionTable;