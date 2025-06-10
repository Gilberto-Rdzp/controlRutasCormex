// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Interfaces
export interface Ciudad {
  id: number;
  nombre: string;
}

export interface Empleado {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  sueldo: number;
  id_ciudad: number;
  nombre_ciudad?: string;
  activo: boolean;
}

export interface Ruta {
  id: number;
  nombre: string;
  tipo: 'Personal' | 'Artículos';
  capacidad: number;
  id_ciudad: number;
  nombre_ciudad?: string;
  id_empleado: number;
  nombre_chofer?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
}

// API para Ciudades
export const ciudadesApi = {
  getAll: async (): Promise<Ciudad[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades`);
      if (!response.ok) {
        throw new Error('Error al obtener ciudades');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAll ciudades:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Ciudad> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener ciudad');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en getById ciudad ${id}:`, error);
      throw error;
    }
  },

  create: async (ciudad: Omit<Ciudad, 'id'>): Promise<Ciudad> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ciudad),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear ciudad');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create ciudad:', error);
      throw error;
    }
  },

  update: async (id: number, ciudad: Omit<Ciudad, 'id'>): Promise<Ciudad> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ciudad),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar ciudad');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en update ciudad ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ciudades/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar ciudad');
      }
    } catch (error) {
      console.error(`Error en delete ciudad ${id}:`, error);
      throw error;
    }
  },
};

// API para Empleados
export const empleadosApi = {
  getAll: async (): Promise<Empleado[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`);
      if (!response.ok) {
        throw new Error('Error al obtener empleados');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAll empleados:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Empleado> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener empleado');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en getById empleado ${id}:`, error);
      throw error;
    }
  },

  getChoferesPorCiudad: async (ciudadId: number): Promise<Empleado[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/ciudad/${ciudadId}`);
      if (!response.ok) {
        throw new Error('Error al obtener choferes por ciudad');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en getChoferesPorCiudad ${ciudadId}:`, error);
      throw error;
    }
  },

  create: async (empleado: Omit<Empleado, 'id' | 'nombre_ciudad'>): Promise<Empleado> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear empleado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create empleado:', error);
      throw error;
    }
  },

  update: async (id: number, empleado: Omit<Empleado, 'id' | 'nombre_ciudad'>): Promise<Empleado> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empleado),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar empleado');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en update empleado ${id}:`, error);
      throw error;
    }
  },

  cambiarEstado: async (id: number, activo: boolean): Promise<Empleado> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado del empleado');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en cambiarEstado empleado ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/empleados/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar empleado');
      }
    } catch (error) {
      console.error(`Error en delete empleado ${id}:`, error);
      throw error;
    }
  },
};

// API para Rutas
export const rutasApi = {
  getAll: async (): Promise<Ruta[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas`);
      if (!response.ok) {
        throw new Error('Error al obtener rutas');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getAll rutas:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Ruta> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener ruta');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en getById ruta ${id}:`, error);
      throw error;
    }
  },

  getRutasPorCiudad: async (ciudadId: number): Promise<Ruta[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/ciudad/${ciudadId}`);
      if (!response.ok) {
        throw new Error('Error al obtener rutas por ciudad');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en getRutasPorCiudad ${ciudadId}:`, error);
      throw error;
    }
  },

  create: async (ruta: Omit<Ruta, 'id' | 'nombre_ciudad' | 'nombre_chofer' | 'apellido_paterno' | 'apellido_materno'>): Promise<Ruta> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruta),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear ruta');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en create ruta:', error);
      throw error;
    }
  },

  update: async (id: number, ruta: Omit<Ruta, 'id' | 'nombre_ciudad' | 'nombre_chofer' | 'apellido_paterno' | 'apellido_materno'>): Promise<Ruta> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruta),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar ruta');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en update ruta ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/rutas/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar ruta');
      }
    } catch (error) {
      console.error(`Error en delete ruta ${id}:`, error);
      throw error;
    }
  },
}; 