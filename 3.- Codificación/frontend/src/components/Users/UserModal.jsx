import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createRole, getAllPermissions, getAllRoles, getRoleById, getUserById, updateRoleById, updateRoleUserById } from '../../api/UserRolePermissions';

const UserModal = () => {
    const [name, setName] = useState('');
    const [rol_id, setRolId] = useState(0);
    const [roles, setRoles] = useState([]);
    const { id } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUserById(id);
                const roles = await getAllRoles();
                if (user.rol_id) {
                    setRolId(user.rol_id);
                }
                setName(user.username);
                setRoles(roles);
            } catch (error) {
                console.error('Error fetching user:', error);
                // Manejar el error si es necesario
            }
        };
        if (id) {
            fetchUser();
        }

    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userUpdate = { name, rol_id };
        editUser(id, userUpdate);
    };

    const editUser = async (id, user) => {
        try {
            const result = await updateRoleUserById(id, user);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/users', window.location.origin);
                url.searchParams.append('message', 'Actualización exitosa');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Si no se pudo actualizar, redirige con un mensaje de error
                const url = new URL('/users', window.location.origin);
                url.searchParams.append('message', 'Error en la actualización');
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
                        <div className="card-header">
                            <h5 className="card-title fw-bold">Datos del Usuario</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Nombre:</label>
                                    <input type="text" className="form-control" id="name" autoComplete="username" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label fw-bold">Rol:</label>
                                    <select className="form-select" id="role" value={rol_id} onChange={(e) => setRolId(e.target.value)}>
                                        <option value="">Selecciona un rol</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
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

export default UserModal;
