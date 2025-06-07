import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import AltaRutas from './pages/rutas/AltaRutas'
import BusquedaRutas from './pages/rutas/BusquedaRutas'
import AltaEmpleados from './pages/empleados/AltaEmpleados'
import BusquedaEmpleados from './pages/empleados/BusquedaEmpleados'

const queryClient = new QueryClient()

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rutas/alta" element={<AltaRutas />} />
            <Route path="/rutas/busqueda" element={<BusquedaRutas />} />
            <Route path="/empleados/alta" element={<AltaEmpleados />} />
            <Route path="/empleados/busqueda" element={<BusquedaEmpleados />} />
          </Routes>
        </Router>
        <ToastContainer />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
