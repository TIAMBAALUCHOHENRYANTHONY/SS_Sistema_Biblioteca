import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { deleteUserById, getAllUsers, getRoleById } from '../../api/UserRolePermissions';
import Navbar from '../Home/Navbar';

const UserTable = (props) => {
    const { permissions } = props;
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);
    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        fetchUsers();
        setMessage(urlParams.get('message'));
    }, []);

    const getRoleName = async (roleId) => {
        try {
            const rol = await getRoleById(roleId);
            return rol.name;
        } catch (error) {
            console.error('Error retrieving role name:', error);
            return 'Ningun Rol';
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            const usersData = response;
            // Iterar sobre cada usuario y buscar el nombre del rol
            const usersWithRoles = await Promise.all(usersData.map(async (user) => {
                const roleName = await getRoleName(user.role_id);
                return { ...user, roleName };
            }));
            setUsers(usersWithRoles);
        } catch (error) {
            console.error('Error retrieving users:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUserById(userId);
            setUsers(users.filter((user) => user.id !== userId));
            setMessage('Usuario eliminado correctamente');
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage('Ha ocurrido un error al intentar eliminar el usuario');
        }
    };

    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container">
                <h2>Usuarios del Sistema</h2>
                {message && (
                    <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible`} role="alert">
                        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                        {message}
                    </div>
                )}

                <table className="table">
                    <thead>
                        <tr>
                            <th className="bg-success text-white">Usuario</th>
                            <th className="bg-success text-white">Rol</th>
                            <th className="bg-success text-white">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.roleName}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2">
                                        <Link to={`/modalUser/${user.id}`} className="text-white text-decoration-none">
                                            Edit
                                        </Link>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;