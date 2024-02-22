const connection = require('../models/model');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const MAX_LOGIN_ATTEMPTS = 3; // Número máximo de intentos de inicio de sesión permitidos
const LOCKOUT_PERIOD = 10 * 60 * 1000; // 10 minutos en milisegundos

// Objeto para almacenar los intentos de inicio de sesión fallidos
const failedLoginAttempts = {};

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

    if (isAccountLocked(username)) {
        return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    try {
        getUserByUsername(username, (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving user' });
            }

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            bcrypt.compare(password, user.password_hash, (err, isValid) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords' });
                }

                if (!isValid) {
                    recordFailedLoginAttempt(username);
                    return res.status(401).json({ message: 'Wrong username or password' });
                }

                const token = jwt.sign({ username }, "YourSecretKey", {
                    expiresIn: '15m'
                });

                resetFailedLoginAttempts(username);

                res.status(200).json({ token });
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function isAccountLocked(username) {
    return failedLoginAttempts[username] && failedLoginAttempts[username].attempts >= MAX_LOGIN_ATTEMPTS &&
        (new Date().getTime() - failedLoginAttempts[username].lastAttempt < LOCKOUT_PERIOD);
}

function getUserByUsername(username, callback) {
    const consult = 'SELECT * FROM users WHERE username = ?';
    connection.query(consult, [username], (err, result) => {
        if (err) {
            return callback(err);
        }
        return callback(null, result.length > 0 ? result[0] : null);
    });
}

function resetFailedLoginAttempts(username) {
    if (failedLoginAttempts[username]) {
        failedLoginAttempts[username].attempts = 0;
    }
}

function recordFailedLoginAttempt(username) {
    if (failedLoginAttempts[username]) {
        failedLoginAttempts[username].attempts++;
        failedLoginAttempts[username].lastAttempt = new Date().getTime();
    } else {
        failedLoginAttempts[username] = {
            attempts: 1,
            lastAttempt: new Date().getTime()
        };
    }
}