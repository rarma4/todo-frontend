import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3333/',
    baseURL: 'https://todo-backend-t1qi.onrender.com',
})

export default api;