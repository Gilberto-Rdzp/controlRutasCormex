import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import Login from './pages/Login'
import AltaRutas from './pages/rutas/AltaRutas'
import BusquedaRutas from './pages/rutas/BusquedaRutas'
import AltaEmpleados from './pages/empleados/AltaEmpleados'
import BusquedaEmpleados from './pages/empleados/BusquedaEmpleados'
import ProtectedRoute from './components/ProtectedRoute'

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Redirección de la raíz al login o dashboard según autenticación */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rutas protegidas que requieren autenticación */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/rutas/alta" element={<AltaRutas />} />
              <Route path="/rutas/busqueda" element={<BusquedaRutas />} />
              <Route path="/empleados/alta" element={<AltaEmpleados />} />
              <Route path="/empleados/busqueda" element={<BusquedaEmpleados />} />
            </Route>
            
            {/* Ruta para cualquier otra dirección no definida */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <ToastContainer />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
