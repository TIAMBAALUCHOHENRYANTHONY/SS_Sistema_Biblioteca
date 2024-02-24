import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { crearPrestamo, obtenerPrestamo } from '../../api/Peticiones';

const PeticionModal = () => {
    const [libroId, setLibroId] = useState('');
    const [fechaPrestamo, setFechaPrestamo] = useState('');
    const [fechaDevolucion, setFechaDevolucion] = useState('');
    const { id } = useParams();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchPeticion = async () => {
            try {
                const peticion = await obtenerPrestamo(id);
                setLibroId(peticion.libro_id);
                setFechaPrestamo(peticion.fecha_prestamo);
                setFechaDevolucion(peticion.fecha_devolucion);
            } catch (error) {
                console.error('Error fetching peticion:', error);
                // Manejar el error si es necesario
            }
        };

        if (id) {
            fetchPeticion();
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newPeticion = { libro_id: libroId, fecha_prestamo: fechaPrestamo, fecha_devolucion: fechaDevolucion };
        await guardarPeticion(newPeticion);
    };

    const guardarPeticion = async (peticionData) => {
        try {
            const result = await crearPrestamo(peticionData);
            if (result != null) {
                const url = new URL('/peticiones', window.location.origin);
                url.searchParams.append('message', 'Peticion creada correctamente');
                window.location.href = url.toString();
            } else {
                const url = new URL('/peticiones', window.location.origin);
                url.searchParams.append('message', 'Error al crear la petición');
                window.location.href = url.toString();
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setMessage('Error en la solicitud. Por favor, inténtelo de nuevo.');
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title">Datos de la Petición</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="libroId" className="form-label">ID del Libro:</label>
                        <input type="text" className="form-control" id="libroId" value={libroId} onChange={(e) => setLibroId(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaPrestamo" className="form-label">Fecha de Préstamo:</label>
                        <input type="date" className="form-control" id="fechaPrestamo" value={fechaPrestamo} onChange={(e) => setFechaPrestamo(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fechaDevolucion" className="form-label">Fecha de Devolución:</label>
                        <input type="date" className="form-control" id="fechaDevolucion" value={fechaDevolucion} onChange={(e) => setFechaDevolucion(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
            </div>
            {message && (
                <div className={`alert ${message.startsWith('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                </div>
            )}
        </div>
    );
};

export default PeticionModal;
