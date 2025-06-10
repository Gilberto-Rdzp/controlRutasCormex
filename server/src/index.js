const express = require('express');
const cors = require('cors');
const db = require('./config/db.config');

// Importar rutas
const ciudadesRoutes = require('./routes/ciudadesRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');
const rutasRoutes = require('./routes/rutasRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database connection successful', 
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ciudades', ciudadesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/rutas', rutasRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 