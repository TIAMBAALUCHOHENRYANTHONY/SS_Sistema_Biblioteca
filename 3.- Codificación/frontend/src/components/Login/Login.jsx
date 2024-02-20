import { useState, useEffect } from "react";
import { login } from "../../api/Autentication";
import { Link, useLocation } from 'react-router-dom';

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
        }else {
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
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title text-center">Login</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Usuario:</label>
                                    <input onChange={(event) => { setUsername(event.target.value) }} type="text" placeholder="Usuario" className="form-control" id="username" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña:</label>
                                    <input onChange={(event) => { setPassword(event.target.value) }} type="password" placeholder="Contraseña" className="form-control" id="password" />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button onClick={handdleLogin} className="btn btn-primary">Login</button>
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
    );
}

export default Login;