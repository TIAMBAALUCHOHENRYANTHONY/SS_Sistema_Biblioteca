import axios from 'axios';

const baseURL = 'http://localhost:8000';  // URL base de tu servidor FastAPI

// Función para crear un nuevo préstamo
export const crearPrestamo = async (prestamo) => {
  try {
    const response = await axios.post(`${baseURL}/prestamos/`, prestamo);
    return response.data;
  } catch (error) {
    console.error('Error al crear préstamo:', error);
    throw error;
  }
};

// Función para obtener un préstamo por su ID
export const obtenerPrestamo = async (prestamoId) => {
  try {
    const response = await axios.get(`${baseURL}/prestamos/${prestamoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener préstamo:', error);
    throw error;
  }
};

// Función para eliminar un préstamo por su ID
export const eliminarPrestamo = async (prestamoId) => {
  try {
    const response = await axios.delete(`${baseURL}/prestamos/${prestamoId}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    throw error;
  }
};

export const obtenerPrestamos = async () => {
    try {
      const response = await axios.get(`${baseURL}/prestamos/`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      throw error;
    }
  };