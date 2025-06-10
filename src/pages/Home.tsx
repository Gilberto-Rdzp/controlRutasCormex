import {
  Box,
  Heading,
  SimpleGrid,
  Button,
  VStack,
  Flex,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  Icon,
  Stack,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiTruck, FiSearch, FiUserPlus } from 'react-icons/fi'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [userName, setUserName] = useState('Usuario')
  const fontSize = useBreakpointValue({ base: "lg", md: "2xl" })
  const padding = useBreakpointValue({ base: 4, md: 8 })
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" })

  useEffect(() => {
    // Obtener datos del usuario del localStorage
    const usuarioData = localStorage.getItem('usuario')
    if (usuarioData) {
      try {
        const usuario = JSON.parse(usuarioData)
        // Usar el nombre del usuario si está disponible, o el correo como alternativa
        setUserName(usuario.nombre || usuario.correo || 'Usuario')
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    
    // Mostrar mensaje de éxito
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    
    // Redireccionar al login
    navigate('/')
  }

  return (
    <Box bg="white" boxShadow="sm" width="100%">
      <Flex 
        py={padding}
        px={padding}
        justify="space-between" 
        align="center" 
        width="100%"
      >
        <Text fontSize={fontSize} fontWeight="bold" color="blue.600">
          Cormex
        </Text>
        <Menu>
          <MenuButton>
            <Flex align="center" gap={2}>
              <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                {userName}
              </Text>
              <Avatar size={avatarSize} name={userName} bg="blue.500" />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
}

export const Home = () => {
  const navigate = useNavigate()
  const columns = useBreakpointValue({ base: 1, md: 2 })
  const spacing = useBreakpointValue({ base: 4, md: 8 })
  const buttonPadding = useBreakpointValue({ base: 6, md: 8 })
  const iconSize = useBreakpointValue({ base: 6, md: 8 })
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" })
  const descriptionSize = useBreakpointValue({ base: "sm", md: "md" })
  const buttonGap = useBreakpointValue({ base: 2, md: 4 })
  const buttonStackSpacing = useBreakpointValue({ base: 1, md: 2 })
  const titleFontSize = useBreakpointValue({ base: "md", md: "xl" })
  const descFontSize = useBreakpointValue({ base: "xs", md: "sm" })

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
    }
  }, [navigate])

  const menuItems = [
    {
      title: 'Alta de Rutas',
      description: 'Registra nuevas rutas en el sistema',
      icon: FiTruck,
      path: '/rutas/alta',
      color: 'blue'
    },
    {
      title: 'Búsqueda de Rutas',
      description: 'Consulta y gestiona rutas existentes',
      icon: FiSearch,
      path: '/rutas/busqueda',
      color: 'green'
    },
    {
      title: 'Alta de Empleados',
      description: 'Registra nuevos empleados',
      icon: FiUserPlus,
      path: '/empleados/alta',
      color: 'purple'
    },
    {
      title: 'Búsqueda de Empleados',
      description: 'Consulta y gestiona empleados',
      icon: FiUser,
      path: '/empleados/busqueda',
      color: 'teal'
    }
  ]

  return (
    <Box width="100vw" minH="100vh" bg="gray.50">
      <Navbar />
      <Box width="100%" p={4}>
        <Stack spacing={8} width="100%">
          <Box textAlign="center" width="100%">
            <Heading 
              size={headingSize} 
              mb={4}
            >
              Bienvenido al Sistema de Control de Rutas
            </Heading>
            <Text 
              fontSize={descriptionSize} 
              color="gray.600"
            >
              Selecciona una opción para comenzar
            </Text>
          </Box>

          <SimpleGrid 
            columns={columns} 
            spacing={spacing}
            width="100%"
          >
            {menuItems.map((item) => (
              <Button
                key={item.path}
                height="auto"
                p={buttonPadding}
                onClick={() => navigate(item.path)}
                colorScheme={item.color}
                display="flex"
                flexDirection="column"
                alignItems="center"
                textAlign="center"
                gap={buttonGap}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg'
                }}
                transition="all 0.2s"
                width="100%"
              >
                <Icon as={item.icon} boxSize={iconSize} />
                <VStack spacing={buttonStackSpacing} width="100%">
                  <Text 
                    fontSize={titleFontSize}
                    fontWeight="bold"
                  >
                    {item.title}
                  </Text>
                  <Text 
                    fontSize={descFontSize}
                    opacity={0.9}
                  >
                    {item.description}
                  </Text>
                </VStack>
              </Button>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
    </Box>
  )
}

export default Home 