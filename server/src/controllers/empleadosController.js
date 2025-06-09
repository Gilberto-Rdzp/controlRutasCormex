const db = require('../config/db.config');

// Obtener todos los empleados
const getEmpleados = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT e.*, c.nombre as nombre_ciudad 
      FROM Empleados e
      JOIN Ciudades c ON e.id_ciudad = c.id
      ORDER BY e.nombre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).json({ error: 'Error al obtener empleados', details: err.message });
  }
};

// Obtener un empleado por ID
const getEmpleadoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT e.*, c.nombre as nombre_ciudad 
      FROM Empleados e
      JOIN Ciudades c ON e.id_ciudad = c.id
      WHERE e.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener empleado:', err);
    res.status(500).json({ error: 'Error al obtener empleado', details: err.message });
  }
};

// Obtener choferes disponibles por ciudad
const getChoferesPorCiudad = async (req, res) => {
  const { ciudadId } = req.params;
  try {
    const result = await db.query(`
      SELECT id, nombre, apellido_paterno, apellido_materno
      FROM Empleados
      WHERE id_ciudad = $1 AND activo = true
      ORDER BY nombre
    `, [ciudadId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener choferes por ciudad:', err);
    res.status(500).json({ error: 'Error al obtener choferes', details: err.message });
  }
};

// Crear un nuevo empleado
const createEmpleado = async (req, res) => {
  const { 
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    fecha_nacimiento, 
    sueldo, 
    id_ciudad 
  } = req.body;
  
  // Validación de campos requeridos
  if (!nombre || !apellido_paterno || !apellido_materno || !fecha_nacimiento || !sueldo || !id_ciudad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Validación de longitud de campos
  if (nombre.length > 15 || apellido_paterno.length > 15 || apellido_materno.length > 15) {
    return res.status(400).json({ 
      error: 'Los campos nombre, apellido paterno y apellido materno no deben exceder 15 caracteres' 
    });
  }
  
  try {
    // Validar que la ciudad exista
    const ciudadResult = await db.query('SELECT * FROM Ciudades WHERE id = $1', [id_ciudad]);
    if (ciudadResult.rows.length === 0) {
      return res.status(400).json({ error: 'La ciudad especificada no existe' });
    }
    
    const result = await db.query(
      `INSERT INTO Empleados (
        nombre, 
        apellido_paterno, 
        apellido_materno, 
        fecha_nacimiento, 
        sueldo, 
        id_ciudad, 
        activo
      ) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sueldo, id_ciudad]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear empleado:', err);
    res.status(500).json({ error: 'Error al crear empleado', details: err.message });
  }
};

// Actualizar un empleado
const updateEmpleado = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    apellido_paterno, 
    apellido_materno, 
    fecha_nacimiento, 
    sueldo, 
    id_ciudad,
    activo 
  } = req.body;
  
  // Validación de campos requeridos
  if (!nombre || !apellido_paterno || !apellido_materno || !fecha_nacimiento || !sueldo || !id_ciudad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  // Validación de longitud de campos
  if (nombre.length > 15 || apellido_paterno.length > 15 || apellido_materno.length > 15) {
    return res.status(400).json({ 
      error: 'Los campos nombre, apellido paterno y apellido materno no deben exceder 15 caracteres' 
    });
  }
  
  try {
    // Validar que la ciudad exista
    const ciudadResult = await db.query('SELECT * FROM Ciudades WHERE id = $1', [id_ciudad]);
    if (ciudadResult.rows.length === 0) {
      return res.status(400).json({ error: 'La ciudad especificada no existe' });
    }
    
    // Verificar si el empleado existe
    const empleadoExiste = await db.query('SELECT * FROM Empleados WHERE id = $1', [id]);
    if (empleadoExiste.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    // Si se está desactivando un empleado, verificar que no tenga rutas asignadas
    if (activo === false) {
      const rutasResult = await db.query('SELECT COUNT(*) FROM Rutas WHERE id_empleado = $1', [id]);
      if (parseInt(rutasResult.rows[0].count) > 0) {
        return res.status(400).json({ 
          error: 'No se puede desactivar el empleado porque tiene rutas asignadas' 
        });
      }
    }
    
    const result = await db.query(
      `UPDATE Empleados SET 
        nombre = $1, 
        apellido_paterno = $2, 
        apellido_materno = $3, 
        fecha_nacimiento = $4, 
        sueldo = $5, 
        id_ciudad = $6,
        activo = $7
      WHERE id = $8 RETURNING *`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sueldo, id_ciudad, activo, id]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar empleado:', err);
    res.status(500).json({ error: 'Error al actualizar empleado', details: err.message });
  }
};

// Cambiar estado de un empleado (activar/desactivar)
const cambiarEstadoEmpleado = async (req, res) => {
  const { id } = req.params;
  const { activo } = req.body;
  
  if (activo === undefined) {
    return res.status(400).json({ error: 'El campo activo es requerido' });
  }
  
  try {
    // Si se está desactivando un empleado, verificar que no tenga rutas asignadas
    if (activo === false) {
      const rutasResult = await db.query('SELECT COUNT(*) FROM Rutas WHERE id_empleado = $1', [id]);
      if (parseInt(rutasResult.rows[0].count) > 0) {
        return res.status(400).json({ 
          error: 'No se puede desactivar el empleado porque tiene rutas asignadas' 
        });
      }
    }
    
    const result = await db.query(
      'UPDATE Empleados SET activo = $1 WHERE id = $2 RETURNING *',
      [activo, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al cambiar estado del empleado:', err);
    res.status(500).json({ error: 'Error al cambiar estado del empleado', details: err.message });
  }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar si el empleado tiene rutas asignadas
    const rutasResult = await db.query('SELECT COUNT(*) FROM Rutas WHERE id_empleado = $1', [id]);
    if (parseInt(rutasResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar el empleado porque tiene rutas asignadas' 
      });
    }
    
    const result = await db.query('DELETE FROM Empleados WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    
    res.json({ message: 'Empleado eliminado correctamente', empleado: result.rows[0] });
  } catch (err) {
    console.error('Error al eliminar empleado:', err);
    res.status(500).json({ error: 'Error al eliminar empleado', details: err.message });
  }
};

module.exports = {
  getEmpleados,
  getEmpleadoById,
  getChoferesPorCiudad,
  createEmpleado,
  updateEmpleado,
  cambiarEstadoEmpleado,
  deleteEmpleado
}; 