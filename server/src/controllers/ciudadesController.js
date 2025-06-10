const db = require('../config/db.config');

// Obtener todas las ciudades
const getCiudades = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Ciudades ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener ciudades:', err);
    res.status(500).json({ error: 'Error al obtener ciudades', details: err.message });
  }
};

// Obtener una ciudad por ID
const getCiudadById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM Ciudades WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener ciudad:', err);
    res.status(500).json({ error: 'Error al obtener ciudad', details: err.message });
  }
};

// Crear una nueva ciudad
const createCiudad = async (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la ciudad es requerido' });
  }
  
  try {
    const result = await db.query(
      'INSERT INTO Ciudades (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Código de error para violación de restricción única
      return res.status(400).json({ error: 'Ya existe una ciudad con ese nombre' });
    }
    
    console.error('Error al crear ciudad:', err);
    res.status(500).json({ error: 'Error al crear ciudad', details: err.message });
  }
};

// Actualizar una ciudad
const updateCiudad = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la ciudad es requerido' });
  }
  
  try {
    const result = await db.query(
      'UPDATE Ciudades SET nombre = $1 WHERE id = $2 RETURNING *',
      [nombre, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Ya existe una ciudad con ese nombre' });
    }
    
    console.error('Error al actualizar ciudad:', err);
    res.status(500).json({ error: 'Error al actualizar ciudad', details: err.message });
  }
};

// Eliminar una ciudad
const deleteCiudad = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Primero verificamos si hay empleados o rutas asociadas a esta ciudad
    const empleadosResult = await db.query('SELECT COUNT(*) FROM Empleados WHERE id_ciudad = $1', [id]);
    if (parseInt(empleadosResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la ciudad porque tiene empleados asociados' 
      });
    }
    
    const rutasResult = await db.query('SELECT COUNT(*) FROM Rutas WHERE id_ciudad = $1', [id]);
    if (parseInt(rutasResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar la ciudad porque tiene rutas asociadas' 
      });
    }
    
    const result = await db.query('DELETE FROM Ciudades WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    
    res.json({ message: 'Ciudad eliminada correctamente', ciudad: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar ciudad:', err);
    res.status(500).json({ error: 'Error al eliminar ciudad', details: err.message });
  }
};

module.exports = {
  getCiudades,
  getCiudadById,
  createCiudad,
  updateCiudad,
  deleteCiudad
}; 