import Navbar from "./Navbar";
import Logo from './logo_espe.png';

const Home = (props) => {
    const { permissions } = props;
    return (
        <div>
            <Navbar permissions={permissions} />
            <div className="container mt-5">
                <div className="text-center">
                    <h1>Libros Alejandro Segovia Espe</h1>
                    <img src={Logo} alt="Libros" className="img-fluid mt-3" />
                </div>
            </div>
        </div>
    );
}

export default Home;