const db = require('../config/db.config');

// Obtener todas las rutas
const getRutas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, 
        c.nombre as nombre_ciudad,
        e.nombre as nombre_chofer,
        e.apellido_paterno,
        e.apellido_materno
      FROM Rutas r
      JOIN Ciudades c ON r.id_ciudad = c.id
      JOIN Empleados e ON r.id_empleado = e.id
      ORDER BY r.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener rutas:', err);
    res.status(500).json({ error: 'Error al obtener rutas', details: err.message });
  }
};

// Obtener una ruta por ID
const getRutaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT r.*, 
        c.nombre as nombre_ciudad,
        e.nombre as nombre_chofer,
        e.apellido_paterno,
        e.apellido_materno
      FROM Rutas r
      JOIN Ciudades c ON r.id_ciudad = c.id
      JOIN Empleados e ON r.id_empleado = e.id
      WHERE r.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener ruta:', err);
    res.status(500).json({ error: 'Error al obtener ruta', details: err.message });
  }
};

// Obtener rutas por ciudad
const getRutasPorCiudad = async (req, res) => {
  const { ciudadId } = req.params;
  try {
    const result = await db.query(`
      SELECT r.*, 
        c.nombre as nombre_ciudad,
        e.nombre as nombre_chofer,
        e.apellido_paterno,
        e.apellido_materno
      FROM Rutas r
      JOIN Ciudades c ON r.id_ciudad = c.id
      JOIN Empleados e ON r.id_empleado = e.id
      WHERE r.id_ciudad = $1
      ORDER BY r.nombre
    `, [ciudadId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener rutas por ciudad:', err);
    res.status(500).json({ error: 'Error al obtener rutas por ciudad', details: err.message });
  }
};

// Crear una nueva ruta
const createRuta = async (req, res) => {
  const { nombre, tipo, capacidad, id_ciudad, id_empleado } = req.body;
  
  // Validación de campos requeridos
  if (!nombre || !tipo || !capacidad || !id_ciudad || !id_empleado) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Validación de longitud del nombre
  if (nombre.length > 15) {
    return res.status(400).json({ error: 'El nombre de la ruta no debe exceder 15 caracteres' });
  }
  
  // Validación de tipo de servicio
  if (tipo !== 'Personal' && tipo !== 'Artículos') {
    return res.status(400).json({ error: 'El tipo de servicio debe ser Personal o Artículos' });
  }
  
  // Validación de capacidad
  if (capacidad <= 0) {
    return res.status(400).json({ error: 'La capacidad debe ser mayor a cero' });
  }
  
  // Validación de capacidad por tipo
  const capacidadMaxima = tipo === 'Personal' ? 34 : 100;
  if (capacidad > capacidadMaxima) {
    return res.status(400).json({ 
      error: `La capacidad máxima para ${tipo} es ${capacidadMaxima}` 
    });
  }
  
  try {
    // Validar que la ciudad exista
    const ciudadResult = await db.query('SELECT * FROM Ciudades WHERE id = $1', [id_ciudad]);
    if (ciudadResult.rows.length === 0) {
      return res.status(400).json({ error: 'La ciudad especificada no existe' });
    }
    
    // Validar que el empleado exista, esté activo y pertenezca a la ciudad
    const empleadoResult = await db.query(
      'SELECT * FROM Empleados WHERE id = $1 AND activo = true AND id_ciudad = $2',
      [id_empleado, id_ciudad]
    );
    
    if (empleadoResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'El chofer especificado no existe, no está activo o no pertenece a la ciudad seleccionada' 
      });
    }
    
    // Insertar la nueva ruta
    const result = await db.query(
      `INSERT INTO Rutas (nombre, tipo, capacidad, id_ciudad, id_empleado)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, tipo, capacidad, id_ciudad, id_empleado]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear ruta:', err);
    res.status(500).json({ error: 'Error al crear ruta', details: err.message });
  }
};

// Actualizar una ruta
const updateRuta = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipo, capacidad, id_ciudad, id_empleado } = req.body;
  
  // Validación de campos requeridos
  if (!nombre || !tipo || !capacidad || !id_ciudad || !id_empleado) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Validación de longitud del nombre
  if (nombre.length > 15) {
    return res.status(400).json({ error: 'El nombre de la ruta no debe exceder 15 caracteres' });
  }
  
  // Validación de tipo de servicio
  if (tipo !== 'Personal' && tipo !== 'Artículos') {
    return res.status(400).json({ error: 'El tipo de servicio debe ser Personal o Artículos' });
  }
  
  // Validación de capacidad
  if (capacidad <= 0) {
    return res.status(400).json({ error: 'La capacidad debe ser mayor a cero' });
  }
  
  // Validación de capacidad por tipo
  const capacidadMaxima = tipo === 'Personal' ? 34 : 100;
  if (capacidad > capacidadMaxima) {
    return res.status(400).json({ 
      error: `La capacidad máxima para ${tipo} es ${capacidadMaxima}` 
    });
  }
  
  try {
    // Verificar si la ruta existe
    const rutaExiste = await db.query('SELECT * FROM Rutas WHERE id = $1', [id]);
    if (rutaExiste.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    // Validar que la ciudad exista
    const ciudadResult = await db.query('SELECT * FROM Ciudades WHERE id = $1', [id_ciudad]);
    if (ciudadResult.rows.length === 0) {
      return res.status(400).json({ error: 'La ciudad especificada no existe' });
    }
    
    // Validar que el empleado exista, esté activo y pertenezca a la ciudad
    const empleadoResult = await db.query(
      'SELECT * FROM Empleados WHERE id = $1 AND activo = true AND id_ciudad = $2',
      [id_empleado, id_ciudad]
    );
    
    if (empleadoResult.rows.length === 0) {
      return res.status(400).json({ 
        error: 'El chofer especificado no existe, no está activo o no pertenece a la ciudad seleccionada' 
      });
    }
    
    // Actualizar la ruta
    const result = await db.query(
      `UPDATE Rutas SET 
        nombre = $1, 
        tipo = $2, 
        capacidad = $3, 
        id_ciudad = $4, 
        id_empleado = $5
      WHERE id = $6 RETURNING *`,
      [nombre, tipo, capacidad, id_ciudad, id_empleado, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar ruta:', err);
    res.status(500).json({ error: 'Error al actualizar ruta', details: err.message });
  }
};

// Eliminar una ruta
const deleteRuta = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM Rutas WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }
    
    res.json({ message: 'Ruta eliminada correctamente', ruta: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar ruta:', err);
    res.status(500).json({ error: 'Error al eliminar ruta', details: err.message });
  }
};

module.exports = {
  getRutas,
  getRutaById,
  getRutasPorCiudad,
  createRuta,
  updateRuta,
  deleteRuta
}; 