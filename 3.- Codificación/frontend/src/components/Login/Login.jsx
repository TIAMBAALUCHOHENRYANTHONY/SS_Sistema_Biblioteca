import { useState, useEffect } from "react";
import { login } from "../../api/Autentication";
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Inicio/Inicio.png';
import LogoEspe from './logo_espe.jpg';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('registrationSuccess') === 'true') {
            setRegistrationSuccess(true);
        } else {
            setRegistrationSuccess(false);
        }
    }, [location]);

    const handdleLogin = async (e) => {
        e.preventDefault();

        try {
            const result = await login(username, password);
            if (result.token) {
                localStorage.setItem('token', result.token);
                window.location.href = "/home";
            } else {
                setError('Credenciales incorrectas. Por favor, inténtelo de nuevo.');
            }
        } catch (error) {
            console.log(error);
            setError('Error en la solicitud. Por favor, inténtelo de nuevo.');
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
                                        {/* Contenido de la columna derecha (inputs y botón) */}
                                        <h5 className="card-title text-center fw-bold">Bienvenido !! </h5>
                                        <form>
                                            <div className="mb-3">
                                                <label htmlFor="username" className="form-label fw-bold">Usuario:</label>
                                                <input onChange={(event) => { setUsername(event.target.value) }} type="text" placeholder="Ingrese su Usuario" className="form-control" id="username" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label fw-bold">Contraseña:</label>
                                                <input onChange={(event) => { setPassword(event.target.value) }} type="password" placeholder="Ingrese su Contraseña" className="form-control" id="password" />
                                            </div>
                                            {error && <div className="alert alert-danger">{error}</div>}
                                            <button onClick={handdleLogin} className="btn btn-success w-100 fw-bold">Iniciar Sesión</button>
                                        </form>
                                        <div className="text-center mt-3">
                                            <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
                                        </div>
                                        {registrationSuccess && (
                                            <div className="alert alert-success" role="alert">
                                                Registro exitoso. Ahora puedes iniciar sesión.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;