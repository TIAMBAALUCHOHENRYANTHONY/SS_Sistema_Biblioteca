import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createRole, getAllPermissions, getAllRoles, getRoleById, getUserById, getUserByName, updateRoleById, updateRoleUserById, updateUserById } from '../../api/UserRolePermissions';

const UserPasswordModal = (props) => {
    const { user } = props;
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setName(user.username);
                const user_ = await getUserByName(user.username);
                setUserId(user_.id);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userUpdate = { username: name, currentPassword, newPassword };
        editUser(userId, userUpdate);
    };

    const editUser = async (id, user) => {
        try {
            const result = await updateUserById(id, user);
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
                                    <label htmlFor="currentPassword" className="form-label fw-bold">Contraseña Actual:</label>
                                    <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label fw-bold">Contraseña Nueva:</label>
                                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
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

export default UserPasswordModal;
