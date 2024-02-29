import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "../Login/Login.jsx";
import Home from "../Home/Home.jsx";
import Register from "../Login/Register.jsx";
import PermissionTable from "../Permissions/Permissions.jsx";
import PermissionModal from "../Permissions/PermissionModal.jsx";
import RoleTable from "../Role/Role.jsx";
import RoleModal from "../Role/RoleModal.jsx";
import UserTable from "../Users/User.jsx";
import UserModal from "../Users/UserModal.jsx";
import { getPermissionById, getRoleById, getUserByName } from "../../api/UserRolePermissions.js";
import Inicio from "../Inicio/Inicio.jsx";
import LibroModal from "../Libros/LibrosModal.jsx";
import PeticionModal from "../Peticiones/ModalPeticiones.jsx";
import PeticionTable from "../Peticiones/Peticiones.jsx";
import LibroTable from "../Libros/Libros.jsx";
import UserPasswordModal from "../Users/PasswordModal.jsx";

function parseJwt(token) {
  if (!token) {
    return null;
  }

  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window.atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const Main = () => {

  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      setUsername(decodedToken.username);
    }

  }, []);

  const isLoggedIn = localStorage.getItem("token") && parseJwt(localStorage.getItem("token")).exp * 1000 > Date.now();

  const fetchUserData = async () => {
    try {
      const user = await getUserByName(username);
      setUser(user);
      if (user.role_id) {
        const rol = await getRoleById(user.role_id);
        const permissionsIds = rol.permissions;
        const permissionsWithName = [];
        for (const permissionId of permissionsIds) {
          const permission = await getPermissionById(permissionId);
          permissionsWithName.push(permission.name);
        }
        setPermissions(permissionsWithName);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  if (username) {
    if (!permissions || permissions.length === 0) {
      fetchUserData();
    }
  }

  const hasPermission = (requiredPermissions) => {
    return requiredPermissions.every((permission) => permissions.includes(permission));
  };


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route
          path="/editLibro/:id?"
          element={
            
              isLoggedIn ? <LibroModal /> : <Login />
            
          }
        />
        <Route path="/libros" element={isLoggedIn ? <LibroTable permissions={permissions} /> : <Login />} />
        <Route
          path="/modalPrestamo/:id?"
          element={
            isLoggedIn ? (
              <PeticionModal permissions={permissions} />
            ) : (
              <Login />
            )
          }
        />

        {/* Ruta para la tabla de prestamos */}
        <Route
          path="/prestamos"
          element={
            isLoggedIn ? (
              <PeticionTable permissions={permissions} />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Home permissions={permissions} /> : <Login />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home permissions={permissions} /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Home permissions={permissions} /> : <Register />}
        />
        <Route
          path="/modalPassword"
          element={isLoggedIn ? <UserPasswordModal user={user} /> : <Login />}
        />
        <Route
          path="/permissions"
          element={hasPermission(['administrador']) ? (isLoggedIn ? <PermissionTable permissions={permissions} /> : <Login />) : <Navigate to="/home" />}
        />
        <Route
          path="/modalPermission/:id?"
          element={isLoggedIn ? <PermissionModal /> : <Login />}
        />
        <Route
          path="/roles"
          element={hasPermission(['administrador']) ? (isLoggedIn ? <RoleTable permissions={permissions} /> : <Login />) : <Navigate to="/home" />}
        />
        <Route
          path="/modalRole/:id?"
          element={isLoggedIn ? <RoleModal /> : <Login />}
        />
        <Route
          path="/users"
          element={hasPermission(['administrador']) ? (isLoggedIn ? <UserTable permissions={permissions} /> : <Login />) : <Navigate to="/home" />}
        />
        <Route
          path="/modalUser/:id?"
          element={isLoggedIn ? <UserModal /> : <Login />}
        />
      </Routes>
    </Router>
  );
};
export default Main;

