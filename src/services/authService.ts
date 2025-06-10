// Tipos para el usuario y la respuesta de login
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Servicio de autenticación
export const authService = {
  // Función para iniciar sesión
  login: async (correo: string, contraseña: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
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

    // Guardar el token y la información del usuario en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));

    return data;
  },

  // Función para cerrar sesión
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Redireccionar a la página de login si es necesario
    window.location.href = '/login';
  },

  // Función para verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return localStorage.getItem('token') !== null;
  },

  // Función para obtener el token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Función para obtener la información del usuario
  getUsuario: (): Usuario | null => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },
};

export default authService; 