import React, { useState } from 'react';
import { registerUser } from '../../api/Autentication';
import Logo from '../Inicio/Inicio.png';
import LogoEspe from './logo_espe.jpg';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await registerUser(username, password);
            console.log(response);
            window.location.href = "/login?registrationSuccess=true";
        } catch (error) {
            console.error('Error registering user:', error);
            setError('Error registering user');
        }
    };

    return (
        <div className="background-image" style={{ backgroundImage: `url(${Logo})`, backgroundSize: 'cover', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0', padding: '20px', borderRadius: '10px', border: '2px solid rgba(0, 128, 0, 0.3)' }}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card" style={{ margin: '10vh auto', padding: '20px', borderRadius: '10px', border: '10px solid rgba(0, 128, 0, 0.3)' }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                                        {/* Contenido de la columna izquierda (imagen) */}
                                        <img src={LogoEspe} alt="Logo" style={{ maxWidth: '100%', height: 'auto' }} />
                                    </div>
                                    <div className="col-md-6">
                                        <h2 className="card-title text-center fw-bold">Registro</h2>
                                        <div className="mb-3">
                                            <label htmlFor="username" className="form-label fw-bold">Usuario:</label>
                                            <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-bold">Contraseña:</label>
                                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <button onClick={handleRegister} className="btn btn-success w-100 fw-bold">Registro</button>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
