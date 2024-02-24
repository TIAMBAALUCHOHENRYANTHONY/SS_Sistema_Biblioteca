import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerLibros, eliminarLibro, actualizarEstadoLibro, obtenerLibrosPorEstado, obtenerLibrosPorAutor, obtenerLibrosPorTitulo } from '../../api/Libros';
import Navbar from '../Home/Navbar';
import { crearPrestamo } from '../../api/Peticiones';

const LibroTable = (props) => {
    const { permissions } = props;
    const [libros, setLibros] = useState([]);
    const [autor, setAutor] = useState('');
    const [titulo, setTitulo] = useState('');
    const [message, setMessage] = useState(null);
    const [estadoActualizado, setEstadoActualizado] = useState(false);

    const permissionIsIncluded = (permission) => {
        return permissions.includes(permission);
    };

    const isAdmin = permissionIsIncluded('administrador');


    const buscarLibrosPorAutor = async (autor) => {
        try {
            const response = await obtenerLibrosPorAutor(autor);
            setLibros(response.data);
        } catch (error) {
            console.error('Error al obtener libros por autor:', error);
        }
    };

    // Función para obtener libros por título
    const buscarLibrosPorTitulo = async (titulo) => {
        try {
            const response = await obtenerLibrosPorTitulo(titulo);
            setLibros(response.data);
        } catch (error) {
            console.error('Error al obtener libros por título:', error);
        }
    };

    useEffect(() => {
        fetchLibros();
    }, []);

    useEffect(() => {
        if (autor) {
            buscarLibrosPorAutor(autor);
        }
    }, [autor]);

    // Efecto para buscar libros por título cuando cambia el valor del input de título
    useEffect(() => {
        if (titulo) {
            buscarLibrosPorTitulo(titulo);
        }
    }, [titulo]);

    const fetchLibros = async () => {
        try {
            const librosData = await obtenerLibros();
            setLibros(librosData);
        } catch (error) {
            console.error('Error al obtener libros:', error);
        }
    };

    const handleSolicitarLibro = async (libroId) => {
        try {
            await actualizarEstadoLibro(libroId, 'Solicitado');
            const fechaPrestamo = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD
            const fechaDevolucion = new Date(); // Crear un nuevo objeto de fecha
            fechaDevolucion.setDate(fechaDevolucion.getDate() + 2); // Sumarle 2 días a la fecha de préstamo
            const fechaDevolucionFormateada = fechaDevolucion.toISOString().split('T')[0]; // Obtener la fecha de devolución en formato YYYY-MM-DD
            const prestamo = {
                libro_id: libroId,
                fecha_prestamo: fechaPrestamo,
                fecha_devolucion: fechaDevolucionFormateada
            };
            await crearPrestamo(prestamo);
            setEstadoActualizado(true);
            const url = new URL('/libros', window.location.origin);
            url.searchParams.append('message', 'Petición realizada');
            window.location.href = url.toString();
        } catch (error) {
            console.error('Error al solicitar el libro:', error);
            // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
        }
    };


    const handleDeleteLibro = async (libroId) => {
        try {
            await eliminarLibro(libroId);
            setLibros(libros.filter((libro) => libro.libro_id !== libroId));
            setMessage('Libro eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            setMessage('Ha ocurrido un error al intentar eliminar el libro');
        }
    };

    const handleAddPermission = () => {
        window.location.href = "/editLibro";
    };

    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container">
                <h2>Libros</h2>
                <div className="mb-3">
                    <label htmlFor="autorInput" className="form-label">Autor:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="autorInput"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tituloInput" className="form-label">Título:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="tituloInput"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>
                {isAdmin && (
                    <>
                        <button className="btn btn-primary mb-3" onClick={handleAddPermission} >Añadir Libro</button>
                    </>)}
                {message && (
                    <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'} alert-dismissible`} role="alert">
                        <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
                        {message}
                    </div>
                )}

                {libros.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>ISBN</th>
                                <th>Año de publicación</th>
                                <th>Editorial</th>
                                <th>Autor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {libros.map((libro) => (
                                <tr key={libro.libro_id}>
                                    <td>{libro.titulo}</td>
                                    <td>{libro.ISBN}</td>
                                    <td>{libro.año_publicacion}</td>
                                    <td>{libro.editorial}</td>
                                    <td>{libro.autor}</td>
                                    <td>{libro.estado}</td>
                                    <td>
                                        {isAdmin && (
                                            <>
                                                <button className="btn btn-primary btn-sm me-2">
                                                    <Link to={`/editLibro/${libro.libro_id}`} className="text-white text-decoration-none">
                                                        Editar
                                                    </Link>
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteLibro(libro.libro_id)}>Eliminar</button>
                                            </>
                                        )}
                                        <button className="btn btn-success btn-sm" onClick={() => handleSolicitarLibro(libro.libro_id)}>
                                            Solicitar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay datos disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default LibroTable;