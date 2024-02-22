import React from 'react';
import backgroundImg from './Inicio.png';
import { Link } from 'react-router-dom';

const Inicio = () => {
  return (
    <div className="container-fluid p-0 ">
      <div className="position-relative">
        <img
          className="img-fluid position-absolute"
          src={backgroundImg}
          alt="Fondo"
        />
      </div>
      <div className="btn-toolbar justify-content-between px-3">
        <div className="btn-group" style={{ width: '10%', marginTop: '47%', marginLeft: '30%' }}>
          <Link to="/login" >
            <button className="btn btn-secondary" style={{ backgroundColor: 'white', color: 'black' }}>Iniciar Sesión</button>
          </Link>
        </div>
        <div className="btn-group" style={{ width: '10%', marginTop: '47%', marginRight: '30%' }}>
          <Link to="/register">
            <button className="btn btn-secondary" style={{ backgroundColor: 'white', color: 'black' }}>Registrarse</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Inicio;