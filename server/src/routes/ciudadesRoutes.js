const express = require('express');
const router = express.Router();
const ciudadesController = require('../controllers/ciudadesController');

// Rutas para ciudades
router.get('/', ciudadesController.getCiudades);
router.get('/:id', ciudadesController.getCiudadById);
router.post('/', ciudadesController.createCiudad);
router.put('/:id', ciudadesController.updateCiudad);
router.delete('/:id', ciudadesController.deleteCiudad);

module.exports = router; 