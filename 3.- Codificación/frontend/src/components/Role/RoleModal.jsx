import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createRole, getAllPermissions, getRoleById, updateRoleById } from '../../api/UserRolePermissions';

const RoleModal = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [permissions, setPermissions] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const { id } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchRol = async () => {
            try {
                const rol = await getRoleById(id);
                // Actualizar el estado con los datos obtenidos
                setName(rol.name);
                setDescription(rol.description);
                setPermissions(rol.permissions);
            } catch (error) {
                console.error('Error fetching rol:', error);
                // Manejar el error si es necesario
            }
        };

        const fetchPermissions = async () => {
            try {
                const allpermissions = await getAllPermissions();
                setAllPermissions(allpermissions);
            } catch (error) {
                console.error('Error fetching permissions:', error);
            }
        }

        fetchPermissions();

        if (id) {
            fetchRol();
            fetchPermissions();
        }

    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newRol = { name, description, permissions: selectedPermissions };
        if (id) {
            editRol(id, newRol);
        } else {
            saveRol(newRol);
        }
    };

    const handlePermissionCheckbox = (e) => {
        const permissionId = e.target.value;
        const isChecked = e.target.checked;

        setSelectedPermissions(prevSelectedPermissions => {
            if (isChecked) {
                // Si el checkbox está marcado, agregamos el ID del permiso al estado selectedPermissions
                return [...prevSelectedPermissions, permissionId];
            } else {
                // Si el checkbox está desmarcado, filtramos el ID del permiso del estado selectedPermissions
                return prevSelectedPermissions.filter(id => id !== permissionId);
            }
        });
    };

    const editRol = async (id, newPermission) => {
        try {
            const result = await updateRoleById(id, newPermission);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/roles', window.location.origin);
                url.searchParams.append('message', 'Actualización exitosa');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Si no se pudo actualizar, redirige con un mensaje de error
                const url = new URL('/roles', window.location.origin);
                url.searchParams.append('message', 'Error en la actualización');
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };

    const saveRol = async (permissionData) => {
        try {
            const result = await createRole(permissionData);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/roles', window.location.origin);
                url.searchParams.append('message', 'Permiso Creado Correctamente');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/roles', window.location.origin);
                url.searchParams.append('message', 'Error al crear el permiso');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };


    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">Datos del Rol</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre:</label>
                        <input type="text" className="form-control" id="name" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Descripción:</label>
                        <textarea className="form-control" id="description" autoComplete="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        {allPermissions.map(permission => {
                            return (
                                <div className="form-check" key={permission.id}>
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`permission_${permission.id}`}
                                        value={permission.id}
                                        onChange={(e) => handlePermissionCheckbox(e)}
                                    />
                                    <label className="form-check-label" htmlFor={`permission_${permission.id}`}>
                                        {permission.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
            </div>
            {message && (
                <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default RoleModal;
