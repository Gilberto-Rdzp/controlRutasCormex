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
  Stack
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiTruck, FiSearch, FiUserPlus } from 'react-icons/fi'

const Navbar = () => {
  const fontSize = useBreakpointValue({ base: "lg", md: "2xl" })
  const padding = useBreakpointValue({ base: 4, md: 8 })
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" })

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
            <Avatar size={avatarSize} name="Gilberto" bg="blue.500" />
          </MenuButton>
          <MenuList>
            <MenuItem>Perfil</MenuItem>
            <MenuItem>Configuración</MenuItem>
            <MenuItem>Cerrar Sesión</MenuItem>
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