const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/LoginController');
const userController = require('../controllers/UserController');
const roleController = require('../controllers/RoleController');
const permissionController = require('../controllers/PermissionController');


router.post('/login', login);
router.post('/register', register);

//Rutas para usuarios
router.get('/users/:id', userController.getUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.get('/users', userController.getAllUsers);
router.get('/userName/:username', userController.getUserByName);
router.put('/userRole/:id', userController.updateUserRole);

// Rutas para roles
router.post('/roles', roleController.createRole);
router.get('/roles/:id', roleController.getRoleById);
router.get('/roles', roleController.getAllRoles);
router.put('/roles/:id', roleController.updateRole);
router.delete('/roles/:id', roleController.deleteRole);

// Rutas para permisos
router.post('/permissions', permissionController.createPermission);
router.get('/permissions/:id', permissionController.getPermission);
router.get('/permissions', permissionController.getAllPermissions);
router.put('/permissions/:id', permissionController.updatePermission);
router.delete('/permissions/:id', permissionController.deletePermission);

module.exports = router;