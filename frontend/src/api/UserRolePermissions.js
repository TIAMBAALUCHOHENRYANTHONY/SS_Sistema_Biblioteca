import axios from 'axios';
import CryptoJS from 'crypto-js';

// Función para desencriptar los datos
const decryptData = (encryptedData, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const baseURL = 'http://localhost:5000';
const KEY = 'TuClaveSecretaAquí';

// Funciones para usuarios
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    const encryptedData = response.data;
    const decryptedData = decryptData(encryptedData, KEY);
    return decryptedData;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getUserByName = async (username) => {
  try {
    const response = await axios.get(`${baseURL}/userName/${username}`);
    const encryptedData = response.data;
    const decryptedData = decryptData(encryptedData, KEY);
    return decryptedData;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUserById = async (userId, userData) => {
  try {
    const response = await axios.put(`${baseURL}/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${baseURL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Funciones para roles
export const createRole = async (roleData) => {
  try {
    const response = await axios.post(`${baseURL}/roles`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const getRoleById = async (roleId) => {
  try {
    const response = await axios.get(`${baseURL}/roles/${roleId}`);
    const encryptedData = response.data;
    const decryptedData = decryptData(encryptedData, KEY);
    return decryptedData;
  } catch (error) {
    console.error('Error fetching role:', error);
    throw error;
  }
};

export const getAllRoles = async () => {
  try {
    const response = await axios.get(`${baseURL}/roles`);
    const encryptedDataList = response.data;
    const decryptedDataList = encryptedDataList.map(encryptedData => decryptData(encryptedData, KEY));
    return decryptedDataList;
  } catch (error) {
    console.error('Error fetching all roles:', error);
    throw error;
  }
};

export const updateRoleById = async (roleId, roleData) => {
  try {
    const response = await axios.put(`${baseURL}/roles/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRoleById = async (roleId) => {
  try {
    const response = await axios.delete(`${baseURL}/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Funciones para permisos
export const createPermission = async (permissionData) => {
  try {
    const response = await axios.post(`${baseURL}/permissions`, permissionData);
    return response.data;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

export const getPermissionById = async (permissionId) => {
  try {
    const response = await axios.get(`${baseURL}/permissions/${permissionId}`);
    const encryptedData = response.data;
    const decryptedData = decryptData(encryptedData, KEY);
    return decryptedData;
  } catch (error) {
    console.error('Error fetching permission:', error);
    throw error;
  }
};

export const getAllPermissions = async () => {
  try {
    const response = await axios.get(`${baseURL}/permissions`);
    const encryptedDataList = response.data;
    const decryptedDataList = encryptedDataList.map(encryptedData => decryptData(encryptedData, KEY));
    return decryptedDataList;
  } catch (error) {
    console.error('Error fetching all permissions:', error);
    throw error;
  }
};

export const updatePermissionById = async (permissionId, permissionData) => {
  try {
    const response = await axios.put(`${baseURL}/permissions/${permissionId}`, permissionData);
    return response.data;
  } catch (error) {
    console.error('Error updating permission:', error);
    throw error;
  }
};

export const deletePermissionById = async (permissionId) => {
  try {
    const response = await axios.delete(`${baseURL}/permissions/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    const encryptedDataList = response.data;
    const decryptedDataList = encryptedDataList.map(encryptedData => decryptData(encryptedData, KEY));
    return decryptedDataList;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
};
export const updateRoleUserById = async (userId, userData) => {
  try {
    const response = await axios.put(`${baseURL}/userRole/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};