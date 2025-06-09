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
  Badge,
  Icon
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, CloseIcon, SearchIcon, RepeatIcon } from '@chakra-ui/icons'
import { rutasApi, ciudadesApi, empleadosApi } from '../../services/api'
import type { Ruta, Ciudad, Empleado } from '../../services/api'

export const BusquedaRutas = () => {
  // Estados para filtrado y listado
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('')
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [rutasFiltradas, setRutasFiltradas] = useState<Ruta[]>([])
  const [filtroRuta, setFiltroRuta] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para eliminación
  const [rutaAEliminar, setRutaAEliminar] = useState<Ruta | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const cancelDeleteRef = useRef<HTMLButtonElement>(null)
  
  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [rutaEnEdicion, setRutaEnEdicion] = useState<Ruta | null>(null)
  const [choferes, setChoferes] = useState<Empleado[]>([])
  const [tipoEdit, setTipoEdit] = useState<string>('')
  const [choferEdit, setChoferEdit] = useState<string>('')
  const [capacidadEdit, setCapacidadEdit] = useState<string>('')
  const [capacidadError, setCapacidadError] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  
  // Estados para diálogo de salida
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
  const cancelExitRef = useRef<HTMLButtonElement>(null)
  
  // Referencias
  const capacidadRef = useRef<HTMLInputElement>(null)
  const choferRef = useRef<HTMLSelectElement>(null)
  const tipoRef = useRef<HTMLSelectElement>(null)
  
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
  
  // Tipos de servicio
  const tiposServicio = [
    { id: 'Personal', nombre: 'PERSONAL', capacidadMaxima: 34 },
    { id: 'Artículos', nombre: 'ARTÍCULOS', capacidadMaxima: 100 }
  ]
  
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
  
  // Cargar rutas cuando cambia la ciudad seleccionada
  const fetchRutas = async (idCiudad: string) => {
    if (!idCiudad) return
    
    setLoading(true)
    try {
      const rutasData = await rutasApi.getRutasPorCiudad(parseInt(idCiudad))
      setRutas(rutasData)
      setRutasFiltradas(rutasData)
      setError(null)
    } catch (err) {
      console.error('Error al cargar rutas:', err)
      setError('No se pudieron cargar las rutas para la ciudad seleccionada. Verifique su conexión e intente nuevamente.')
      setRutas([])
      setRutasFiltradas([])
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (ciudadSeleccionada) {
      fetchRutas(ciudadSeleccionada)
    } else {
      setRutas([])
      setRutasFiltradas([])
    }
  }, [ciudadSeleccionada])
  
  // Filtrar rutas por nombre
  useEffect(() => {
    if (filtroRuta.trim() === '') {
      setRutasFiltradas(rutas)
    } else {
      const rutasFiltradas = rutas.filter(ruta => 
        ruta.nombre.toLowerCase().includes(filtroRuta.toLowerCase())
      )
      setRutasFiltradas(rutasFiltradas)
    }
  }, [filtroRuta, rutas])
  
  // Manejar cambio de ciudad
  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCiudadSeleccionada(e.target.value)
    setFiltroRuta('')
  }
  
  // Manejar cambio en filtro de ruta
  const handleFiltroRutaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroRuta(e.target.value)
  }
  
  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    setCiudadSeleccionada('')
    setFiltroRuta('')
  }
  
  // Abrir diálogo de confirmación de eliminación
  const handleOpenDeleteDialog = (ruta: Ruta) => {
    setRutaAEliminar(ruta)
    setIsDeleteDialogOpen(true)
  }
  
  // Cancelar eliminación
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setRutaAEliminar(null)
  }
  
  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!rutaAEliminar) return
    
    try {
      await rutasApi.delete(rutaAEliminar.id)
      
      // Actualizar estado local
      const nuevasRutas = rutas.filter(ruta => ruta.id !== rutaAEliminar.id)
      setRutas(nuevasRutas)
      setRutasFiltradas(
        rutasFiltradas.filter(ruta => ruta.id !== rutaAEliminar.id)
      )
      
      toast({
        title: 'Ruta eliminada',
        description: `La ruta ${rutaAEliminar.nombre} ha sido eliminada correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error al eliminar ruta:', err)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la ruta. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setRutaAEliminar(null)
    }
  }
  
  // Obtener capacidad máxima según el tipo seleccionado
  const getCapacidadMaxima = (tipo: string) => {
    const tipoSeleccionado = tiposServicio.find(t => t.id === tipo)
    return tipoSeleccionado?.capacidadMaxima || 0
  }
  
  // Manejar cambio en capacidad durante edición
  const handleCapacidadEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numero = parseInt(value)
    
    if (value === '') {
      setCapacidadEdit('')
      setCapacidadError('')
      return
    }
    
    if (isNaN(numero) || numero <= 0) {
      setCapacidadError('La capacidad debe ser mayor a cero')
      return
    }
    
    const capacidadMaxima = getCapacidadMaxima(tipoEdit)
    if (capacidadMaxima > 0 && numero > capacidadMaxima) {
      setCapacidadError(`La capacidad máxima para ${tipoEdit === 'Personal' ? 'Personal' : 'Artículos'} es ${capacidadMaxima}`)
      return
    }
    
    setCapacidadEdit(value)
    setCapacidadError('')
  }
  
  // Manejar cambio de tipo durante edición
  const handleTipoEditChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoEdit(e.target.value)
    setCapacidadEdit('')
    setCapacidadError('')
  }
  
  // Cargar choferes cuando se abre el modal de edición
  const cargarChoferes = async (ciudadId: number) => {
    try {
      const choferesData = await empleadosApi.getChoferesPorCiudad(ciudadId)
      setChoferes(choferesData)
    } catch (err) {
      console.error('Error al cargar choferes:', err)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los choferes. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setChoferes([])
    }
  }
  
  // Abrir modal de edición
  const handleOpenEditModal = async (ruta: Ruta) => {
    setRutaEnEdicion(ruta)
    setTipoEdit(ruta.tipo)
    setChoferEdit(ruta.id_empleado.toString())
    setCapacidadEdit(ruta.capacidad.toString())
    
    // Cargar choferes para la ciudad de la ruta
    await cargarChoferes(ruta.id_ciudad)
    
    setIsEditModalOpen(true)
  }
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setRutaEnEdicion(null)
    setTipoEdit('')
    setChoferEdit('')
    setCapacidadEdit('')
    setCapacidadError('')
    setFormError('')
  }
  
  // Validar formulario de edición
  const validarFormularioEdicion = () => {
    if (!tipoEdit) {
      setFormError('Debe seleccionar un tipo de servicio')
      tipoRef.current?.focus()
      return false
    }
    
    if (!choferEdit) {
      setFormError('Debe seleccionar un chofer')
      choferRef.current?.focus()
      return false
    }
    
    if (!capacidadEdit) {
      setFormError('Debe ingresar una capacidad')
      capacidadRef.current?.focus()
      return false
    }
    
    if (capacidadError) {
      capacidadRef.current?.focus()
      return false
    }
    
    return true
  }
  
  // Confirmar edición
  const handleConfirmEdit = async () => {
    if (!rutaEnEdicion) return
    
    if (!validarFormularioEdicion()) {
      return
    }
    
    try {
      const rutaActualizada = await rutasApi.update(rutaEnEdicion.id, {
        nombre: rutaEnEdicion.nombre,
        tipo: tipoEdit as 'Personal' | 'Artículos',
        capacidad: parseInt(capacidadEdit),
        id_ciudad: rutaEnEdicion.id_ciudad,
        id_empleado: parseInt(choferEdit)
      })
      
      // Actualizar estado local
      const nuevasRutas = rutas.map(ruta => 
        ruta.id === rutaEnEdicion.id ? rutaActualizada : ruta
      )
      setRutas(nuevasRutas)
      setRutasFiltradas(
        rutasFiltradas.map(ruta => 
          ruta.id === rutaEnEdicion.id ? rutaActualizada : ruta
        )
      )
      
      toast({
        title: 'Ruta actualizada',
        description: `La ruta ${rutaEnEdicion.nombre} ha sido actualizada correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      handleCancelEdit()
    } catch (err) {
      console.error('Error al actualizar ruta:', err)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la ruta. Por favor, intente nuevamente.',
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
            <Heading size="lg" textAlign="center">Búsqueda de Rutas</Heading>
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
                      >
                        {ciudades.map(ciudad => (
                          <option key={ciudad.id} value={ciudad.id.toString()}>
                            {ciudad.nombre}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl w={{ base: '100%', md: '300px' }}>
                      <FormLabel fontWeight="medium">Ruta</FormLabel>
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
                      leftIcon={<CloseIcon />}
                      h="45px"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                      transition="all 0.2s"
                    >
                      Eliminar Filtros
                    </Button>
                  </Flex>
                </Box>
                
                {/* Tabla de rutas */}
                {ciudadSeleccionada ? (
                  <>
                    <Box mb={3}>
                      <Text fontSize="lg" fontWeight="medium" color="gray.700">
                        Resultados: {rutasFiltradas.length} {rutasFiltradas.length === 1 ? 'ruta encontrada' : 'rutas encontradas'}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Seleccione una ruta para modificar o eliminar
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
                            <Th>Tipo</Th>
                            <Th>Capacidad</Th>
                            <Th width="100px" textAlign="center">Modificar</Th>
                            <Th width="100px" textAlign="center">Eliminar</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {rutasFiltradas.length > 0 ? (
                            rutasFiltradas.map(ruta => (
                              <Tr 
                                key={ruta.id}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                              >
                                <Td fontWeight="medium">{ruta.id}</Td>
                                <Td>{ruta.nombre}</Td>
                                <Td>
                                  <Badge 
                                    colorScheme={ruta.tipo === 'Personal' ? 'green' : 'purple'}
                                    py={1}
                                    px={2}
                                    borderRadius="md"
                                  >
                                    {ruta.tipo}
                                  </Badge>
                                </Td>
                                <Td>{ruta.capacidad}</Td>
                                <Td textAlign="center">
                                  <IconButton
                                    aria-label="Modificar ruta"
                                    icon={<EditIcon />}
                                    colorScheme="blue"
                                    size="sm"
                                    onClick={() => handleOpenEditModal(ruta)}
                                    _hover={{ transform: 'scale(1.1)' }}
                                    transition="all 0.2s"
                                  />
                                </Td>
                                <Td textAlign="center">
                                  <IconButton
                                    aria-label="Eliminar ruta"
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="sm"
                                    onClick={() => handleOpenDeleteDialog(ruta)}
                                    _hover={{ transform: 'scale(1.1)' }}
                                    transition="all 0.2s"
                                  />
                                </Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td colSpan={6} textAlign="center" py={6}>
                                <Text color="gray.500">No se encontraron rutas</Text>
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
                      Seleccione una ciudad para ver las rutas
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
                Eliminar Ruta
              </Flex>
            </AlertDialogHeader>
            
            <AlertDialogBody pt={5}>
              <Text mb={2}>¿Está seguro que desea eliminar la ruta:</Text>
              <Text fontWeight="bold" mb={4} fontSize="lg">{rutaAEliminar?.nombre}</Text>
              <Text color="red.600">Esta acción no se puede deshacer.</Text>
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
              <Button 
                colorScheme="red" 
                onClick={handleConfirmDelete} 
                ml={3}
                size="md"
                leftIcon={<DeleteIcon />}
              >
                Eliminar
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
              Modificar Ruta
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
                value={rutaEnEdicion?.nombre_ciudad || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isDisabled>
              <FormLabel fontWeight="medium">Nombre de Ruta</FormLabel>
              <Input 
                value={rutaEnEdicion?.nombre || ''} 
                readOnly 
                bg="gray.50"
                borderColor={borderColor}
                h="45px"
              />
            </FormControl>
            
            <FormControl mb={5} isRequired>
              <FormLabel fontWeight="medium">Tipo</FormLabel>
              <Select
                ref={tipoRef}
                value={tipoEdit}
                onChange={handleTipoEditChange}
                bg="white"
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                h="45px"
              >
                <option value="">Seleccione</option>
                {tiposServicio.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={5} isRequired>
              <FormLabel fontWeight="medium">Chofer</FormLabel>
              <Select
                ref={choferRef}
                value={choferEdit}
                onChange={(e) => setChoferEdit(e.target.value)}
                bg="white"
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                h="45px"
              >
                <option value="">Seleccione</option>
                {choferes.map(chofer => (
                  <option key={chofer.id} value={chofer.id.toString()}>
                    {`${chofer.nombre} ${chofer.apellido_paterno} ${chofer.apellido_materno}`}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={4} isRequired isInvalid={!!capacidadError}>
              <FormLabel fontWeight="medium">Capacidad</FormLabel>
              <Input
                ref={capacidadRef}
                type="number"
                value={capacidadEdit}
                onChange={handleCapacidadEditChange}
                bg="white"
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.300' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
                h="45px"
              />
              {capacidadError && (
                <FormErrorMessage>{capacidadError}</FormErrorMessage>
              )}
              {tipoEdit && (
                <Text fontSize="sm" color="blue.600" mt={1}>
                  Capacidad máxima: {getCapacidadMaxima(tipoEdit)}
                </Text>
              )}
            </FormControl>
          </ModalBody>
          
          <ModalFooter bg="gray.50" borderBottomRadius="xl">
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleConfirmEdit}
              leftIcon={<span role="img" aria-label="check">✓</span>}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Aceptar
            </Button>
            <Button 
              onClick={handleCancelEdit}
              variant="outline"
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
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
    </Box>
  )
}

export default BusquedaRutas 