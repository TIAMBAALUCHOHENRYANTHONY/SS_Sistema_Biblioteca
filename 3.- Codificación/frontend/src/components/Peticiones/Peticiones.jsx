import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerPrestamos, eliminarPrestamo } from '../../api/Peticiones'; // Importar las funciones de la API de peticiones
import Navbar from '../Home/Navbar';
import { actualizarEstadoLibro, obtenerLibrosPorEstado } from '../../api/Libros';

const PeticionTable = (props) => {
    const { permissions } = props;
    const [peticiones, setPeticiones] = useState([]);
    const [libros, setLibros] = useState([]);
    const [message, setMessage] = useState(null);
    const [estadoActualizado, setEstadoActualizado] = useState(false);

    const permissionIsIncluded = (permission) => {
        return permissions.includes(permission);
    };

    const isAdmin = permissionIsIncluded('administrador');

    useEffect(() => {
        fetchPeticiones();
    }, []);

    const fetchPeticiones = async () => {
        try {
            const peticionesData = await obtenerPrestamos();
            setPeticiones(peticionesData);
            const librosData = await obtenerLibrosPorEstado('Prestado');
            setLibros(librosData);
        } catch (error) {
            console.error('Error al obtener peticiones:', error);
        }
    };

    const handleAceptarPrestamo = async (libro_id) => {
        try {
            await actualizarEstadoLibro(libro_id, 'Prestado');
            setPeticiones(peticiones.filter((peticion) => peticion.libro_id !== libro_id));
            setMessage('Prestamo Aceptado correctamente');
        } catch (error) {
            console.error('Error al eliminar Libro:', error);
            setMessage('Ha ocurrido un error al intentar aceptar el prestamo');
        }
    };

    const handleIngresoLibro = async (libro_id) => {
        try {
            await actualizarEstadoLibro(libro_id, 'Disponible');
            setMessage('Prestamo Ingresado correctamente');
        } catch (error) {
            console.error('Error al eliminar Libro:', error);
            setMessage('Ha ocurrido un error al intentar aceptar el libro');
        }
    };

    const handleEliminarPeticion = async (peticionId) => {
        try {
            await eliminarPrestamo(peticionId);
            setPeticiones(peticiones.filter((peticion) => peticion.peticion_id !== peticionId));
            setMessage('Peticion eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar peticion:', error);
            setMessage('Ha ocurrido un error al intentar eliminar la peticion');
        }
    };

    const handleAddPermission = () => {
        window.location.href = "/modalPrestamo";
    };

    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container">
                <h2>Prestamos</h2>
                {isAdmin && (
                    <button className="btn btn-primary mb-3" onClick={handleAddPermission} >Añadir Peticion</button>
                )}

                {peticiones.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Libro Id</th>
                                <th>Fecha Apertura</th>
                                <th>Fecha Devolucion</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peticiones.map((peticion, index) => (
                                <tr key={index}>
                                    <td>{peticion.libro_id}</td>
                                    <td>{peticion.fecha_prestamo}</td>
                                    <td>{peticion.fecha_devolucion}</td>
                                    <td>
                                        {isAdmin && (
                                            <>
                                                <button className="btn btn-success btn-sm" onClick={() => { handleAceptarPrestamo(peticion.libro_id); handleEliminarPeticion(peticion.prestamo_id); }}>Aceptar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay datos disponibles.</p>
                )}
            </div>
            <div className="container">
                <h2>Libros</h2>
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
                                        <button className="btn btn-success btn-sm" onClick={() => handleIngresoLibro(libro.libro_id)}>
                                            Aprobar Ingreso
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

export default PeticionTable;
