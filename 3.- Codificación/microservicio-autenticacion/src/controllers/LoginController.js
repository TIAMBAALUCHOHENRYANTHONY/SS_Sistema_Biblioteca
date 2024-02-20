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

    if (failedLoginAttempts[username] && failedLoginAttempts[username].attempts >= MAX_LOGIN_ATTEMPTS) {
        const lastAttemptTime = failedLoginAttempts[username].lastAttempt;
        const currentTime = new Date().getTime();

        // Verificar si la cuenta está bloqueada temporalmente
        if (currentTime - lastAttemptTime < LOCKOUT_PERIOD) {
            return res.status(403).json({ message: 'Account locked. Try again later.' });
        } else {
            // Reiniciar el contador de intentos de inicio de sesión fallidos si el bloqueo ha expirado
            failedLoginAttempts[username].attempts = 0;
        }
    }

    const consult = 'SELECT * FROM users WHERE username = ?';

    try {
        connection.query(consult, [username], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving user' });
            }

            if (result.length === 0) {
                return res.status(401).json({ message: 'User not found' });
            }

            const user = result[0];
            const storedHash = user.password_hash;

            bcrypt.compare(password, storedHash, (err, isValid) => {
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

                // Restablecer los intentos de inicio de sesión fallidos después de un inicio de sesión exitoso
                if (failedLoginAttempts[username]) {
                    failedLoginAttempts[username].attempts = 0;
                }

                res.status(200).json({ token });
            });
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Internal server error' });
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