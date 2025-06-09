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
  useColorModeValue,
  Flex,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { ciudadesApi, empleadosApi } from '../../services/api'
import type { Ciudad } from '../../services/api'
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons'

export const AltaEmpleados = () => {
  // Estados para los campos del formulario
  const [ciudad, setCiudad] = useState<string>('')
  const [nombre, setNombre] = useState<string>('')
  const [apellidoPaterno, setApellidoPaterno] = useState<string>('')
  const [apellidoMaterno, setApellidoMaterno] = useState<string>('')
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('')
  const [sueldo, setSueldo] = useState<string>('')
  
  // Estados para errores
  const [nombreError, setNombreError] = useState<string>('')
  const [apellidoPaternoError, setApellidoPaternoError] = useState<string>('')
  const [apellidoMaternoError, setApellidoMaternoError] = useState<string>('')
  const [fechaNacimientoError, setFechaNacimientoError] = useState<string>('')
  const [sueldoError, setSueldoError] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  
  // Estado para diálogo de confirmación de salida
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)
  
  // Estados para datos de la API
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Referencias para los campos del formulario
  const ciudadRef = useRef<HTMLSelectElement>(null)
  const nombreRef = useRef<HTMLInputElement>(null)
  const apellidoPaternoRef = useRef<HTMLInputElement>(null)
  const apellidoMaternoRef = useRef<HTMLInputElement>(null)
  const fechaNacimientoRef = useRef<HTMLInputElement>(null)
  const sueldoRef = useRef<HTMLInputElement>(null)
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.700')
  const headerBg = useColorModeValue('blue.50', 'blue.900')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const errorBg = useColorModeValue('red.50', 'red.900')
  const errorBorderColor = useColorModeValue('red.500', 'red.600')
  const errorTextColor = useColorModeValue('red.600', 'red.200')
  
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
        setError('No se pudieron cargar los datos de ciudades. Verifique su conexión e intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Validar solo caracteres alfabéticos
  const validarSoloLetras = (value: string) => {
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/
    return soloLetras.test(value)
  }
  
  // Validar mayoría de edad
  const validarMayoriaEdad = (fechaNacimiento: string) => {
    const fechaNac = new Date(fechaNacimiento)
    const hoy = new Date()
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear()
    const mes = hoy.getMonth() - fechaNac.getMonth()
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--
    }
    
    return edad >= 18
  }
  
  // Manejar cambio en nombre
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value.length > 15) {
      return
    }
    
    if (!validarSoloLetras(value) && value !== '') {
      setNombreError('Solo se permiten caracteres alfabéticos')
      return
    }
    
    setNombre(value)
    setNombreError('')
  }
  
  // Manejar cambio en apellido paterno
  const handleApellidoPaternoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value.length > 15) {
      return
    }
    
    if (!validarSoloLetras(value) && value !== '') {
      setApellidoPaternoError('Solo se permiten caracteres alfabéticos')
      return
    }
    
    setApellidoPaterno(value)
    setApellidoPaternoError('')
  }
  
  // Manejar cambio en apellido materno
  const handleApellidoMaternoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (value.length > 15) {
      return
    }
    
    if (!validarSoloLetras(value) && value !== '') {
      setApellidoMaternoError('Solo se permiten caracteres alfabéticos')
      return
    }
    
    setApellidoMaterno(value)
    setApellidoMaternoError('')
  }
  
  // Manejar cambio en fecha de nacimiento
  const handleFechaNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFechaNacimiento(value)
    
    if (value && !validarMayoriaEdad(value)) {
      setFechaNacimientoError('El empleado debe ser mayor de edad')
    } else {
      setFechaNacimientoError('')
    }
  }
  
  // Manejar cambio en sueldo
  const handleSueldoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const regex = /^[0-9]*\.?[0-9]*$/
    
    if (!regex.test(value) && value !== '') {
      setSueldoError('Solo se permiten caracteres numéricos')
      return
    }
    
    setSueldo(value)
    setSueldoError('')
  }
  
  // Validar formulario completo
  const validarFormulario = () => {
    if (!ciudad) {
      setFormError('Debe seleccionar una ciudad')
      ciudadRef.current?.focus()
      return false
    }
    
    if (!nombre) {
      setFormError('Debe ingresar un nombre')
      nombreRef.current?.focus()
      return false
    }
    
    if (!apellidoPaterno) {
      setFormError('Debe ingresar un apellido paterno')
      apellidoPaternoRef.current?.focus()
      return false
    }
    
    if (!apellidoMaterno) {
      setFormError('Debe ingresar un apellido materno')
      apellidoMaternoRef.current?.focus()
      return false
    }
    
    if (!fechaNacimiento) {
      setFormError('Debe ingresar una fecha de nacimiento')
      fechaNacimientoRef.current?.focus()
      return false
    }
    
    if (fechaNacimiento && !validarMayoriaEdad(fechaNacimiento)) {
      setFormError('El empleado debe ser mayor de edad')
      fechaNacimientoRef.current?.focus()
      return false
    }
    
    if (!sueldo) {
      setFormError('Debe ingresar un sueldo')
      sueldoRef.current?.focus()
      return false
    }
    
    setFormError('')
    return true
  }
  
  // Manejar clic en botón Aceptar
  const handleAceptar = async () => {
    if (validarFormulario()) {
      try {
        await empleadosApi.create({
          nombre,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          fecha_nacimiento: fechaNacimiento,
          sueldo: parseFloat(sueldo),
          id_ciudad: parseInt(ciudad),
          activo: true
        })
        
        toast({
          title: 'Empleado guardado',
          description: 'La información del empleado ha sido guardada correctamente',
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
          description: err.message || 'Error al guardar el empleado',
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
    setNombre('')
    setApellidoPaterno('')
    setApellidoMaterno('')
    setFechaNacimiento('')
    setSueldo('')
    setNombreError('')
    setApellidoPaternoError('')
    setApellidoMaternoError('')
    setFechaNacimientoError('')
    setSueldoError('')
    setFormError('')
    
    // Posicionar cursor en el campo Ciudad
    setTimeout(() => {
      ciudadRef.current?.focus()
    }, 0)
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
  
  // Manejar confirmación de salida
  const handleConfirmExit = () => {
    setIsExitDialogOpen(false)
    navigate('/')
  }
  
  // Manejar cancelación de salida
  const handleCancelExit = () => {
    setIsExitDialogOpen(false)
  }
  
  // Manejar clic en botón Salir
  const handleSalir = () => {
    setIsExitDialogOpen(true)
  }
  
  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Box position="fixed" top="0" left="0" right="0" bottom="0" display="flex" alignItems="center" justifyContent="center" bg="gray.50" overflowY="auto">
        <Box py={8}>
          <Card w={["95%", "90%", "450px"]} maxW="500px" boxShadow="xl" borderRadius="lg" mx="auto">
            <CardHeader bg={headerBg} borderTopRadius="lg">
              <Heading size="lg" textAlign="center">Alta de Empleados</Heading>
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
              <Heading size="lg" textAlign="center">Alta de Empleados</Heading>
            </CardHeader>
            <CardBody>
              <Box 
                p={5} 
                bg={errorBg} 
                color={errorTextColor} 
                borderRadius="md" 
                mb={6}
                borderLeft="4px" 
                borderColor={errorBorderColor}
              >
                <Flex direction="column" align="center" justify="center">
                  <Icon as={CloseIcon} boxSize={10} mb={3} />
                  <Text fontWeight="bold" fontSize="lg" mb={1} textAlign="center">
                    Error de conexión
                  </Text>
                  <Text textAlign="center" mb={4}>{error}</Text>
                  <HStack spacing={4} mt={2}>
                    <Button 
                      colorScheme="blue" 
                      onClick={() => window.location.reload()}
                      leftIcon={<RepeatIcon />}
                      size="md"
                      px={6}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    >
                      Reintentar
                    </Button>
                    <Button 
                      colorScheme="red" 
                      onClick={handleSalir}
                      variant="outline"
                      size="md"
                      px={6}
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                      transition="all 0.2s"
                    >
                      Salir
                    </Button>
                  </HStack>
                </Flex>
              </Box>
            </CardBody>
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
            <Heading size={["md", "lg"]} textAlign="center">Alta de Empleados</Heading>
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
                  placeholder="Seleccione"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
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
              
              <FormControl isRequired isInvalid={!!nombreError}>
                <FormLabel fontWeight="medium">Nombre</FormLabel>
                <Input 
                  value={nombre}
                  onChange={handleNombreChange}
                  maxLength={15}
                  ref={nombreRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  placeholder="Ingrese nombre"
                />
                {nombreError && (
                  <FormErrorMessage>{nombreError}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!apellidoPaternoError}>
                <FormLabel fontWeight="medium">Apellido Paterno</FormLabel>
                <Input 
                  value={apellidoPaterno}
                  onChange={handleApellidoPaternoChange}
                  maxLength={15}
                  ref={apellidoPaternoRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  placeholder="Ingrese apellido paterno"
                />
                {apellidoPaternoError && (
                  <FormErrorMessage>{apellidoPaternoError}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!apellidoMaternoError}>
                <FormLabel fontWeight="medium">Apellido Materno</FormLabel>
                <Input 
                  value={apellidoMaterno}
                  onChange={handleApellidoMaternoChange}
                  maxLength={15}
                  ref={apellidoMaternoRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  placeholder="Ingrese apellido materno"
                />
                {apellidoMaternoError && (
                  <FormErrorMessage>{apellidoMaternoError}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!fechaNacimientoError}>
                <FormLabel fontWeight="medium">Fecha de Nacimiento</FormLabel>
                <Input 
                  type="date"
                  value={fechaNacimiento}
                  onChange={handleFechaNacimientoChange}
                  ref={fechaNacimientoRef}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h={["40px", "45px"]}
                  fontSize={["sm", "md"]}
                  max={new Date().toISOString().split('T')[0]}
                />
                {fechaNacimientoError && (
                  <FormErrorMessage>{fechaNacimientoError}</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!sueldoError}>
                <FormLabel fontWeight="medium">Sueldo</FormLabel>
                <InputGroup>
                  <Input 
                    value={sueldo}
                    onChange={handleSueldoChange}
                    ref={sueldoRef}
                    bg="white"
                    borderColor={borderColor}
                    _hover={{ borderColor: 'blue.300' }}
                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                    h={["40px", "45px"]}
                    fontSize={["sm", "md"]}
                    placeholder="Ingrese sueldo"
                    type="text"
                  />
                  <InputRightElement
                    pointerEvents="none"
                    color="gray.500"
                    fontSize="sm"
                    children="$"
                    h={["40px", "45px"]}
                  />
                </InputGroup>
                {sueldoError && (
                  <FormErrorMessage>{sueldoError}</FormErrorMessage>
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

export default AltaEmpleados 