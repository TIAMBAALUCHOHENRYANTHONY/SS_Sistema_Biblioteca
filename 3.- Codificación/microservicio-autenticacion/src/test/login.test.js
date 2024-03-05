// autenticacion.test.js

const auth = require('../controllers/LoginController.js');
describe('login', () => {
    it('debería autenticar un usuario correctamente', () => {
      // Simula una solicitud HTTP con datos de usuario
      const req = {
        body: { username: 'usuario_existente', password: 'contraseña_correcta' }
      };
      // Simula un objeto de respuesta HTTP
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Llama a la función login con los objetos de solicitud y respuesta simulados
      auth.login(req, res);

    });
  
    it('debería manejar un usuario no encontrado', () => {
      // Simula una solicitud HTTP con datos de usuario
      const req = {
        body: { username: 'usuario_no_existente', password: 'contraseña_incorrecta' }
      };
      // Simula un objeto de respuesta HTTP
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Llama a la función login con los objetos de solicitud y respuesta simulados
      auth.login(req, res);
  
    });
  
  });
  