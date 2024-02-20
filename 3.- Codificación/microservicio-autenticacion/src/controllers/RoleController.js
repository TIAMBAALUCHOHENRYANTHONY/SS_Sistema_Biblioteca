const connection = require('../models/model');
const { promisify } = require('util');
const query = promisify(connection.query).bind(connection);

const CryptoJS = require('crypto-js');

// Función para encriptar los datos
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

exports.createRole = async (req, res) => {
    const { name, description, permissions } = req.body;

    try {
        // Insertar el nuevo rol en la base de datos
        const insertRoleQuery = 'INSERT INTO roles (name, description) VALUES (?, ?)';
        const [roleResult] = await connection.query(insertRoleQuery, [name, description]);
        const roleId = roleResult.insertId;

        // Insertar los permisos asociados al nuevo rol en la base de datos
        const insertPermissionsQuery = 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
        for (const permissionId of permissions) {
            await connection.query(insertPermissionsQuery, [roleId, permissionId]);
        }

        res.status(200).json({ message: 'Role created successfully' });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ message: 'Error creating role' });
    }
};

exports.getRoleById = async (req, res) => {
    const roleId = req.params.id;

    try {
        // Consultar el rol por su ID
        const selectRoleQuery = 'SELECT * FROM roles WHERE id = ?';
        const roleResult = await query(selectRoleQuery, [roleId]);

        if (roleResult.length === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        // Consultar los permisos asociados al rol
        const selectPermissionsQuery = 'SELECT permission_id FROM role_permissions WHERE role_id = ?';
        const permissionsResult = await query(selectPermissionsQuery, [roleId]);
        const permissions = permissionsResult.map(row => row.permission_id);

        const role = {
            id: roleResult[0].id,
            name: roleResult[0].name,
            description: roleResult[0].description,
            permissions: permissions
        };

        const key = process.env.SECRET_KEY; // Obtener la clave secreta desde las variables de entorno
        const encryptedRole = encryptData(role, key);
        res.status(200).json(encryptedRole);
    } catch (error) {
        console.error('Error getting role by ID:', error);
        res.status(500).json({ message: 'Error getting role by ID' });
    }
};


exports.getAllRoles = (req, res) => {
    try {
        const selectQuery = 'SELECT * FROM roles';
        connection.query(selectQuery, (err, results) => {
            if (err) {
                console.error('Error retrieving roles:', err);
                return res.status(500).json({ message: 'Error retrieving roles' });
            }

            const key = process.env.SECRET_KEY; // Obtener la clave secreta desde las variables de entorno
            const encryptedRoles = results.map(role => encryptData(role, key));
            res.status(200).json(encryptedRoles);
        });
    } catch (error) {
        console.error('Error getting all roles:', error);
        res.status(500).json({ message: 'Error getting all roles' });
    }
};

exports.updateRole = async (req, res) => {
    const roleId = req.params.id;
    const { name, description, permissions } = req.body;

    try {

        if (!Array.isArray(permissions)) {
            return res.status(400).json({ message: 'Permissions should be an array' });
        }
        // Actualizar los datos del rol en la tabla roles
        const updateRoleQuery = 'UPDATE roles SET name = ?, description = ? WHERE id = ?';
        await connection.query(updateRoleQuery, [name, description, roleId]);

        // Eliminar todos los permisos asociados al rol
        const deletePermissionsQuery = 'DELETE FROM role_permissions WHERE role_id = ?';
        await connection.query(deletePermissionsQuery, [roleId]);

        // Insertar los nuevos permisos asociados al rol
        const insertPermissionsQuery = 'INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)';
        for (const permissionId of permissions) {
            await connection.query(insertPermissionsQuery, [roleId, permissionId]);
        }

        res.status(200).json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ message: 'Error updating role' });
    }
};

exports.deleteRole = async (req, res) => {
    const roleId = req.params.id;

    try {
        // Eliminar el rol de la tabla roles
        const deleteRoleQuery = 'DELETE FROM roles WHERE id = ?';
        await connection.query(deleteRoleQuery, [roleId]);

        // Eliminar todos los permisos asociados al rol
        const deletePermissionsQuery = 'DELETE FROM role_permissions WHERE role_id = ?';
        await connection.query(deletePermissionsQuery, [roleId]);

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);
        res.status(500).json({ message: 'Error deleting role' });
    }
};