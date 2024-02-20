import axios from 'axios';

const AUTH_URL = 'http://localhost:5000';

export const login = async (username, password) => {
    try {
        const response = await axios.post(AUTH_URL + '/login', {
            username: username,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};