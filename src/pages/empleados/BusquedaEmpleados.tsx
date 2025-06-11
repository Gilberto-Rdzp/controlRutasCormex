import { useState, useEffect, useRef } from 'react'
import { 
  Box, 
  Heading, 
  FormControl, 
  FormLabel, 
  Select, 
  Input, 
  Button, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  IconButton, 
  useToast, 
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormErrorMessage,
  Text,
  Center,
  Spinner,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  TableContainer,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, CloseIcon, SearchIcon, RepeatIcon } from '@chakra-ui/icons'
import { ciudadesApi, empleadosApi, rutasApi } from '../../services/api'
import type { Ciudad, Empleado, Ruta } from '../../services/api'

export const BusquedaEmpleados = () => {
  // Estados para filtrado y listado
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('')
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [empleadosFiltrados, setEmpleadosFiltrados] = useState<Empleado[]>([])
  const [filtroRuta, setFiltroRuta] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para eliminación
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState<Empleado | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [rutasAsignadas, setRutasAsignadas] = useState<Ruta[]>([])
  const [tieneRutasAsignadas, setTieneRutasAsignadas] = useState<boolean>(false)
  const cancelDeleteRef = useRef<HTMLButtonElement>(null)
  
  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [empleadoEnEdicion, setEmpleadoEnEdicion] = useState<Empleado | null>(null)
  const [fechaNacimientoEdit, setFechaNacimientoEdit] = useState<string>('')
  const [sueldoEdit, setSueldoEdit] = useState<string>('')
  const [fechaError, setFechaError] = useState<string>('')
  const [sueldoError, setSueldoError] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  
  // Estados para diálogo de salida
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const cancelExitRef = useRef<HTMLButtonElement>(null)
  
  // Referencias
  const fechaNacimientoRef = useRef<HTMLInputElement>(null)
  const sueldoRef = useRef<HTMLInputElement>(null)
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.700')
  const headerBg = useColorModeValue('blue.50', 'blue.900')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const tableBg = useColorModeValue('white', 'gray.800')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const errorBg = useColorModeValue('red.50', 'red.900')
  const errorBorderColor = useColorModeValue('red.500', 'red.600')
  const errorTextColor = useColorModeValue('red.600', 'red.200')
  
  const toast = useToast()
  
  // Cargar ciudades al montar el componente
  const fetchCiudades = async () => {
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
  
  useEffect(() => {
    fetchCiudades()
  }, [])
  
  // Cargar empleados cuando cambia la ciudad seleccionada
  const fetchEmpleados = async (idCiudad: string) => {
    if (!idCiudad) return
    
    setLoading(true)
    try {
      // Obtener todos los empleados y filtrar por ciudad
      const todosLosEmpleados = await empleadosApi.getAll()
      const empleadosFiltrados = todosLosEmpleados.filter(
        empleado => empleado.id_ciudad === parseInt(idCiudad)
      )
      setEmpleados(empleadosFiltrados)
      setEmpleadosFiltrados(empleadosFiltrados)
      setError(null)
    } catch (err) {
      console.error('Error al cargar empleados:', err)
      setError('No se pudieron cargar los empleados para la ciudad seleccionada. Verifique su conexión e intente nuevamente.')
      setEmpleados([])
      setEmpleadosFiltrados([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (ciudadSeleccionada) {
      fetchEmpleados(ciudadSeleccionada)
    } else {
      setEmpleados([])
      setEmpleadosFiltrados([])
    }
  }, [ciudadSeleccionada])
  
  // Filtrar empleados por nombre de ruta
  useEffect(() => {
    if (filtroRuta.trim() === '') {
      setEmpleadosFiltrados(empleados)
    } else {
      const empleadosFiltrados = empleados.filter(empleado => 
        empleado.nombre.toLowerCase().includes(filtroRuta.toLowerCase()) ||
        empleado.apellido_paterno.toLowerCase().includes(filtroRuta.toLowerCase()) ||
        empleado.apellido_materno.toLowerCase().includes(filtroRuta.toLowerCase())
      )
      setEmpleadosFiltrados(empleadosFiltrados)
    }
  }, [filtroRuta, empleados])
  
  // Manejar cambio de ciudad
  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCiudadSeleccionada(e.target.value)
    setFiltroRuta('')
  }
  
  // Manejar cambio en filtro de ruta (nombre de empleado)
  const handleFiltroRutaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroRuta(e.target.value)
  }
  
  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    setCiudadSeleccionada('')
    setFiltroRuta('')
  }
  
  // Verificar si un empleado tiene rutas asignadas
  const verificarRutasAsignadas = async (empleadoId: number) => {
    try {
      // Asumiendo que hay un endpoint para obtener rutas por empleado
      const rutas = await rutasApi.getAll()
      const rutasDelEmpleado = rutas.filter(ruta => ruta.id_empleado === empleadoId)
      setRutasAsignadas(rutasDelEmpleado)
      return rutasDelEmpleado.length > 0
    } catch (err) {
      console.error('Error al verificar rutas asignadas:', err)
      setRutasAsignadas([])
      return false
    }
  }
  
  // Abrir diálogo de confirmación de eliminación
  const handleOpenDeleteDialog = async (empleado: Empleado) => {
    setEmpleadoAEliminar(empleado)
    
    // Verificar si el empleado tiene rutas asignadas
    const tieneRutas = await verificarRutasAsignadas(empleado.id)
    setTieneRutasAsignadas(tieneRutas)
    
    setIsDeleteDialogOpen(true)
  }
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setEmpleadoAEliminar(null)
    setRutasAsignadas([])
    setTieneRutasAsignadas(false)
  }
  
  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!empleadoAEliminar) return
    
    try {
      await empleadosApi.delete(empleadoAEliminar.id)
      
      // Actualizar estado local
      const nuevosEmpleados = empleados.filter(empleado => empleado.id !== empleadoAEliminar.id)
      setEmpleados(nuevosEmpleados)
      setEmpleadosFiltrados(
        empleadosFiltrados.filter(empleado => empleado.id !== empleadoAEliminar.id)
      )
      
      toast({
        title: 'Empleado eliminado',
        description: `El empleado ${empleadoAEliminar.nombre} ${empleadoAEliminar.apellido_paterno} ha sido eliminado correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error al eliminar empleado:', err)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el empleado. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setEmpleadoAEliminar(null)
      setRutasAsignadas([])
      setTieneRutasAsignadas(false)
    }
  }
  
  // Validar si una persona es mayor de edad
  const esMayorDeEdad = (fechaNacimiento: string): boolean => {
    const fechaNac = new Date(fechaNacimiento)
    const hoy = new Date()
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear()
    const mes = hoy.getMonth() - fechaNac.getMonth()
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--
    }
    
    return edad >= 18
  }
  
  // Manejar cambio en fecha de nacimiento durante edición
  const handleFechaNacimientoEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFechaNacimientoEdit(value)
    
    if (!value) {
      setFechaError('La fecha de nacimiento es requerida')
      return
    }
    
    if (!esMayorDeEdad(value)) {
      setFechaError('El empleado debe ser mayor de edad')
      return
    }
    
    setFechaError('')
  }
  
  // Manejar cambio en sueldo durante edición
  const handleSueldoEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numero = parseFloat(value)
    
    if (value === '') {
      setSueldoEdit('')
      setSueldoError('El sueldo es requerido')
      return
    }
    
    if (isNaN(numero) || numero <= 0) {
      setSueldoError('El sueldo debe ser mayor a cero')
      return
    }
    
    setSueldoEdit(value)
    setSueldoError('')
  }
  
  // Formatear fecha para input type="date" (YYYY-MM-DD)
  const formatearFechaParaInput = (fechaString: string): string => {
    try {
      const fecha = new Date(fechaString)
      return fecha.toISOString().split('T')[0]
    } catch (error) {
      console.error('Error al formatear fecha:', error)
      return ''
    }
  }

  // Abrir modal de edición
  const handleOpenEditModal = (empleado: Empleado) => {
    setEmpleadoEnEdicion(empleado)
    // Formatear fecha para que sea compatible con el input type="date"
    setFechaNacimientoEdit(formatearFechaParaInput(empleado.fecha_nacimiento))
    // Asegurarnos de que sueldo sea un número antes de convertirlo a string
    const sueldoValue = typeof empleado.sueldo === 'number' 
      ? empleado.sueldo.toString() 
      : (empleado.sueldo || '0')
    setSueldoEdit(sueldoValue)
    setFechaError('')
    setSueldoError('')
    setFormError('')
    
    setIsEditModalOpen(true)
  }
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEmpleadoEnEdicion(null)
    setFechaNacimientoEdit('')
    setSueldoEdit('')
    setFechaError('')
    setSueldoError('')
    setFormError('')
  }
  
  // Validar formulario de edición
  const validarFormularioEdicion = () => {
    if (!fechaNacimientoEdit) {
      setFormError('Debe ingresar una fecha de nacimiento')
      fechaNacimientoRef.current?.focus()
      return false
    }
    
    if (fechaError) {
      fechaNacimientoRef.current?.focus()
      return false
    }
    
    if (!sueldoEdit) {
      setFormError('Debe ingresar un sueldo')
      sueldoRef.current?.focus()
      return false
    }
    
    if (sueldoError) {
      sueldoRef.current?.focus()
      return false
    }
    
    return true
  }
  
  // Confirmar edición
  const handleConfirmEdit = async () => {
    if (!empleadoEnEdicion) return
    
    if (!validarFormularioEdicion()) {
      return
    }
    
    try {
      // Asegurarnos de que el sueldo sea un número válido
      const sueldoNumerico = parseFloat(sueldoEdit) || 0
      
      const empleadoActualizado = await empleadosApi.update(empleadoEnEdicion.id, {
        nombre: empleadoEnEdicion.nombre,
        apellido_paterno: empleadoEnEdicion.apellido_paterno,
        apellido_materno: empleadoEnEdicion.apellido_materno,
        fecha_nacimiento: fechaNacimientoEdit,
        sueldo: sueldoNumerico,
        id_ciudad: empleadoEnEdicion.id_ciudad,
        activo: empleadoEnEdicion.activo
      })
      
      // Actualizar estado local
      const nuevosEmpleados = empleados.map(empleado => 
        empleado.id === empleadoEnEdicion.id ? empleadoActualizado : empleado
      )
      setEmpleados(nuevosEmpleados)
      setEmpleadosFiltrados(
        empleadosFiltrados.map(empleado => 
          empleado.id === empleadoEnEdicion.id ? empleadoActualizado : empleado
        )
      )
      
      toast({
        title: 'Empleado actualizado',
        description: `El empleado ${empleadoEnEdicion.nombre} ${empleadoEnEdicion.apellido_paterno} ha sido actualizado correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      handleCancelEdit()
    } catch (err) {
      console.error('Error al actualizar empleado:', err)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el empleado. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  
  // Manejar tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Si está abierto el diálogo de eliminación o el modal de edición, no mostrar el diálogo de salida
        if (isDeleteDialogOpen || isEditModalOpen) {
          return
        }
        
        setIsExitDialogOpen(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDeleteDialogOpen, isEditModalOpen])
  
  // Manejar salida
  const handleSalir = () => {
    setIsExitDialogOpen(true)
  }
  
  // Confirmar salida
  const handleConfirmExit = () => {
    window.history.back()
  }
  
  // Cancelar salida
  const handleCancelExit = () => {
    setIsExitDialogOpen(false)
  }

  return (
    <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="gray.50" overflowY="auto" p={4}>
      <Box py={4} w="100%" maxW="1200px" mx="auto">
        <Card 
          boxShadow="xl" 
          borderRadius="lg" 
          bg={cardBg} 
          overflow="hidden"
        >
          <CardHeader bg={headerBg} borderTopRadius="lg" pb={4}>
            <Heading size="lg" textAlign="center">Búsqueda de Empleados</Heading>
          </CardHeader>
          
          <CardBody pt={6} px={6}>
            {loading && !error && (
              <Center my={10}>
                <Spinner size="xl" thickness="4px" color="blue.500" />
              </Center>
            )}
            
            {error && (
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
                </Flex>
              </Box>
            )}
            
            {!loading && !error && (
              <>
                {/* Filtros */}
                <Box mb={6} p={4} bg="blue.50" borderRadius="md" borderLeft="4px" borderColor="blue.400">
                  <Text fontSize="lg" fontWeight="medium" mb={4} color="blue.700">
                    Filtros de búsqueda
                  </Text>
                  <Flex wrap="wrap" gap={6} align="flex-end">
                    <FormControl w={{ base: '100%', md: '250px' }}>
                      <FormLabel fontWeight="medium">Ciudad</FormLabel>
                      <Select 
                        placeholder="Seleccione"
                        value={ciudadSeleccionada}
                        onChange={handleCiudadChange}
                        bg="white"
                        borderColor={borderColor}
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                        h="45px"
                        css={{
                          "&::-webkit-scrollbar": {
                            width: "8px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f1f1f1",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "#888",
                            borderRadius: "4px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: "#555",
                          }
                        }}
                      >
                        {ciudades.map(ciudad => (
                          <option key={ciudad.id} value={ciudad.id.toString()}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl w={{ base: '100%', md: '300px' }}>
                      <FormLabel fontWeight="medium">Nombre</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input 
                          placeholder="Filtrar por nombre"
                          value={filtroRuta}
                          onChange={handleFiltroRutaChange}
                          isDisabled={!ciudadSeleccionada}
                          bg="white"
                          borderColor={borderColor}
                          _hover={{ borderColor: 'blue.300' }}
                          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                          h="45px"
                        />
                      </InputGroup>
                    </FormControl>
                    
                    <Button 
                      colorScheme="red"
                      onClick={handleLimpiarFiltros}
                      h="45px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    >
                      Eliminar Filtros
                    </Button>
                  </Flex>
                </Box>
                
                {/* Tabla de empleados */}
                {ciudadSeleccionada ? (
                  <>
                    <Box mb={3}>
                      <Text fontSize="lg" fontWeight="medium" color="gray.700">
                        Resultados: {empleadosFiltrados.length} {empleadosFiltrados.length === 1 ? 'empleado encontrado' : 'empleados encontrados'}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Seleccione un empleado para modificar o eliminar
                      </Text>
                    </Box>
                    
                    <TableContainer
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={borderColor}
                      boxShadow="sm"
                      mb={4}
                    >
                      <Table variant="simple" bg={tableBg}>
                        <Thead bg={headerBg}>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Nombre</Th>
                            <Th>Ap. Paterno</Th>
                            <Th>Ap. Materno</Th>
                            <Th>Fecha de nacimiento</Th>
                            <Th>Sueldo</Th>
                            <Th width="100px" textAlign="center">Modificar</Th>
                            <Th width="100px" textAlign="center">Eliminar</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {empleadosFiltrados.length > 0 ? (
                            empleadosFiltrados.map(empleado => (
                              <Tr 
                                key={empleado.id}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                              >
                                <Td fontWeight="medium">{empleado.id}</Td>
                                <Td>{empleado.nombre}</Td>
                                <Td>{empleado.apellido_paterno}</Td>
                                <Td>{empleado.apellido_materno}</Td>
                                <Td>{new Date(empleado.fecha_nacimiento).toLocaleDateString('es-MX')}</Td>
                                <Td>${typeof empleado.sueldo === 'number' ? empleado.sueldo.toFixed(2) : empleado.sueldo}</Td>
                                <Td textAlign="center">
                                  <IconButton
                                    aria-label="Modificar empleado"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleOpenEditModal(empleado)}
                                    _hover={{ transform: 'scale(1.1)' }}
                                    transition="all 0.2s"
                                  />
                                </Td>
                                <Td textAlign="center">
                                  <IconButton
                                    aria-label="Eliminar empleado"
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleOpenDeleteDialog(empleado)}
                                    _hover={{ transform: 'scale(1.1)' }}
                                    transition="all 0.2s"
                                  />
                                </Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan={8} textAlign="center" py={6}>
                                <Text color="gray.500">No se encontraron empleados</Text>
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Box 
                    p={6} 
                    bg="blue.50" 
                    borderRadius="md" 
                    textAlign="center"
                    borderWidth="1px"
                    borderColor="blue.200"
                  >
                    <Text fontSize="lg" color="blue.700">
                      Seleccione una ciudad para ver los empleados
                    </Text>
                  </Box>
                )}
              </>
            )}
          </CardBody>
          
          <Divider borderColor={borderColor} />
          
          <CardFooter pt={4} px={6} pb={4}>
            <HStack width="100%" justifyContent="flex-end">
              <Button 
                colorScheme="red" 
                onClick={handleSalir}
                size={["md", "md"]}
                px={[4, 5, 6]}
                variant="outline"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                Salir
              </Button>
            </HStack>
          </CardFooter>
        </Card>
      </Box>
      
      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={handleCancelDelete}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(2px)">
          <AlertDialogContent borderRadius="xl" boxShadow="2xl" mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" borderBottomWidth="1px" pb={4}>
              <Flex align="center">
                <DeleteIcon mr={2} />
                Eliminar Empleado
              </Flex>
            </AlertDialogHeader>
            
            <AlertDialogBody pt={5}>
              {tieneRutasAsignadas ? (
                <>
                  <Text mb={2} color="red.600" fontWeight="bold">
                    No es posible eliminar al empleado:
                  </Text>
                  <Text fontWeight="bold" mb={4} fontSize="lg">
                    {empleadoAEliminar?.nombre} {empleadoAEliminar?.apellido_paterno} {empleadoAEliminar?.apellido_materno}
                  </Text>
                  <Text mb={4}>
                    El empleado tiene las siguientes rutas asignadas:
                  </Text>
                  <Box 
                    p={3} 
                    borderWidth="1px" 
                    borderRadius="md" 
                    borderColor="red.200" 
                    bg="red.50"
                    mb={4}
                  >
                    {rutasAsignadas.map(ruta => (
                      <Text key={ruta.id} py={1} borderBottomWidth={rutasAsignadas.indexOf(ruta) !== rutasAsignadas.length - 1 ? "1px" : "0"}>
                        {ruta.nombre} ({ruta.nombre_ciudad})
                      </Text>
                    ))}
                  </Box>
                  <Text color="red.600">
                    Debe reasignar estas rutas a otros empleados antes de poder eliminar a este empleado.
                  </Text>
                </>
              ) : (
                <>
                  <Text mb={2}>¿Está seguro que desea eliminar al empleado:</Text>
                  <Text fontWeight="bold" mb={4} fontSize="lg">
                    {empleadoAEliminar?.nombre} {empleadoAEliminar?.apellido_paterno} {empleadoAEliminar?.apellido_materno}
                  </Text>
                  <Text color="red.600">Esta acción no se puede deshacer.</Text>
                </>
              )}
            </AlertDialogBody>
            
            <AlertDialogFooter py={4}>
              <Button 
                ref={cancelDeleteRef} 
                onClick={handleCancelDelete}
                size="md"
                variant="outline"
              >
                Cancelar
              </Button>
              {!tieneRutasAsignadas && (
                <Button 
                  colorScheme="red" 
                  onClick={handleConfirmDelete} 
                  ml={3}
                  size="md"
                  leftIcon={<DeleteIcon />}
                >
                  Eliminar
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Diálogo de confirmación de salida */}
      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelExitRef}
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
                <Button ref={cancelExitRef} onClick={handleCancelExit} size="md">
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
      
      {/* Modal de edición */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={handleCancelEdit} 
        size="lg"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent borderRadius="xl" boxShadow="2xl">
          <ModalHeader bg={headerBg} borderTopRadius="xl" pb={4}>
            <Flex align="center">
              <EditIcon mr={2} />
              Modificar Empleado
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6} pt={6}>
            {formError && (
              <Box 
                p={3} 
                bg="red.50" 
                borderRadius="md" 
                mb={4}
                borderLeft="4px" 
                borderColor="red.500"
              >
                <Text color="red.600" fontWeight="medium">{formError}</Text>
              </Box>
            )}
            
            <FormControl mb={5} isDisabled>
              <FormLabel fontWeight="medium">Ciudad</FormLabel>
              <Input 
                value={empleadoEnEdicion?.nombre_ciudad || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isDisabled>
              <FormLabel fontWeight="medium">Nombre</FormLabel>
              <Input 
                value={empleadoEnEdicion?.nombre || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isDisabled>
              <FormLabel fontWeight="medium">Apellido Paterno</FormLabel>
              <Input 
                value={empleadoEnEdicion?.apellido_paterno || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isDisabled>
              <FormLabel fontWeight="medium">Apellido Materno</FormLabel>
              <Input 
                value={empleadoEnEdicion?.apellido_materno || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isInvalid={!!fechaError}>
              <FormLabel fontWeight="medium">Fecha de Nacimiento</FormLabel>
              <Input 
                type="date"
                ref={fechaNacimientoRef}
                value={fechaNacimientoEdit} 
                onChange={handleFechaNacimientoEditChange}
                bg="white"
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                h="45px"
                max={new Date().toISOString().split('T')[0]}
                onClick={(e) => (e.target as HTMLInputElement).showPicker()}
              />
              {fechaError && (
                <FormErrorMessage>{fechaError}</FormErrorMessage>
              )}
            </FormControl>
            
            <FormControl isInvalid={!!sueldoError}>
              <FormLabel fontWeight="medium">Sueldo</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  color='gray.500'
                  fontSize='1.2em'
                  children='$'
                />
                <Input 
                  type="number"
                  ref={sueldoRef}
                  value={sueldoEdit} 
                  onChange={handleSueldoEditChange}
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.300' }}
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                  h="45px"
                  pl={8}
                  step="0.01"
                  min="0"
                />
              </InputGroup>
              {sueldoError && (
                <FormErrorMessage>{sueldoError}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          
          <ModalFooter bg="gray.50" borderBottomRadius="xl" pt={4}>
            <Button 
              onClick={handleCancelEdit}
              variant="outline"
              mr={3}
              size="md"
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleConfirmEdit}
              size="md"
              leftIcon={<EditIcon />}
              isDisabled={!!fechaError || !!sueldoError}
            >
              Actualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default BusquedaEmpleados 