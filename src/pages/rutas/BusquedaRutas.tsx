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
  HStack
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, CloseIcon } from '@chakra-ui/icons'
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
  
  const toast = useToast()
  
  // Tipos de servicio
  const tiposServicio = [
    { id: 'Personal', nombre: 'PERSONAL', capacidadMaxima: 34 },
    { id: 'Artículos', nombre: 'ARTÍCULOS', capacidadMaxima: 100 }
  ]
  
  // Cargar ciudades al montar el componente
  useEffect(() => {
    const fetchCiudades = async () => {
      setLoading(true)
      try {
        const ciudadesData = await ciudadesApi.getAll()
        setCiudades(ciudadesData)
        setError(null)
      } catch (err) {
        console.error('Error al cargar ciudades:', err)
        setError('Error al cargar ciudades. Por favor, intente nuevamente.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCiudades()
  }, [])
  
  // Cargar rutas cuando cambia la ciudad seleccionada
  useEffect(() => {
    if (ciudadSeleccionada) {
      const fetchRutas = async () => {
        setLoading(true)
        try {
          const rutasData = await rutasApi.getRutasPorCiudad(parseInt(ciudadSeleccionada))
          setRutas(rutasData)
          setRutasFiltradas(rutasData)
          setError(null)
        } catch (err) {
          console.error('Error al cargar rutas:', err)
          setError('Error al cargar rutas. Por favor, intente nuevamente.')
          setRutas([])
          setRutasFiltradas([])
        } finally {
          setLoading(false)
        }
      }
      
      fetchRutas()
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
    <Box p={8}>
      <Heading mb={6}>Búsqueda de Rutas</Heading>
      
      {loading && !error && (
        <Center my={10}>
          <Spinner size="xl" />
        </Center>
      )}
      
      {error && (
        <Box p={4} bg="red.100" borderRadius="md" mb={6}>
          <Text color="red.600">{error}</Text>
        </Box>
      )}
      
      {!loading && !error && (
        <>
          {/* Filtros */}
          <Flex mb={6} wrap="wrap" gap={4} align="flex-end">
            <FormControl w={{ base: '100%', md: '250px' }}>
              <FormLabel>Ciudad</FormLabel>
              <Select 
                placeholder="Seleccione"
                value={ciudadSeleccionada}
                onChange={handleCiudadChange}
              >
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id.toString()}>
                    {ciudad.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl w={{ base: '100%', md: '250px' }}>
              <FormLabel>Ruta</FormLabel>
              <Input 
                placeholder="Filtrar por nombre"
                value={filtroRuta}
                onChange={handleFiltroRutaChange}
                isDisabled={!ciudadSeleccionada}
              />
            </FormControl>
            
            <Button 
              colorScheme="red"
              onClick={handleLimpiarFiltros}
              leftIcon={<CloseIcon />}
            >
              Eliminar Filtros
            </Button>
          </Flex>
          
          {/* Tabla de rutas */}
          {ciudadSeleccionada && (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Nombre</Th>
                    <Th>Tipo</Th>
                    <Th>Capacidad</Th>
                    <Th>Modificar</Th>
                    <Th>Eliminar</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {rutasFiltradas.length > 0 ? (
                    rutasFiltradas.map(ruta => (
                      <Tr key={ruta.id}>
                        <Td>{ruta.id}</Td>
                        <Td>{ruta.nombre}</Td>
                        <Td>{ruta.tipo}</Td>
                        <Td>{ruta.capacidad}</Td>
                        <Td>
                          <IconButton
                            aria-label="Modificar ruta"
                            icon={<EditIcon />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleOpenEditModal(ruta)}
                          />
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Eliminar ruta"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(ruta)}
                          />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        No se encontraron rutas
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
          
          {!ciudadSeleccionada && (
            <Box p={4} bg="blue.50" borderRadius="md">
              <Text align="center">Seleccione una ciudad para ver las rutas</Text>
            </Box>
          )}
          
          <HStack mt={6} justify="flex-end">
            <Button colorScheme="red" onClick={handleSalir}>
              Salir
            </Button>
          </HStack>
        </>
      )}
      
      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={handleCancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Ruta
            </AlertDialogHeader>
            
            <AlertDialogBody>
              ¿Está seguro que desea eliminar la ruta "{rutaAEliminar?.nombre}"?
              Esta acción no se puede deshacer.
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={cancelDeleteRef} onClick={handleCancelDelete}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Modal de edición */}
      <Modal isOpen={isEditModalOpen} onClose={handleCancelEdit} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modificar Ruta</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            {formError && (
              <Box p={3} bg="red.100" borderRadius="md" mb={4}>
                <Text color="red.600">{formError}</Text>
              </Box>
            )}
            
            <FormControl mb={4} isDisabled>
              <FormLabel>Ciudad</FormLabel>
              <Input value={rutaEnEdicion?.nombre_ciudad || ''} readOnly />
            </FormControl>
            
            <FormControl mb={4} isDisabled>
              <FormLabel>Nombre de Ruta</FormLabel>
              <Input value={rutaEnEdicion?.nombre || ''} readOnly />
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>Tipo</FormLabel>
              <Select
                ref={tipoRef}
                value={tipoEdit}
                onChange={handleTipoEditChange}
              >
                <option value="">Seleccione</option>
                {tiposServicio.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl mb={4} isRequired>
              <FormLabel>Chofer</FormLabel>
              <Select
                ref={choferRef}
                value={choferEdit}
                onChange={(e) => setChoferEdit(e.target.value)}
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
              <FormLabel>Capacidad</FormLabel>
              <Input
                ref={capacidadRef}
                type="number"
                value={capacidadEdit}
                onChange={handleCapacidadEditChange}
              />
              {capacidadError && (
                <FormErrorMessage>{capacidadError}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleConfirmEdit}>
              Aceptar
            </Button>
            <Button onClick={handleCancelEdit}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Diálogo de confirmación de salida */}
      <AlertDialog
        isOpen={isExitDialogOpen}
        leastDestructiveRef={cancelExitRef}
        onClose={handleCancelExit}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Salir
            </AlertDialogHeader>
            
            <AlertDialogBody>
              ¿Está seguro que desea salir? Los cambios no guardados se perderán.
            </AlertDialogBody>
            
            <AlertDialogFooter>
              <Button ref={cancelExitRef} onClick={handleCancelExit}>
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

export default BusquedaRutas 