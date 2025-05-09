import axios from 'axios';

const api = axios.create({
    baseURL: `http://localhost:3000`,  
});

export const registerUser = async (name: string, email: string, password: string) => {
    try {
        const response = await api.post('/auth/register', {
            name,
            email,
            password,
            role: 'STUDENT',  
        });
        return response.data; 
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'Error registering user');
        } else {
            throw new Error('Error registering user');
        }
    }
};