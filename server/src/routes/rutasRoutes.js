const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');

// Rutas para rutas
router.get('/', rutasController.getRutas);
router.get('/:id', rutasController.getRutaById);
router.get('/ciudad/:ciudadId', rutasController.getRutasPorCiudad);
router.post('/', rutasController.createRuta);
router.put('/:id', rutasController.updateRuta);
router.delete('/:id', rutasController.deleteRuta);

module.exports = router; 