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
  Center,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Icon,
  useColorModeValue
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
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.700')
  const headerBg = useColorModeValue('blue.50', 'blue.900')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
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
          position: 'top',
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
          position: 'top',
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
      <Box position="fixed" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="gray.50" overflowY="auto">
        <Box py={8}>
          <Card w={["95%", "90%", "450px"]} maxW="500px" boxShadow="xl" borderRadius="lg" mx="auto">
            <CardHeader bg={headerBg} borderTopRadius="lg">
              <Heading size="lg" textAlign="center">Alta de Rutas</Heading>
            </CardHeader>
            <CardBody>
              <Center py={10}>
                <VStack>
                  <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
                  <Text mt={4} fontSize="lg">Cargando datos...</Text>
                </VStack>
              </Center>
            </CardBody>
          </Card>
        </Box>
      </Box>
    )
  }
  
  // Mostrar mensaje de error
  if (error) {
    return (
      <Box position="fixed" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="gray.50" overflowY="auto">
        <Box py={8}>
          <Card w={["95%", "90%", "450px"]} maxW="500px" boxShadow="xl" borderRadius="lg" mx="auto">
            <CardHeader bg={headerBg} borderTopRadius="lg">
              <Heading size="lg" textAlign="center">Alta de Rutas</Heading>
            </CardHeader>
            <CardBody>
              <Center py={10}>
                <VStack>
                  <Icon viewBox="0 0 24 24" boxSize={12} color="red.500">
                    <path
                      fill="currentColor"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    />
                  </Icon>
                  <Text color="red.500" fontSize="lg" fontWeight="medium" mt={2}>{error}</Text>
                  <Button mt={6} colorScheme="blue" onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                </VStack>
              </Center>
            </CardBody>
          </Card>
        </Box>
      </Box>
    )
  }
  
  return (
    <Box position="fixed" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="gray.50" overflowY="auto">
      <Box py={8} w="100%" display="flex" justifyContent="center">
        <Card 
          w={["95%", "90%", "450px"]} 
          maxW="500px" 
          boxShadow="2xl" 
          borderRadius="lg" 
          bg={cardBg} 
          mx="auto"
          overflow="hidden"
        >
          <CardHeader bg={headerBg} borderTopRadius="lg" pb={4} textAlign="center">
            <Heading size={["md", "lg"]} textAlign="center">Alta de Rutas</Heading>
          </CardHeader>
          
          <CardBody pt={6} px={[4, 5, 6]}>
            <VStack spacing={5} align="stretch">
              {formError && (
                <Box 
                  p={3} 
                  bg="red.50" 
                  color="red.600" 
                  borderRadius="md" 
                  borderLeft="4px" 
                  borderColor="red.500"
                >
                  <Text fontWeight="medium">{formError}</Text>
                </Box>
              )}
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Ciudad</FormLabel>
                <Select 
                  placeholder="Seleccione una ciudad"
                  value={ciudad}
                  onChange={handleCiudadChange}
                  ref={ciudadRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                >
                  {ciudades.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired isInvalid={!!nombreRutaError}>
                <FormLabel fontWeight="medium">Nombre de la Ruta</FormLabel>
                <Input 
                  value={nombreRuta}
                  onChange={handleNombreRutaChange}
                  maxLength={15}
                  ref={nombreRutaRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  placeholder="Ingrese nombre de ruta"
                />
                {nombreRutaError && (
                  <FormErrorMessage>{nombreRutaError}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Tipo</FormLabel>
                <Select 
                  placeholder="Seleccione un tipo"
                  value={tipo}
                  onChange={handleTipoChange}
                  ref={tipoRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                >
                  {tiposServicio.map(t => (
                    <option key={t.id} value={t.id}>{t.id === 'Personal' ? '1' : '2'} - {t.nombre}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Chófer</FormLabel>
                <Select 
                  placeholder="Seleccione un chófer"
                  value={chofer}
                  onChange={(e) => setChofer(e.target.value)}
                  ref={choferRef}
                  isDisabled={!ciudad}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  opacity={!ciudad ? 0.6 : 1}
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
                  <Text color="orange.500" fontSize="sm" mt={1} fontStyle="italic">
                    No hay chóferes disponibles para la ciudad seleccionada
                  </Text>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!capacidadError}>
                <FormLabel fontWeight="medium">Capacidad</FormLabel>
                <Input 
                  value={capacidad}
                  onChange={handleCapacidadChange}
                  type="number"
                  ref={capacidadRef}
                  isDisabled={!tipo}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  placeholder="Ingrese capacidad"
                  opacity={!tipo ? 0.6 : 1}
                />
                {capacidadError && (
                  <FormErrorMessage>{capacidadError}</FormErrorMessage>
                )}
                {tipo && (
                  <Text fontSize="sm" color="blue.600" mt={1}>
                    Capacidad máxima: {getCapacidadMaxima()}
                  </Text>
                )}
              </FormControl>
            </VStack>
          </CardBody>
          
          <Divider borderColor={borderColor} />
          
          <CardFooter pt={4} px={[4, 5, 6]} pb={4}>
            <HStack spacing={4} width="100%" justifyContent="center">
              <Button 
                colorScheme="green" 
                onClick={handleAceptar}
                leftIcon={<span role="img" aria-label="check">✓</span>}
                size={["md", "md"]}
                px={[4, 5, 6]}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
                flexGrow={1}
                maxW="160px"
              >
                Aceptar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleSalir}
                leftIcon={<span role="img" aria-label="exit">✖</span>}
                size={["md", "md"]}
                px={[4, 5, 6]}
                variant="outline"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                transition="all 0.2s"
                flexGrow={1}
                maxW="160px"
              >
                Salir
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </Box>
      
      {/* Diálogo de confirmación de salida */}
      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelExit}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="md" boxShadow="xl" mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" borderBottomWidth="1px">
              Confirmar salida
            </AlertDialogHeader>

            <AlertDialogBody py={4}>
              ¿Está seguro que desea salir? Los datos no guardados se perderán.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelExit} size="md">
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleConfirmExit} 
                ml={3}
                size="md"
              >
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