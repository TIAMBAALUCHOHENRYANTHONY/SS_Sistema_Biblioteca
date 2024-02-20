import React, { useState } from 'react';
import { registerUser } from '../../api/Autentication';

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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Registro</h2>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Usuario:</label>
                                <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña:</label>
                                <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button onClick={handleRegister} className="btn btn-primary">Register</button>
                            {error && <div className="alert alert-danger">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
