// autenticacion.test.js
const auth = require('../controllers/LoginController.js');

describe('register', () => {
  it('debería registrar un usuario correctamente', () => {
    // Simula una solicitud HTTP con datos de usuario
    const req = {
      body: { username: 'nuevo_usuario', password: 'password' }
    };
    // Simula un objeto de respuesta HTTP
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Llama a la función register con los objetos de solicitud y respuesta simulados
    auth.register(req, res);
  });
});
