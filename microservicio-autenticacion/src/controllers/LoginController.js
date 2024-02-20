const connection = require('../models/model');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

module.exports.register = (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10; // Número de rondas de "salting"

    // Generar un "salt" aleatorio
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            return res.status(500).json({ message: 'Error generating salt' });
        }

        // "Hashear" la contraseña del usuario con el "salt"
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Consulta SQL para insertar el usuario con el "hash" en la base de datos
            const insertQuery = 'INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)';
            connection.query(insertQuery, [username, hash, salt], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ message: 'Error inserting user' });
                }

                // Envía una respuesta al cliente indicando que el registro fue exitoso
                res.status(200).json({ message: 'Registration successful' });
            });
        });
    });
};

module.exports.login = (req, res) => {
    const { username, password } = req.body;
    const consult = 'SELECT * FROM users WHERE username = ?';

    try {
        connection.query(consult, [username], (err, result) => {
            if (err) {
                res.status(500).json({ message: 'Error retrieving user' });
            } else {
                if (result.length > 0) {
                    const user = result[0];
                    const storedSalt = user.salt;
                    bcrypt.hash(password, storedSalt, (err, hashedPassword) => {
                        if (err) {
                            res.status(500).json({ message: 'Error hashing password' });
                        } else {
                            if (hashedPassword === user.password_hash) {
                                const token = jwt.sign({ username }, "Stack", {
                                    expiresIn: '15m'
                                });
                                res.status(200).json({ token });
                            } else {
                                res.status(401).json({ message: 'Wrong username or password' });
                            }
                        }
                    });
                } else {
                    res.status(401).json({ message: 'User not found' });
                }
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Internal server error' });
    }
}