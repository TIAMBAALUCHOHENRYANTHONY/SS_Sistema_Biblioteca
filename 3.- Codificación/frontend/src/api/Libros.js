import axios from 'axios';

const baseURL = 'http://localhost:8000'; // La URL base de tu servidor FastAPI

// Clave de cifrado generada en el servidor
const key = '6A2VDZYE6tswbrP476M89Qoktl2Is9wTXuzIB-dCntY=';

const decryptData = (encryptedData) => {
    // Crea una instancia de Fernet utilizando la clave
    const cipher = new Fernet(key);
    try {
        // Desencripta los datos
        const decryptedData = cipher.decrypt(encryptedData);
        // Devuelve los datos desencriptados como una cadena UTF-8
        return decryptedData.toString('utf-8');
    } catch (error) {
        console.error('Error al desencriptar los datos:', error);
        return null; // Devuelve null si hay un error en la desencriptación
    }
};

// Función para obtener todos los libros
export const obtenerLibros = async () => {
    try {
        const response = await axios.get(`${baseURL}/libros/`);
        console.log(response.data);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener libros:', error);
        throw error;
    }
};

// Función para crear un libro
export const crearLibro = async (libro) => {
    try {
        const response = await axios.post(`${baseURL}/libro/`, libro);
        return response.data;
    } catch (error) {
        console.error('Error al crear libro:', error);
        throw error;
    }
};

// Función para obtener un libro por su ID
export const obtenerLibroPorId = async (libroId) => {
    try {
        const response = await axios.get(`${baseURL}/libros/${libroId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener libro por ID:', error);
        throw error;
    }
};

// Función para obtener libros por estado
export const obtenerLibrosPorEstado = async (estado) => {
    try {
        const response = await axios.get(`${baseURL}/libros/estado/${estado}`);
        console.log(response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener libros por estado:', error);
        throw error;
    }
};

// Función para actualizar un libro
export const actualizarLibro = async (libroId, libro) => {
    try {
        const response = await axios.put(`${baseURL}/libros/${libroId}`, libro);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar libro:', error);
        throw error;
    }
};

// Función para actualizar el estado de un libro
export const actualizarEstadoLibro = async (libroId, estado) => {
    try {
        const response = await axios.put(`${baseURL}/libros/${libroId}/estado?estado=${estado}`);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar estado del libro:', error);
        throw error;
    }
};

// Función para eliminar un libro
export const eliminarLibro = async (libroId) => {
    try {
        const response = await axios.delete(`${baseURL}/libros/${libroId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar libro:', error);
        throw error;
    }
};

// Función para obtener libros por título
export const obtenerLibrosPorTitulo = async (titulo) => {
    try {
        const response = await axios.get(`${baseURL}/libros/titulo/?titulo=${titulo}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener libros por título:', error);
        throw error;
    }
};

// Función para obtener libros por autor
export const obtenerLibrosPorAutor = async (autor) => {
    try {
        const response = await axios.get(`${baseURL}/libros/autor/?autor=${autor}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener libros por autor:', error);
        throw error;
    }
};