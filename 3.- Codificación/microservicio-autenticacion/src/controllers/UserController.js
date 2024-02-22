const connection = require('../models/model');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

// Función para encriptar los datos
const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

exports.getUser = (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = results[0];
        const key = process.env.SECRET_KEY; 
        const encryptedUser = encryptData(user, key);
        res.status(200).json(encryptedUser);
    });
};

exports.getUserByName = (req, res) => {
    const userId = req.params.username;
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving user:', error);
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = results[0];
        const key = process.env.SECRET_KEY; 
        const encryptedUser = encryptData(user, key);
        res.status(200).json(encryptedUser);
    });
};

exports.getAllUsers = (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving users:', error);
            return res.status(500).json({ message: 'Error retrieving users' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        const key = process.env.SECRET_KEY; 
        const encryptedUsers = results.map(user => encryptData(user, key));
        res.status(200).json(encryptedUsers);
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { username, currentPassword, newPassword, roleId } = req.body;

    // Consulta SQL para obtener la contraseña actual y el rol actual del usuario
    const selectQuery = 'SELECT password_hash, role_id FROM users WHERE id = ?';
    connection.query(selectQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error retrieving current password and role:', err);
            return res.status(500).json({ message: 'Error retrieving current password and role' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result[0];
        const currentPasswordHash = user.password_hash;
        const currentRoleId = user.role_id;

        // Comparar la contraseña actual proporcionada con la contraseña almacenada en la base de datos
        bcrypt.compare(currentPassword, currentPasswordHash, (err, passwordMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }

            // Generar un "hash" para la nueva contraseña
            bcrypt.hash(newPassword, 10, (err, newHash) => {
                if (err) {
                    console.error('Error hashing new password:', err);
                    return res.status(500).json({ message: 'Error hashing new password' });
                }

                // Consulta SQL para actualizar la información del usuario con la nueva contraseña y el nuevo rol
                const updateQuery = 'UPDATE users SET username = ?, password_hash = ?, role_id = ? WHERE id = ?';
                connection.query(updateQuery, [username, newHash, roleId, userId], (err, result) => {
                    if (err) {
                        console.error('Error updating user:', err);
                        return res.status(500).json({ message: 'Error updating user' });
                    }
                    res.status(200).json({ message: 'User updated successfully' });
                });
            });
        });
    });
};

exports.updateUserRole = (req, res) => {
    const userId = req.params.id;
    const { name, rol_id } = req.body;

    // Consulta SQL para actualizar el nombre de usuario y el ID del rol
    const updateQuery = 'UPDATE users SET username = ?, role_id = ? WHERE id = ?';
    connection.query(updateQuery, [name, rol_id, userId], (err, result) => {
        if (err) {
            console.error('Error updating user role:', err);
            return res.status(500).json({ message: 'Error updating user role' });
        }
        res.status(200).json({ message: 'User role updated successfully' });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    connection.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
};