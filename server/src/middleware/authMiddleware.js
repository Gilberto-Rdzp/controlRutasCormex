const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
exports.verificarToken = (req, res, next) => {
  // Obtener el token del encabezado
  const bearerHeader = req.headers['authorization'];
  
  // Verificar si el token existe
  if (!bearerHeader) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Extraer el token (eliminar 'Bearer ' del inicio)
    const token = bearerHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cormex_secret_key');
    
    // Agregar la información del usuario al request
    req.usuario = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}; 