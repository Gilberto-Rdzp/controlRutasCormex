import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Flex,
  Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

// Importar la imagen de logo (asumiendo que existe)
import logo from '../assets/logo.png';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!correo || !contraseña) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese su correo y contraseña',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contraseña }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      // Guardar el token en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      
      toast({
        title: 'Éxito',
        description: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redireccionar al dashboard o página principal
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al iniciar sesión',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      minHeight="100vh" 
      width="100%" 
      align="center" 
      justify="center"
      bg="gray.50"
      overflow="hidden"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
    >
      <Center w="100%" h="100%">
        <Box
          py="8"
          px={{ base: '6', md: '10' }}
          bg="white"
          boxShadow="xl"
          borderRadius="xl"
          w={{ base: "90%", sm: "450px" }}
          mx="auto"
        >
          <VStack spacing="6" align="center">
            <Image src={logo} alt="Logo Cormex" maxW="200px" />
            <Heading size="lg">Control de Rutas Cormex</Heading>
            <Text>Inicie sesión para continuar</Text>
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing="6" align="flex-start" w="full">
                <FormControl id="correo" isRequired>
                  <FormLabel>Correo electrónico</FormLabel>
                  <Input 
                    type="email" 
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </FormControl>
                
                <FormControl id="contraseña" isRequired>
                  <FormLabel>Contraseña</FormLabel>
                  <InputGroup>
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={contraseña}
                      onChange={(e) => setContraseña(e.target.value)}
                      placeholder="••••••••"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  w="full"
                >
                  Iniciar sesión
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Center>
    </Flex>
  );
};

export default Login; 