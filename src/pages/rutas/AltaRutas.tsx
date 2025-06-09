import { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Select, 
  Input, 
  Button, 
  HStack, 
  VStack, 
  FormErrorMessage, 
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ciudadesApi, empleadosApi, rutasApi } from '../../services/api'
import type { Ciudad, Empleado } from '../../services/api'

export const AltaRutas = () => {
  // Estados para los campos del formulario
  const [ciudad, setCiudad] = useState<string>('')
  const [nombreRuta, setNombreRuta] = useState<string>('')
  const [tipo, setTipo] = useState<string>('')
  const [chofer, setChofer] = useState<string>('')
  const [capacidad, setCapacidad] = useState<string>('')
  
  // Estados para errores
  const [nombreRutaError, setNombreRutaError] = useState<string>('')
  const [capacidadError, setCapacidadError] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  
  // Estado para diálogo de confirmación de salida
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  // Estados para datos de la API
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [choferes, setChoferes] = useState<Empleado[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Tipos de servicio
  const tiposServicio = [
    { id: 'Personal', nombre: 'PERSONAL', capacidadMaxima: 34 },
    { id: 'Artículos', nombre: 'ARTÍCULOS', capacidadMaxima: 100 }
  ]
  
  // Referencias para los campos del formulario
  const ciudadRef = useRef<HTMLSelectElement>(null)
  const nombreRutaRef = useRef<HTMLInputElement>(null)
  const tipoRef = useRef<HTMLSelectElement>(null)
  const choferRef = useRef<HTMLSelectElement>(null)
  const capacidadRef = useRef<HTMLInputElement>(null)
  
  const toast = useToast()
  const navigate = useNavigate()
  
  // Cargar ciudades al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const ciudadesData = await ciudadesApi.getAll()
        setCiudades(ciudadesData)
        setError(null)
      } catch (err) {
        console.error('Error al cargar ciudades:', err)
        setError('Error al cargar datos. Por favor, intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Cargar choferes cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (ciudad) {
      const fetchChoferes = async () => {
        try {
          const choferesData = await empleadosApi.getChoferesPorCiudad(parseInt(ciudad))
          setChoferes(choferesData)
          setError(null)
        } catch (err) {
          console.error('Error al cargar choferes:', err)
          setError('Error al cargar choferes. Por favor, intente nuevamente.')
          setChoferes([])
        }
      }
      
      fetchChoferes()
    } else {
      setChoferes([])
    }
  }, [ciudad])
  
  // Obtener capacidad máxima según el tipo seleccionado
  const getCapacidadMaxima = () => {
    const tipoSeleccionado = tiposServicio.find(t => t.id === tipo)
    return tipoSeleccionado?.capacidadMaxima || 0
  }
  
  // Validar caracteres alfanuméricos en nombre de ruta
  const validarNombreRuta = (value: string) => {
    const alfanumerico = /^[a-zA-Z0-9\s]*$/
    if (!alfanumerico.test(value)) {
      setNombreRutaError('Solo se permiten caracteres alfanuméricos')
      return false
    }
    setNombreRutaError('')
    return true
  }
  
  // Manejar cambio en nombre de ruta
  const handleNombreRutaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 15) {
      if (validarNombreRuta(value)) {
        setNombreRuta(value)
      }
    }
  }
  
  // Manejar cambio en capacidad
  const handleCapacidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numero = parseInt(value)
    
    if (value === '') {
      setCapacidad('')
      setCapacidadError('')
      return
    }
    
    if (isNaN(numero) || numero <= 0) {
      setCapacidadError('La capacidad debe ser mayor a cero')
      return
    }
    
    const capacidadMaxima = getCapacidadMaxima()
    if (capacidadMaxima > 0 && numero > capacidadMaxima) {
      setCapacidadError(`La capacidad máxima para ${tipo === 'Personal' ? 'Personal' : 'Artículos'} es ${capacidadMaxima}`)
      return
    }
    
    setCapacidad(value)
    setCapacidadError('')
  }
  
  // Manejar cambio de ciudad
  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCiudad(e.target.value)
    setChofer('')
  }
  
  // Manejar cambio de tipo
  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipo(e.target.value)
    setCapacidad('')
    setCapacidadError('')
  }
  
  // Validar formulario completo
  const validarFormulario = () => {
    if (!ciudad) {
      setFormError('Debe seleccionar una ciudad')
      ciudadRef.current?.focus()
      return false
    }
    
    if (!nombreRuta) {
      setFormError('Debe ingresar un nombre de ruta')
      nombreRutaRef.current?.focus()
      return false
    }
    
    if (!tipo) {
      setFormError('Debe seleccionar un tipo de servicio')
      tipoRef.current?.focus()
      return false
    }
    
    if (!chofer) {
      setFormError('Debe seleccionar un chofer')
      choferRef.current?.focus()
      return false
    }
    
    if (!capacidad) {
      setFormError('Debe ingresar una capacidad')
      capacidadRef.current?.focus()
      return false
    }
    
    setFormError('')
    return true
  }
  
  // Manejar clic en botón Aceptar
  const handleAceptar = async () => {
    if (validarFormulario()) {
      try {
        await rutasApi.create({
          nombre: nombreRuta,
          tipo: tipo as 'Personal' | 'Artículos',
          capacidad: parseInt(capacidad),
          id_ciudad: parseInt(ciudad),
          id_empleado: parseInt(chofer)
        })
        
        toast({
          title: 'Ruta guardada',
          description: 'La información de la ruta ha sido guardada correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Limpiar formulario
        limpiarFormulario()
      } catch (err: any) {
        toast({
          title: 'Error al guardar',
          description: err.message || 'Error al guardar la ruta',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }
  
  // Limpiar formulario
  const limpiarFormulario = () => {
    setCiudad('')
    setNombreRuta('')
    setTipo('')
    setChofer('')
    setCapacidad('')
    setNombreRutaError('')
    setCapacidadError('')
    setFormError('')
    
    // Posicionar cursor en el campo Ciudad
    setTimeout(() => {
      ciudadRef.current?.focus()
    }, 0)
  }
  
  // Manejar clic en botón Salir
  const handleSalir = () => {
    setIsExitDialogOpen(true)
  }
  
  // Manejar confirmación de salida
  const handleConfirmExit = () => {
    setIsExitDialogOpen(false)
    navigate('/')
  }
  
  // Manejar cancelación de salida
  const handleCancelExit = () => {
    setIsExitDialogOpen(false)
  }
  
  // Manejar tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSalir()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Box p={8} maxWidth="600px" mx="auto">
        <Heading mb={6}>Alta de Rutas</Heading>
        <Center py={10}>
          <VStack>
            <Spinner size="xl" />
            <Text mt={4}>Cargando datos...</Text>
          </VStack>
        </Center>
      </Box>
    )
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <Box p={8} maxWidth="600px" mx="auto">
        <Heading mb={6}>Alta de Rutas</Heading>
        <Center py={10}>
          <VStack>
            <Text color="red.500">{error}</Text>
            <Button mt={4} onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </VStack>
        </Center>
      </Box>
    )
  }
  
  return (
    <Box p={8} maxWidth="600px" mx="auto">
      <Heading mb={6}>Alta de Rutas</Heading>
      
      <VStack spacing={4} align="stretch">
        {formError && (
          <Text color="red.500" fontWeight="bold">{formError}</Text>
        )}
        
        <FormControl isRequired>
          <FormLabel>Ciudad</FormLabel>
          <Select 
            placeholder="Seleccione"
            value={ciudad}
            onChange={handleCiudadChange}
            ref={ciudadRef}
          >
            {ciudades.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl isRequired isInvalid={!!nombreRutaError}>
          <FormLabel>Nombre de la Ruta</FormLabel>
          <Input 
            value={nombreRuta}
            onChange={handleNombreRutaChange}
            maxLength={15}
            ref={nombreRutaRef}
          />
          {nombreRutaError && (
            <FormErrorMessage>{nombreRutaError}</FormErrorMessage>
          )}
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Tipo</FormLabel>
          <Select 
            placeholder="Seleccione"
            value={tipo}
            onChange={handleTipoChange}
            ref={tipoRef}
          >
            {tiposServicio.map(t => (
              <option key={t.id} value={t.id}>{t.id === 'Personal' ? '1' : '2'} - {t.nombre}</option>
            ))}
          </Select>
        </FormControl>
        
        <FormControl isRequired>
          <FormLabel>Chófer</FormLabel>
          <Select 
            placeholder="Seleccione"
            value={chofer}
            onChange={(e) => setChofer(e.target.value)}
            ref={choferRef}
            isDisabled={!ciudad}
          >
            {choferes.length > 0 ? (
              choferes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido_paterno} {c.apellido_materno}
                </option>
              ))
            ) : (
              <option disabled value="">
                No hay chóferes disponibles en esta ciudad
              </option>
            )}
          </Select>
          {ciudad && choferes.length === 0 && (
            <Text color="orange.500" fontSize="sm" mt={1}>
              No hay chóferes disponibles para la ciudad seleccionada
            </Text>
          )}
        </FormControl>
        
        <FormControl isRequired isInvalid={!!capacidadError}>
          <FormLabel>Capacidad</FormLabel>
          <Input 
            value={capacidad}
            onChange={handleCapacidadChange}
            type="number"
            ref={capacidadRef}
            isDisabled={!tipo}
          />
          {capacidadError && (
            <FormErrorMessage>{capacidadError}</FormErrorMessage>
          )}
          {tipo && (
            <Text fontSize="sm" color="gray.600" mt={1}>
              Capacidad máxima: {getCapacidadMaxima()}
            </Text>
          )}
        </FormControl>
        
        <HStack spacing={4} pt={4} justifyContent="flex-end">
          <Button 
            colorScheme="green" 
            onClick={handleAceptar}
            leftIcon={<span role="img" aria-label="check">✓</span>}
          >
            Aceptar
          </Button>
          <Button 
            colorScheme="red" 
            onClick={handleSalir}
            leftIcon={<span role="img" aria-label="exit">✖</span>}
          >
            Salir
          </Button>
        </HStack>
      </VStack>
      
      {/* Diálogo de confirmación de salida */}
      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelExit}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar salida
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro que desea salir? Los datos no guardados se perderán.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelExit}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmExit} ml={3}>
                Salir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default AltaRutas 