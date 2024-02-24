import LibroTable from "../Libros/Libros";
import Navbar from "./Navbar";

const Home = (props) => {
    const { permissions } = props;
    return (
        <div>
            <Navbar permissions={permissions} />
        </div>
    );
}

export default Home;