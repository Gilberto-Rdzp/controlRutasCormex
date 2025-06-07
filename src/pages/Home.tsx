import { Box, Heading, SimpleGrid, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <Box p={8}>
      <VStack spacing={8}>
        <Heading>Sistema de Control de Rutas - Cormex</Heading>
        <SimpleGrid columns={2} spacing={8} width="100%" maxW="800px">
          <Button
            size="lg"
            height="200px"
            onClick={() => navigate('/rutas/alta')}
            colorScheme="blue"
          >
            Alta de Rutas
          </Button>
          <Button
            size="lg"
            height="200px"
            onClick={() => navigate('/rutas/busqueda')}
            colorScheme="green"
          >
            Búsqueda de Rutas
          </Button>
          <Button
            size="lg"
            height="200px"
            onClick={() => navigate('/empleados/alta')}
            colorScheme="purple"
          >
            Alta de Empleados
          </Button>
          <Button
            size="lg"
            height="200px"
            onClick={() => navigate('/empleados/busqueda')}
            colorScheme="teal"
          >
            Búsqueda de Empleados
          </Button>
        </SimpleGrid>
      </VStack>
    </Box>
  )
}

export default Home 