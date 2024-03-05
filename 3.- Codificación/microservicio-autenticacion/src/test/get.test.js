const controller = require('../controllers/UserController.js');
const connection = require('../models/model.js');
const CryptoJS = require('crypto-js');

// Mock para simular la función de encriptación
jest.mock('crypto-js', () => ({
    AES: {
        encrypt: jest.fn(data => data),
    }
}));

describe('getUser', () => {
    it('debería retornar un usuario correctamente', () => {
        const req = {
            params: { id: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // Simula los resultados de la consulta
        const queryResult = [{ id: 1, username: 'usuario1' }];
        connection.query = jest.fn().mockImplementation((query, params, callback) => {
            callback(null, queryResult);
        });

        controller.getUser(req, res);
    });
});