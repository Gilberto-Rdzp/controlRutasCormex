const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');

// Rutas para empleados
router.get('/', empleadosController.getEmpleados);
router.get('/:id', empleadosController.getEmpleadoById);
router.get('/ciudad/:ciudadId', empleadosController.getChoferesPorCiudad);
router.post('/', empleadosController.createEmpleado);
router.put('/:id', empleadosController.updateEmpleado);
router.patch('/:id/estado', empleadosController.cambiarEstadoEmpleado);
router.delete('/:id', empleadosController.deleteEmpleado);

module.exports = router; 