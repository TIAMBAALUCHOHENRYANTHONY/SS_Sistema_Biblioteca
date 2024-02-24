import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { actualizarLibro, crearLibro, obtenerLibroPorId } from '../../api/Libros';

const LibroModal = () => {
    const [titulo, setTitulo] = useState('');
    const [ISBN, setISBN] = useState('');
    const [añoPublicacion, setAñoPublicacion] = useState('');
    const [editorial, setEditorial] = useState('');
    const [autor, setAutor] = useState('');
    const [estado, setEstado] = useState('');
    const { id } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchLibro = async () => {
            try {
                const libro = await obtenerLibroPorId(id);
                if (libro) {
                    setTitulo(libro.titulo);
                    setISBN(libro.ISBN);
                    setAñoPublicacion(libro.año_publicacion);
                    setEditorial(libro.editorial);
                    setAutor(libro.autor);
                    setEstado(libro.estado);
                }
            } catch (error) {
                console.error('Error al obtener el libro:', error);
                // Manejar el error si es necesario
            }
        };
        if (id) {
            fetchLibro();
        }

    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const libroUpdate = { titulo, ISBN, año_publicacion: añoPublicacion, editorial, autor, estado };
        if (id) {
            editLibro(id, libroUpdate);
        } else {
            saveLibro(libroUpdate);
        }
    };

    const editLibro = async (id, libro) => {
        try {
            const result = await actualizarLibro(id, libro);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/libros', window.location.origin);
                url.searchParams.append('message', 'Actualización exitosa');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Si no se pudo actualizar, redirige con un mensaje de error
                const url = new URL('/libros', window.location.origin);
                url.searchParams.append('message', 'Error en la actualización');
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };

    const saveLibro = async (permissionData) => {
        try {
            const result = await crearLibro(permissionData);
            if (result != null) {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/libros', window.location.origin);
                url.searchParams.append('message', 'Libro Creado Correctamente');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            } else {
                // Construye la URL con el mensaje como parámetro de búsqueda
                const url = new URL('/libros', window.location.origin);
                url.searchParams.append('message', 'Error al crear el libro');

                // Redirige a la nueva URL
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ margin: '10vh auto', padding: '20px', borderRadius: '10px', border: '10px solid rgba(0, 128, 0, 0.3)' }}>
                        <div className="card-header">
                            <h5 className="card-title">Datos del Libro</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="titulo" className="form-label">Título:</label>
                                    <input type="text" className="form-control" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ISBN" className="form-label">ISBN:</label>
                                    <input type="text" className="form-control" id="ISBN" value={ISBN} onChange={(e) => setISBN(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="añoPublicacion" className="form-label">Año de publicación:</label>
                                    <input type="text" className="form-control" id="añoPublicacion" value={añoPublicacion} onChange={(e) => setAñoPublicacion(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editorial" className="form-label">Editorial:</label>
                                    <input type="text" className="form-control" id="editorial" value={editorial} onChange={(e) => setEditorial(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="autor" className="form-label">Autor:</label>
                                    <input type="text" className="form-control" id="autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="estado" className="form-label">Estado:</label>
                                    <input type="text" className="form-control" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-success">Añadir Libro</button>
                            </form>
                        </div>
                        {message && (
                            <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default LibroModal;
