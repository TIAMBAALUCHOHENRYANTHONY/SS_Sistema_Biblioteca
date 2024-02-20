const connection = require('../models/model');
const CryptoJS = require('crypto-js');

// Función para encriptar los datos
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

exports.createPermission = (req, res) => {
    const { name, description } = req.body;

    // Consulta SQL para insertar un nuevo permiso en la base de datos
    const insertQuery = 'INSERT INTO permissions (name, description) VALUES (?, ?)';
    connection.query(insertQuery, [name, description], (err, result) => {
        if (err) {
            console.error('Error creating permission:', err);
            return res.status(500).json({ message: 'Error creating permission' });
        }
        res.status(200).json({ message: 'Permission created successfully' });
    });
};

exports.getPermission = (req, res) => {
    const permissionId = req.params.id;

    // Consulta SQL para obtener un permiso por su ID
    const selectQuery = 'SELECT * FROM permissions WHERE id = ?';
    connection.query(selectQuery, [permissionId], (err, result) => {
        if (err) {
            console.error('Error retrieving permission:', err);
            return res.status(500).json({ message: 'Error retrieving permission' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Permission not found' });
        }
        const permission = result[0];
        const key = process.env.SECRET_KEY;
        const encryptedPermission = encryptData(permission, key);

        res.status(200).json(encryptedPermission);
    });
};


exports.getAllPermissions = (req, res) => {
    // Consulta SQL para obtener todos los permisos
    const selectQuery = 'SELECT * FROM permissions';
    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error retrieving permissions:', err);
            return res.status(500).json({ message: 'Error retrieving permissions' });
        }
        const key = process.env.SECRET_KEY;
        const encryptedPermissions = results.map(permission => encryptData(permission, key));

        res.status(200).json(encryptedPermissions);
    });
};

exports.updatePermission = (req, res) => {
    const permissionId = req.params.id;
    const { name, description } = req.body;

    // Consulta SQL para actualizar un permiso por su ID
    const updateQuery = 'UPDATE permissions SET name = ?, description = ? WHERE id = ?';
    connection.query(updateQuery, [name, description, permissionId], (err, result) => {
        if (err) {
            console.error('Error updating permission:', err);
            return res.status(500).json({ message: 'Error updating permission' });
        }
        res.status(200).json({ message: 'Permission updated successfully' });
    });
};

exports.deletePermission = (req, res) => {
    const permissionId = req.params.id;

    // Consulta SQL para eliminar un permiso por su ID
    const deleteQuery = 'DELETE FROM permissions WHERE id = ?';
    connection.query(deleteQuery, [permissionId], (err, result) => {
        if (err) {
            console.error('Error deleting permission:', err);
            return res.status(500).json({ message: 'Error deleting permission' });
        }
        res.status(200).json({ message: 'Permission deleted successfully' });
    });
};