import React, { useState, useEffect } from 'react';
import { createPermission, getPermissionById, updatePermissionById } from '../../api/UserRolePermissions';
import { useParams } from 'react-router-dom';

const PermissionModal = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { id } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const permission = await getPermissionById(id);
                // Actualizar el estado con los datos obtenidos
                setName(permission.name);
                setDescription(permission.description);
            } catch (error) {
                console.error('Error fetching permission:', error);
                // Manejar el error si es necesario
            }
        };

        if (id) {
            fetchPermission();
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newPermission = { name, description };
        if (id) {
            editPermission(id, newPermission);
        } else {
            savePermission(newPermission);
        }
    };

    const editPermission = async (id, newPermission) => {
        try {
            const result = await updatePermissionById(id, newPermission);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/permissions', window.location.origin);
                url.searchParams.append('message', 'Actualización exitosa');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Si no se pudo actualizar, redirige con un mensaje de error
                const url = new URL('/permissions', window.location.origin);
                url.searchParams.append('message', 'Error en la actualización');
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };

    const savePermission = async (permissionData) => {
        try {
            const result = await createPermission(permissionData);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/permissions', window.location.origin);
                url.searchParams.append('message', 'Permiso Creado Correctamente');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/permissions', window.location.origin);
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ margin: '10vh auto', padding: '20px', borderRadius: '10px', border: '10px solid rgba(0, 128, 0, 0.3)' }}>
                        <div className="card-header" >
                            <h5 className="card-title">Datos del Permiso</h5>
                        </div>
                        <div className="card-body" >
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Nombre:</label>
                                    <input type="text" className="form-control" id="name" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label fw-bold">Descripción:</label>
                                    <textarea className="form-control" id="description" autoComplete="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-success fw-bold">Guardar</button>
                            </form>
                        </div>
                        {message && (
                            <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default PermissionModal;
